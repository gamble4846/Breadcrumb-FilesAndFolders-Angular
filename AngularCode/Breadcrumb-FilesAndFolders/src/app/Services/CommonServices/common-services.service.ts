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
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/infoIcon.svg`;
      case "server":
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/server.svg`;
      case "folder":
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/folder.svg`;
      case "application/zip":
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/zip.svg`;
      case "text/plain":
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/textPlain.svg`;
      case "image/jpeg":
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/jpg.svg`;
      case "image/png":
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/png.svg`;
      case "application/7z":
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/7z.svg`;
      case "application/x-zip-compressed":
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/zip.svg`;
      case "application/rar":
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/rar.svg`;
      case "application/pdf":
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/pdf.svg`;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/docx.svg`;
      case "application/x-rar":
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/rar.svg`;
      default:
        return `../../../Breadcrumb-FilesAndFolders-Release/assets/svgs/unknownFile.svg`;
    }
  }
}
