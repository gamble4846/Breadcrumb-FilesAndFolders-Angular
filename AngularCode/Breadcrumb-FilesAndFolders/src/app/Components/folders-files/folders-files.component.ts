import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServicesService } from 'src/app/Services/CommonServices/common-services.service';
import { CustomNotificationService } from 'src/app/Services/CustomNotification/custom-notification.service';
import { GoogleAppScritsService } from 'src/app/Services/GoogleAppScripts/google-app-scrits.service';
import { LocalBaseService } from 'src/app/Services/LocalBase/local-base.service';

@Component({
  selector: 'app-folders-files',
  templateUrl: './folders-files.component.html',
  styleUrls: ['./folders-files.component.css']
})
export class FoldersFilesComponent implements OnInit {
  ServersList:any;
  FoldersFilesObj:any = {
    Folders: [],
    Files: [],
    ServerId: ""
  };
  finalTableData:any;
  ServerIDURL:string = "";
  UpperFolderIDURL:string = "";
  onlyServers:boolean = false;
  currentLocation:any = [];
  dataInfo:any = {};
  infoOpened:boolean = false;
  fileOpened:boolean = false;
  OpenedFile:any = {};
  OpenedFileLinks:any = [];
  CurrentLink:any = {};
  OpenedGoogleDriveFileEmbbedLink:any = "";
  CurrentLocationGre4:boolean = false;

  constructor(private googleAppScritsService: GoogleAppScritsService, private customNotificationService: CustomNotificationService,public _cs : CommonServicesService, private route: ActivatedRoute, private router:Router, private LocalBase:LocalBaseService) { }

  ngOnInit(): void {
    this.StartUpFun();
  }

  fullDocumentClick(event:any){
    var rightClickMenu:any = document.getElementById("gs-drop-box-right-click-menu");
    var renamepopOver:any = document.getElementById("gs-drop-box-rename-popOver");

    var hideRightClickMenu:boolean = false;

    if(!rightClickMenu.contains(event.target) && !renamepopOver){
      hideRightClickMenu = true;
    }

    if(hideRightClickMenu){
      rightClickMenu.classList.remove("open");
      var trsHovered = document.getElementsByClassName("gs-folder-files-table-tr-hover");
      for (let index = 0; index < trsHovered.length; index++) {
          const trHovered = trsHovered[index];
          trHovered.classList.remove("gs-folder-files-table-tr-hover");
      }
    }

    try{
      var uploadButton:any = document.getElementById("gs-squareButtonUpload");
      var uploadDropDown:any = document.getElementById("gs-drop-down-for-upload-button");
      if(!uploadButton.contains(event.target)){
        uploadDropDown.classList.remove("open");
    }
    }
    catch(ex){}

    try{
      var createButton:any = document.getElementById("gs-squareButtonCreate");
      var createDropDown:any = document.getElementById("gs-drop-down-for-create-button");
      if(!createButton.contains(event.target)){
          createDropDown.classList.remove("open");
      }
    }
    catch(ex){}
  }

  showRightClickMenu(event:any, data:any, isFolder:boolean){
    var trsHovered = document.getElementsByClassName("gs-folder-files-table-tr-hover");
    for (let index = 0; index < trsHovered.length; index++) {
        const trHovered = trsHovered[index];
        trHovered.classList.remove("gs-folder-files-table-tr-hover");
    }

    event.target.closest("tr").classList.add("gs-folder-files-table-tr-hover");
    event.preventDefault();
    var rightClickMenu:any = document.getElementById("gs-drop-box-right-click-menu");


    var _docHeight = window.innerHeight;
    var _docWidth = window.innerWidth;

    rightClickMenu.classList.add("open");
    var rightClickMenuWidth = 250;
    rightClickMenu.style.top = event.clientY + "px";


    if((_docWidth - event.clientX) < (rightClickMenuWidth + 20)){
        rightClickMenu.style.right = _docWidth - event.clientX + "px";
        rightClickMenu.style.left = "auto";
    }
    else{
        rightClickMenu.style.right = "auto";
        rightClickMenu.style.left = event.clientX + "px";
    }

    rightClickMenu.style.maxHeight = (_docHeight - event.clientY - 20) + "px";

    //-------------Setting Data----------------
    var rightClickData:any = {
      data: data,
      isFolder: isFolder,
      ServerId: this.ServerIDURL
    }
    localStorage.setItem("rightClickData", JSON.stringify(rightClickData));
    document.getElementById("getFileDataHiddenBTN")?.click();
    //getFileDataHiddenBTN.click();
    //-----------------------------------------
  }

  showUploadDropDown(){
    var dropDown:any = document.getElementById("gs-drop-down-for-upload-button");
    dropDown.classList.add("open");
  }

  showCreateDropDown(){
    var dropDown:any = document.getElementById("gs-drop-down-for-create-button");
    dropDown.classList.add("open");
  }

  StartUpFun(){
    document.addEventListener("click", this.fullDocumentClick);

    document.getElementById("NextButtonFile")?.addEventListener("click", this.NextFile_);
    document.getElementById("PreviousButtonFile")?.addEventListener("click", this.PreviousFile_);

    this.route.queryParams.subscribe(params => {
      this.ServerIDURL = params['ServerId'];
      this.UpperFolderIDURL = params['FolderId'] == "" || params['FolderId'] == null || params['FolderId'] == undefined ? "-" : params['FolderId'];

      if(this.ServerIDURL == "" || this.ServerIDURL == null || this.ServerIDURL == undefined){
        this.getServerList();
        this.onlyServers = true;
        document.getElementById("gs-squareButtonUpload")?.classList.add("disabledCreateButton");
      }
      else{
        this.getFoldersFiles();
        this.onlyServers = false;
        this.UpdateRightMenu();
        document.getElementById("gs-squareButtonUpload")?.classList.remove("disabledCreateButton");
      }
    });
  }

  UpdateRightMenu(){
    var currentFolderData:any = {
      FolderId: this.UpperFolderIDURL,
      ServerId: this.ServerIDURL
    }
    localStorage.setItem("CurrentFolderData", JSON.stringify(currentFolderData));
    document.getElementById("UpdateRightMenuDataBTNHidden")?.click();
  }

  NextFile_(){
    document.getElementById("NextFileHiddenBTN")?.click();
  }

  PreviousFile_(){
    document.getElementById("PreviousFileHiddenBTN")?.click();
  }

  ShowAllServers(){
    this.currentLocation = [];
    this.router.navigate(
      ['/FoldersAndFiles']
    );
  }

  ServerClicked(ServerId:any){
    this.router.navigate(
      ['/FoldersAndFiles'],
      { queryParams: { ServerId: ServerId } }
    );
  }

  FolderClicked(ServerId:any, FolderId:any){
    this.router.navigate(
      ['/FoldersAndFiles'],
      { queryParams: { ServerId: ServerId, FolderId: FolderId } }
    );
  }

  getCurrentLocation(){
    this.currentLocation = [];
    if(this.UpperFolderIDURL != "-"){
      this.LocalBase.GetAllFodlersByServerID(this.ServerIDURL).subscribe((response:any) => {
        let allFolders = response;
        this.currentLocation.push(allFolders.find((x:any) => x.Folder_Id == this.UpperFolderIDURL));
        while(this.currentLocation[this.currentLocation.length - 1].Folder_UpperFolderId != "-"){
          this.currentLocation.push(
            allFolders.find((x:any) => x.Folder_Id == this.currentLocation[this.currentLocation.length - 1].Folder_UpperFolderId)
          );
        }
        this.currentLocation.reverse();
      });
    }
  }

  getServerList(){
    this.LocalBase.GetFoldersFilesServersList().subscribe((response:any) => {
      this.ServersList = response;
      this.finalTableData = this.ServersList;
    });
  }

  getFoldersFiles(){
    this.LocalBase.GetFoldersFilesByUpperFolderID(this.UpperFolderIDURL,this.ServerIDURL).subscribe((response:any) => {
      this.FoldersFilesObj = response;
      CommonServicesService.FoldersFilesObj = this.FoldersFilesObj;
      this.finalTableData = this.FoldersFilesObj;
      this.getCurrentLocation();
    });
  }

  refreshFilesAndFolders(){
    this.customNotificationService.SmallMessage("info","Refreshing Data From Sheets");
    this.LocalBase.SaveFoldersFilesFromSheetAndSavetoLocalBase().subscribe((response:any) => {
      if(response == true){
        this.customNotificationService.SmallMessage("success","Data Updated from Sheets");
        this.StartUpFun();
      }
    });
  }

  getFileLinks(File:any){
    let FileId = File.Files_Id;
    this.LocalBase.GetFilesLinkByFileID(FileId,this.ServerIDURL).subscribe((response:any) => {
      this.OpenFile(response, File);
    });
  }

  OpenFile(fileLinks:any, file:any){
    this.OpenedFile = file;
    this.OpenedFileLinks = fileLinks;
    if(this.OpenedFileLinks.length > 0){
      this.OpenLink(this.OpenedFileLinks[0], file);
    }
  }

  CloseFile(){
    this.fileOpened = false;
  }

  OpenLink(data:any, file:any){
    this.CurrentLink = data;
    this.OpenedGoogleDriveFileEmbbedLink = "https://drive.google.com/file/d/" + this.CurrentLink.Link_link.split("/")[5] + "/preview";
    // document.getElementById("openedFileIFrame")?.setAttribute("src", this.OpenedGoogleDriveFileEmbbedLink);
    let openFileIframe = document.getElementById("openedFileIFrame");
    var openFileIframeParent = openFileIframe?.parentElement;

    openFileIframe?.remove();
    openFileIframe?.setAttribute('src', this.OpenedGoogleDriveFileEmbbedLink);
    openFileIframeParent?.append(openFileIframe!);

    document.getElementById("gs-dropbox-file-model")?.setAttribute("data-file-id", file.Files_Id);
    var x:any = document.getElementById("fileModelFileName");
    x.innerHTML = file.Files_Name;
    this._cs.openFile();
  }

  GetIconSRC(iconName:string){
    return this._cs.GetIconSRC(iconName);
  }

  PreviousFile(event:any){
    let fileId = document.getElementById("gs-dropbox-file-model")?.getAttribute("data-file-id");
    let FoldersFilesObj = CommonServicesService.FoldersFilesObj;
    let files = FoldersFilesObj.Files;
    let currentIndex = files.findIndex((x:any) => x.Files_Id == fileId);
    if(currentIndex != 0 && currentIndex != -1){
      this.getFileLinks(files[currentIndex-1]);
    }
  }

  NextFile(event:any){
    let fileId = document.getElementById("gs-dropbox-file-model")?.getAttribute("data-file-id");
    let FoldersFilesObj = CommonServicesService.FoldersFilesObj;
    let files = FoldersFilesObj.Files;
    let currentIndex = files.findIndex((x:any) => x.Files_Id == fileId);
    if(currentIndex < files.length && currentIndex != -1){
      this.getFileLinks(files[currentIndex+1]);
    }
  }

  backOneFolder(){
    if(this.UpperFolderIDURL == "-"){
      this.ShowAllServers();
    }
    else{
      this.LocalBase.GetUpperFolderIdFromFolderIdAndServerId(this.UpperFolderIDURL,this.ServerIDURL).subscribe((response:any) => {
        if(response != -1){
          this.FolderClicked(this.ServerIDURL, response);
        }
      });
    }
  }

  CreateFolderClicked(){
    document.getElementById("create-folder-modal")?.classList.add("open");
  }

  UpdateStared(data:any, isFolder:boolean){
    data.Is_Stared = !data.Is_Stared;
    let values:any = {
      "Server_ID": this.ServerIDURL,
      "Is_Stared": data.Is_Stared,
      "Is_Folder": isFolder
    };

    if(isFolder){
      values.Prime_ID = data.Folder_Id;
      this.LocalBase.UpdateFolderToLocalBase(data, this.ServerIDURL).subscribe((res:any) => {
        document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
      })
    }
    else{
      values.Prime_ID = data.Files_Id;
      this.LocalBase.UpdateFileToLocalBase(data, this.ServerIDURL).subscribe((res:any) => {
        document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
      })
    }

    this.googleAppScritsService.PutStar(values).subscribe((response:any) => {
      if(response.status == "200"){
        if(isFolder){
          this.LocalBase.UpdateFolderToLocalBase(response.data, this.ServerIDURL).subscribe((res:any) => {
            document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
            if(response.data.Is_Stared){
              this.customNotificationService.SmallMessage("success", "Added to Stared - " + response.data.Folder_Name);
            }
            else{
              this.customNotificationService.SmallMessage("success", "Removed from Stared - " + response.data.Folder_Name);
            }

          })
        }
        else{
          this.LocalBase.UpdateFileToLocalBase(response.data, this.ServerIDURL).subscribe((res:any) => {
            document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
            if(response.data.Is_Stared){
              this.customNotificationService.SmallMessage("success", "Added to Stared - " + response.data.Files_Name);
            }
            else{
              this.customNotificationService.SmallMessage("success", "Removed from Stared - " + response.data.Files_Name);
            }
          })
        }
      }
      else{
        data.Is_Stared = !data.Is_Stared;
        if(isFolder){
          this.LocalBase.UpdateFolderToLocalBase(data, this.ServerIDURL).subscribe((res:any) => {
            document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
            this.customNotificationService.SmallMessage("error", "Error in Stared - Reverted");
          })
        }
        else{
          this.LocalBase.UpdateFileToLocalBase(data, this.ServerIDURL).subscribe((res:any) => {
            document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
            this.customNotificationService.SmallMessage("error", "Error in Stared - Reverted");
          })
        }
      }
    },
    (error) => {
      data.Is_Stared = !data.Is_Stared;
      if(isFolder){
        this.LocalBase.UpdateFolderToLocalBase(data, this.ServerIDURL).subscribe((res:any) => {
          document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
          this.customNotificationService.SmallMessage("error", "Error in Stared - Reverted");
        })
      }
      else{
        this.LocalBase.UpdateFileToLocalBase(data, this.ServerIDURL).subscribe((res:any) => {
          document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
          this.customNotificationService.SmallMessage("error", "Error in Stared - Reverted");
        })
      }
    });
  }

  CreateSingleFileClicked(){
    document.getElementById("create-file-modal")?.classList.add("open");
  }

  CreateGoogleFilesClicked(){
    document.getElementById("create-google-files-modal")?.classList.add("open");
  }
}
