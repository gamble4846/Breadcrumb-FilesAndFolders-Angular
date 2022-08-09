import { Injectable } from '@angular/core';
import { CustomNotificationService } from '../CustomNotification/custom-notification.service';

@Injectable({
  providedIn: 'root'
})
export class SessionManagementService {

  constructor(private customNotificationService: CustomNotificationService) { }

  SaveToSettingsLocal(jsonString:any){
    localStorage.setItem("settingsData", jsonString);
    this.customNotificationService.SmallMessage("success","Settings Saved");
  }

  GetSettingsFromLocal(propertyName:any){
    try{
      var jsonString:any = localStorage.getItem("settingsData");
      var json:any = JSON.parse(jsonString);

      if(json[propertyName]){
        return json[propertyName];
      }

      return "";
    }
    catch(ex){
      return "";
    }
  }
}
