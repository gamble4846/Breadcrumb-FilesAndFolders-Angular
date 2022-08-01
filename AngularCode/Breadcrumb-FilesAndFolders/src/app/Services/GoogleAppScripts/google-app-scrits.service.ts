import { Injectable } from '@angular/core';
import { SessionManagementService } from '../SessionManagement/session-management.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoogleAppScritsService {
  apiLink:string = "";

  constructor(private sessionManagement: SessionManagementService, private http: HttpClient) {
    this.apiLink = this.sessionManagement.GetSettingsFromLocal("GoogleAPILink");
  }

  getOptions(){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return options;
  }

  GetFoldersAndFiles(){
    var body ={
      "method": "GET",
      "Action": "FOLDERSFILES"
    };
    return this.http.post(this.apiLink, body, this.getOptions());
  }
}
