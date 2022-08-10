import { Injectable } from '@angular/core';
import { SessionManagementService } from '../SessionManagement/session-management.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoogleAppScritsService {
  apiLink:string = "";

  constructor(private sessionManagement: SessionManagementService, private http: HttpClient) {
    this.apiLink = this.sessionManagement.GetSettingsFromLocal("ScriptsLink");
    if(!this.apiLink){
      this.apiLink = "";
    }
  }

  getOptions(){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return options;
  }

  GetFoldersAndFiles(){
    console.log("GoogleAppScritsService - GetFoldersAndFiles");
    var body ={
      "method": "GET",
      "Action": "FOLDERSFILES"
    };
    return this.http.post(this.apiLink, body, this.getOptions());
  }

  PostCreateFolder(values:any){
    var body ={
      "method": "POST",
      "Action": "CREATEFOLDER",
      "Server_ID": values.Server_ID,
      "Folder_Name": values.Folder_Name,
      "Folder_UpperFolderId": values.Folder_UpperFolderId,
      "Folder_Info": values.Folder_Info,
      "Is_Stared": values.Is_Stared.toString(),
      "TodayDateTime": values.TodayDateTime
    };
    return this.http.post(this.apiLink, body, this.getOptions());
  }

  PutStar(values:any){
    var body = {
      "method": "PUT",
      "Action": "UPDATESTAR",
      "Server_ID": values.Server_ID.toString(),
      "Prime_ID": values.Prime_ID.toString(),
      "Is_Stared": values.Is_Stared.toString(),
      "Is_Folder": values.Is_Folder.toString()
    }
    return this.http.post(this.apiLink, body, this.getOptions());
  }

  PostCreateFile(values:any){
    var body = {
      "method": "POST",
      "Action": "CREATESINGLEFILE",
      "Server_ID": values.Server_ID,
      "Files_Name": values.Files_Name.toString(),
      "File_Type": values.File_Type.toString(),
      "Files_UpperFolderId": values.Folder_UpperFolderId.toString(),
      "Files_Info": values.Files_Info.toString(),
      "Is_Stared": values.Is_Stared.toString(),
      "Created_On": values.Created_On.toString(),
      "Link_link": values.Link_link.toString(),
      "Link_Size": values.Link_Size.toString(),
      "Link_Password": values.Link_Password.toString(),
      "Link_Email": values.Link_Email.toString(),
      "Link_Desc": values.Link_Desc.toString()
    }
    return this.http.post(this.apiLink, body, this.getOptions());
  }
}
