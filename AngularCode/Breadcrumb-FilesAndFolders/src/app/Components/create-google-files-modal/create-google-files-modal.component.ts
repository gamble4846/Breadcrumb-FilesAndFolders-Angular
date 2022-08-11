import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonServicesService } from 'src/app/Services/CommonServices/common-services.service';
import { CustomNotificationService } from 'src/app/Services/CustomNotification/custom-notification.service';
import { GoogleAppScritsService } from 'src/app/Services/GoogleAppScripts/google-app-scrits.service';
import { LocalBaseService } from 'src/app/Services/LocalBase/local-base.service';
import { SessionManagementService } from 'src/app/Services/SessionManagement/session-management.service';

@Component({
  selector: 'app-create-google-files-modal',
  templateUrl: './create-google-files-modal.component.html',
  styleUrls: ['./create-google-files-modal.component.css']
})
export class CreateGoogleFilesModalComponent implements OnInit {

  FolderLinkOrId:any;
  FolderLinkOrIdErrorValue:any = "-";
  ServerIDURL:string = "";
  UpperFolderIDURL:string = "";
  FileData:any = [];
  apiKey:any = "";
  SelectedFiles:any = [];
  AllFilesChecked:boolean = false;
  currentFileCreateIndex:number = 0;
  
  constructor(private sessionManagement:SessionManagementService,private customNotificationService: CustomNotificationService, private LocalBase:LocalBaseService, private fb: FormBuilder, private route: ActivatedRoute, public GoogleAppScripts: GoogleAppScritsService, public _cs : CommonServicesService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.ServerIDURL = params['ServerId'];
      this.UpperFolderIDURL = params['FolderId'] == "" || params['FolderId'] == null || params['FolderId'] == undefined ? "-" : params['FolderId'];
    });
  }

  closeCreateGoogleFiles(){
    document.getElementById("create-google-files-modal")?.classList.remove("open");
  }

  GetFilesClicked(){
    let flag = false;
    this.FileData = [];
    if(!this.FolderLinkOrId){
      this.FolderLinkOrIdErrorValue = "Please Enter Folder Link Or Id";
      document.getElementById("FolderLinkOrIdError")?.classList.add("show");
      flag = false;
    }
    else{
      if(this.FolderLinkOrId.includes("https")){
        this.FolderLinkOrId = this.FolderLinkOrId.split('/')[this.FolderLinkOrId.split('/').length - 1];
      }
      document.getElementById("FolderLinkOrIdError")?.classList.remove("show");
      this.apiKey = this.sessionManagement.GetSettingsFromLocal("GoogleAPIKey");
      if(!this.apiKey){
        this.FolderLinkOrIdErrorValue = "Api key Needed, Go to Settings to Add Key";
        document.getElementById("FolderLinkOrIdError")?.classList.add("show");
        flag = false;
      }
      else{
        document.getElementById("FolderLinkOrIdError")?.classList.remove("show");
        flag = true;
      }
    }

    if(flag){
      let link = 'https://www.googleapis.com/drive/v2/files?q=%27' + this.FolderLinkOrId + '%27+in+parents&key=' + this.apiKey;
      this.GetdataWithApi(link);
      this._cs.ShowFullPageLoader();
    }
  }

  GetdataWithApi(apiLink:any){
    this.GoogleAppScripts.GetFilesDataFromFolderId(apiLink).subscribe((response:any) => {
      this.FileData = this.FileData.concat(response.items);
      if(response.nextLink){
        this.GetdataWithApi(response.nextLink + '&key=' + this.apiKey);
      }
      else{
        this.gettingDataCompleted();
      }
    },(error) => {
      this._cs.HideFullPageLoader();
    });
  }

  gettingDataCompleted(){
    console.log(this.FileData);
    this._cs.HideFullPageLoader();
  }

  onAllFilesSelected(event:any){
    this.SelectedFiles = [];
    this.FileData.forEach((file:any) => {
      this.updateCheckedFile(file.id, this.AllFilesChecked);
    });
  }

  updateCheckedFile(id: any, checked: boolean): void {
    if (checked) {
      this.SelectedFiles.push(id);
    } else {
      let index = this.SelectedFiles.indexOf(id);
      this.SelectedFiles.splice(index,1);
    }
  }

  onFileChecked(id: any, checked: boolean){
    this.updateCheckedFile(id, checked);
  }

  AddSelectedFiles(){
    let FilesToAdd:any = [];

    this.FileData.forEach((file:any) => {
      if(this.SelectedFiles.includes(file.id)){
        let fileToAdd = {
          "Server_ID": this.ServerIDURL,
          "Files_Name": file.title,
          "File_Type": file.mimeType,
          "Files_UpperFolderId": this.UpperFolderIDURL,
          "Files_Info": "-",
          "Is_Stared": "false",
          "Created_On": file.createdDate,
          "Link_link": "https://drive.google.com/file/d/"+file.id+"/view?usp=sharing",
          "Link_Size": ((file.fileSize / 1024) / 1024).toFixed(2) + " MB",
          "Link_Password": "-",
          "Link_Email": file.owners[0].emailAddress,
          "Link_Desc": "-",
        }
        FilesToAdd.push(fileToAdd);
      }
    });

    console.log(FilesToAdd);
    this.currentFileCreateIndex = 0;
    this.publishAllFiles(FilesToAdd);
  }

  publishAllFiles(FilesToAdd:any){
    this._cs.ShowFullPageLoader("Creating File (" + (this.currentFileCreateIndex + 1) + "/" + FilesToAdd.length + ")");
    this.createFileOnGoogleSheet(FilesToAdd[this.currentFileCreateIndex]).subscribe((response:any) => {
      if(this.currentFileCreateIndex != (FilesToAdd.length - 1)){
        this.currentFileCreateIndex++;
        this.publishAllFiles(FilesToAdd);
      }
      else{
        this.AllFilesPublished();
      }
    },
    (error) => {
      console.log(error);
      if(this.currentFileCreateIndex != (FilesToAdd.length - 1)){
        this.currentFileCreateIndex++;
        this.publishAllFiles(FilesToAdd);
      }
      else{
        this.AllFilesPublished();
      }
    });
  }

  AllFilesPublished(){
    this._cs.HideFullPageLoader();
    this.closeCreateGoogleFiles();
    document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
  }

  createFileOnGoogleSheet(FileToAdd:any){
    let finalData = new Observable((observer:any) => {
      this.GoogleAppScripts.PostCreateFile(FileToAdd).subscribe((response:any) => {
        try{
          if(response.status == "200"){
            this.LocalBase.AddFileToLocalBase(response.data.Files,response.data.File_Links,response.data.Server_ID).subscribe((res:any) => {
              if(res){
                observer.next(true);
                observer.complete();
              }
            });
          }
          else{
            observer.next(false);
            observer.complete();
          }
        }
        catch(ex){
          observer.next(false);
          observer.complete();
        }
      },
      (error) => {
        observer.next(false);
        observer.complete();
      });
    });

    return finalData;
  }
}
