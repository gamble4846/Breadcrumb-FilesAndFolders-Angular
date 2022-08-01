import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServicesService } from 'src/app/Services/CommonServices/common-services.service';
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
  CurrentLocationGre4:any = false;

  constructor(public _cs : CommonServicesService, private route: ActivatedRoute, private router:Router, private LocalBase:LocalBaseService) { }

  ngOnInit(): void {
    this.StartUpFun();
  }

  fullDocumentClick(event:any){
    var rightClickMenu:any = document.getElementById("gs-drop-box-right-click-menu");
    if(!rightClickMenu.contains(event.target)){
        rightClickMenu.classList.remove("open");
        var trsHovered = document.getElementsByClassName("gs-folder-files-table-tr-hover");
        for (let index = 0; index < trsHovered.length; index++) {
            const trHovered = trsHovered[index];
            trHovered.classList.remove("gs-folder-files-table-tr-hover");
        }
    }

    var uploadButton:any = document.getElementById("gs-squareButtonUpload");
    var uploadDropDown:any = document.getElementById("gs-drop-down-for-upload-button");
    if(!uploadButton.contains(event.target)){
        uploadDropDown.classList.remove("open");
    }

    var createButton:any = document.getElementById("gs-squareButtonCreate");
    var createDropDown:any = document.getElementById("gs-drop-down-for-create-button");
    if(!createButton.contains(event.target)){
        createDropDown.classList.remove("open");
    }
  }

  showRightClickMenu(event:any){
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
    var rightClickElements = document.getElementsByClassName("allowRightClick");
    console.log(rightClickElements);
    for (let index = 0; index < rightClickElements.length; index++) {
        const rightClickElement = rightClickElements[index];
        rightClickElement.addEventListener("contextmenu", this.showRightClickMenu);
    }

    document.addEventListener("click", this.fullDocumentClick);

    this.route.queryParams.subscribe(params => {
      this.ServerIDURL = params['ServerId'];
      this.UpperFolderIDURL = params['FolderId'] == "" || params['FolderId'] == null || params['FolderId'] == undefined ? "-" : params['FolderId'];

      if(this.ServerIDURL == "" || this.ServerIDURL == null || this.ServerIDURL == undefined){
        this.getServerList();
        this.onlyServers = true;
      }
      else{
        this.getFoldersFiles();
        this.onlyServers = false;
      }
    });
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
        this.CurrentLocationGre4 = false;
        if(this.currentLocation.length > 4){
          let tempLocation:any = [];
          tempLocation.push(this.currentLocation[this.currentLocation.length - 3]);
          tempLocation.push(this.currentLocation[this.currentLocation.length - 2]);
          tempLocation.push(this.currentLocation[this.currentLocation.length - 1]);
          tempLocation.push(this.currentLocation[this.currentLocation.length]);
          this.currentLocation = tempLocation;
          this.CurrentLocationGre4 = true;
        }
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
      this.finalTableData = this.FoldersFilesObj;
      this.getCurrentLocation();
    });
  }

  refreshFilesAndFolders(){
    this.LocalBase.SaveFoldersFilesFromSheetAndSavetoLocalBase().subscribe((response:any) => {
      if(response == true){
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
    this._cs.openFile();
    this.OpenedFile = file;
    this.OpenedFileLinks = fileLinks;
    if(this.OpenedFileLinks.length > 0){
      this.OpenLink(this.OpenedFileLinks[0]);
    }
  }

  CloseFile(){
    this.fileOpened = false;
  }

  OpenLink(data:any){
    this.CurrentLink = data;
    this.OpenedGoogleDriveFileEmbbedLink = "https://drive.google.com/file/d/" + this.CurrentLink.Link_link.split("/")[5] + "/preview";
  }

  GetIconSRC(iconName:string){
    console.log(iconName);
    return this._cs.GetIconSRC(iconName);
  }

  PreviousFile(fileId:any){
    let files = this.FoldersFilesObj.Files;
    let currentIndex = files.findIndex((x:any) => x.Files_Id == fileId);
    if(currentIndex != 0 && currentIndex != -1){
      this.getFileLinks(files[currentIndex-1]);
    }
    console.log(this.OpenedFile);
  }

  NextFile(fileId:any){
    let files = this.FoldersFilesObj.Files;
    let currentIndex = files.findIndex((x:any) => x.Files_Id == fileId);
    if(currentIndex < files.length && currentIndex != -1){
      this.getFileLinks(files[currentIndex+1]);
    }
    console.log(this.OpenedFile);
  }
}
