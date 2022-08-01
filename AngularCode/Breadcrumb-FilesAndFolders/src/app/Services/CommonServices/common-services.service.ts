import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonServicesService {

  constructor() { }

  openFile(){
    var fileModel:any = document.getElementById("gs-dropbox-file-model");
    fileModel.classList.add("open");
  }

  GetIconSRC(iconName:string){
    iconName = iconName.toLowerCase();
    switch(iconName){
      case "info":
        return `../../../assets/svgs/infoIcon.svg`;
      case "server":
        return `../../../assets/svgs/server.svg`;
      case "folder":
        return `../../../assets/svgs/folder.svg`;
      case "application/zip":
        return `../../../assets/svgs/`;
      case "text/plain":
        return `../../../assets/svgs/`;
      default:
        return `../../../assets/svgs/questionMakr.svg`;
    }
  }
}
