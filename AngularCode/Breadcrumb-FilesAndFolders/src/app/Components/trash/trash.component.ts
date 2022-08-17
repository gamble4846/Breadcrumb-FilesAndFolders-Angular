import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServicesService } from 'src/app/Services/CommonServices/common-services.service';
import { CustomNotificationService } from 'src/app/Services/CustomNotification/custom-notification.service';
import { GoogleAppScritsService } from 'src/app/Services/GoogleAppScripts/google-app-scrits.service';
import { LocalBaseService } from 'src/app/Services/LocalBase/local-base.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css']
})
export class TrashComponent implements OnInit {
  ServersList:any;
  FoldersFilesObj:any = {
    Folders: [],
    Files: [],
    ServerId: ""
  };
  ServerIDURL:string = "";
  onlyServers:boolean = true;
  finalTableData:any;

  constructor(private gas: GoogleAppScritsService, private lbs: LocalBaseService, private cusNoti: CustomNotificationService, public _cs : CommonServicesService, private route: ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.StartUpFun();
  }

  StartUpFun(){
    this.route.queryParams.subscribe(params => {
      this.ServerIDURL = params['ServerId'];

      if(this.ServerIDURL == "" || this.ServerIDURL == null || this.ServerIDURL == undefined){
        this.getServerList();
        this.onlyServers = true;
      }
      else{
        this.getDeletedFoldersFiles();
        this.onlyServers = false;
      }
    });
  }

  getServerList(){
    this.lbs.GetFoldersFilesServersList().subscribe((response:any) => {
      console.log(response);
      this.ServersList = response;
      this.finalTableData = this.ServersList;
    });
  }

  getDeletedFoldersFiles(){
    this.lbs.GetDeletedFoldersFiles(this.ServerIDURL).subscribe((response:any) => {
      console.log(response);
      this.FoldersFilesObj = response;
    });
  }

  GetIconSRC(iconName:string){
    return this._cs.GetIconSRC(iconName);
  }

  ServerClicked(ServerId:any){
    this.router.navigate(
      ['/Trash'],
      { queryParams: { ServerId: ServerId } }
    );
  }

  RestoreFileFolder(data:any, isFolder:boolean){
    this._cs.ShowFullPageLoader();

    let values:any = {
      "Server_ID": this.ServerIDURL,
      "Is_Deleted": false,
      "Deleted_On": "-",
      "Is_Folder": isFolder
    }

    if(isFolder){
      values.Prime_ID = data.Folder_Id;
    }
    else{
      values.Prime_ID = data.Files_Id;
    }

    this.gas.DeleteFolderFile(values).subscribe((response:any) => {
      console.log(response);
      if(response.status == "200"){
        this._cs.HideFullPageLoader();
        if(isFolder){
          this.lbs.UpdateFolderToLocalBase(response.data, this.ServerIDURL).subscribe((res:any) => {
            this.StartUpFun();
            this.cusNoti.SmallMessage("success", "Folder Restored - " + response.data.Folder_Name);
          })
        }
        else{
          this.lbs.UpdateFileToLocalBase(response.data, this.ServerIDURL).subscribe((res:any) => {
            this.StartUpFun();
            this.cusNoti.SmallMessage("success", "File Restored - " + response.data.Files_Name);
          })
        }
      }
      else{
        this._cs.HideFullPageLoader();
        if(isFolder){
          this.cusNoti.SmallMessage("error", "Folder Not Restored");
        }
        else{
          this.cusNoti.SmallMessage("error", "File Not Restored");
        }
      }
    },
    (error) => {
      this._cs.HideFullPageLoader();
      if(isFolder){
        this.cusNoti.SmallMessage("error", "Folder Not Restored");
      }
      else{
        this.cusNoti.SmallMessage("error", "File Not Restored");
      }
    });
  }
}
