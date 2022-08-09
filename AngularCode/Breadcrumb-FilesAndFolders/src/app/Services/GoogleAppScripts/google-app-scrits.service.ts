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
}
