import { Component, OnInit } from '@angular/core';
import { CommonServicesService } from 'src/app/Services/CommonServices/common-services.service';
import { CustomNotificationService } from 'src/app/Services/CustomNotification/custom-notification.service';
import { GoogleAppScritsService } from 'src/app/Services/GoogleAppScripts/google-app-scrits.service';
import { LocalBaseService } from 'src/app/Services/LocalBase/local-base.service';

@Component({
  selector: 'app-right-click-menu',
  templateUrl: './right-click-menu.component.html',
  styleUrls: ['./right-click-menu.component.css']
})
export class RightClickMenuComponent implements OnInit {

  FileFolderName:any;
  isFolder:boolean = false;
  currentData:any;
  showRenamePopOver:boolean = false;
  newFileName:any = "";
  ServerId:any = "";
  Prime_ID:any = "";

  constructor(private _cs: CommonServicesService, private lbs: LocalBaseService, private cusNoti: CustomNotificationService, private gas: GoogleAppScritsService) { }

  ngOnInit(): void {
  }

  GetFileFolderData(event:any){
    var rightClickData:any = localStorage.getItem("rightClickData");
    rightClickData = JSON.parse(rightClickData);

    console.log(rightClickData);

    this.isFolder = rightClickData.isFolder;
    this.currentData = rightClickData.data;
    this.ServerId = rightClickData.ServerId;

    if(this.isFolder){
      this.FileFolderName = this.currentData.Folder_Name;
      this.Prime_ID = this.currentData.Folder_Id;
    }
    else{
      this.FileFolderName = this.currentData.Files_Name;
      this.Prime_ID = this.currentData.Files_Id;
    }
  }

  SaveFileFoldername(){
    if(this.newFileName){
      document.getElementById("NewNameError")?.classList.remove("show");
      this.RenameFileOnSheets();
    }
    else{
      document.getElementById("NewNameError")?.classList.add("show");
    }
  }

  RenameFileOnSheets(){
    this._cs.ShowFullPageLoader();
    let values:any = {
      "Server_ID": this.ServerId,
      "Prime_ID": this.Prime_ID,
      "NewName": this.newFileName,
      "Is_Folder": this.isFolder
    }
    this.gas.PutRename(values).subscribe((response:any) => {
      if(response.status == "200"){
        this._cs.HideFullPageLoader();
        if(this.isFolder){
          this.lbs.UpdateFolderToLocalBase(response.data, this.ServerId).subscribe((res:any) => {
            document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
            this.cusNoti.SmallMessage("success", "Folder Renamed - " + response.data.Folder_Name);
          })
        }
        else{
          this.lbs.UpdateFileToLocalBase(response.data, this.ServerId).subscribe((res:any) => {
            document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
            this.cusNoti.SmallMessage("success", "File Renamed - " + response.data.Files_Name);
          })
        }
      }
      else{
        this._cs.HideFullPageLoader();
        if(this.isFolder){
          this.cusNoti.SmallMessage("error", "Folder Not Renamed");
        }
        else{
          this.cusNoti.SmallMessage("error", "File Not Renamed");
        }
      }
    },
    (error) => {
      this._cs.HideFullPageLoader();
      if(this.isFolder){
        this.cusNoti.SmallMessage("error", "Folder Not Renamed");
      }
      else{
        this.cusNoti.SmallMessage("error", "File Not Renamed");
      }
    });
  }

  CopyFileLink(){
    var links:any = null;
    this.lbs.GetFilesLinkByFileID(this.currentData.Files_Id, this.ServerId).subscribe((res:any) => {
      links = res;
      this._cs.copyText(links[0].Link_link);
      this.cusNoti.SmallMessage('success', 'Link Copied');
      document.getElementById("NothingButton")?.click();
    });
  }

  DeleteFileFolder(){
    this._cs.ShowFullPageLoader();
    
    var currentdate:any = new Date();
    currentdate = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    
    let values:any = {
      "Server_ID": this.ServerId,
      "Prime_ID": this.Prime_ID,
      "Is_Deleted": true,
      "Deleted_On": currentdate,
      "Is_Folder": this.isFolder
    }
    this.gas.DeleteFolderFile(values).subscribe((response:any) => {
      console.log(response);
      if(response.status == "200"){
        this._cs.HideFullPageLoader();
        if(this.isFolder){
          this.lbs.UpdateFolderToLocalBase(response.data, this.ServerId).subscribe((res:any) => {
            document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
            this.cusNoti.SmallMessage("success", "Folder Deleted - " + response.data.Folder_Name);
          })
        }
        else{
          this.lbs.UpdateFileToLocalBase(response.data, this.ServerId).subscribe((res:any) => {
            document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
            this.cusNoti.SmallMessage("success", "File Deleted - " + response.data.Files_Name);
          })
        }
      }
      else{
        this._cs.HideFullPageLoader();
        if(this.isFolder){
          this.cusNoti.SmallMessage("error", "Folder Not Deleted");
        }
        else{
          this.cusNoti.SmallMessage("error", "File Not Deleted");
        }
      }
    },
    (error) => {
      this._cs.HideFullPageLoader();
      if(this.isFolder){
        this.cusNoti.SmallMessage("error", "Folder Not Deleted");
      }
      else{
        this.cusNoti.SmallMessage("error", "File Not Deleted");
      }
    });
  }
}
