import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionManagementService {

  constructor() { }

  SaveToSettingsLocal(jsonString:any){
    localStorage.setItem("settingsData", jsonString);
  }

  GetSettingsFromLocal(propertyName:any){
    var jsonString:any = localStorage.getItem("settingsData");
    var json:any = JSON.parse(jsonString);

    if(json[propertyName]){
      return json[propertyName];
    }

    return null;
  }
}
