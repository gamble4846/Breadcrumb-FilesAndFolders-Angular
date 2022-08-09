import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
  CurrentLocationGre4:boolean = false;

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

  setUpRightClickEvents(){

  }

  updateRightClickEvent(){
    var rightClickElements = document.getElementsByClassName("allowRightClick");
    for (let index = 0; index < rightClickElements.length; index++) {
      const rightClickElement = rightClickElements[index];
      rightClickElement.addEventListener("contextmenu", this.showRightClickMenu);
    }
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
      }
      else{
        this.getFoldersFiles();
        this.onlyServers = false;
      }
    });

    this.updateRightClickEvent();
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
    document.getElementById("openedFileIFrame")?.setAttribute("src", this.OpenedGoogleDriveFileEmbbedLink);
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
}
