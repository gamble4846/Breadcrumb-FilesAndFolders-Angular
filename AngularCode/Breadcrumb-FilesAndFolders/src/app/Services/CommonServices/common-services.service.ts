import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonServicesService {

  public static FoldersFilesObj:any = null;

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
        return `../../../assets/svgs/zip.svg`;
      case "text/plain":
        return `../../../assets/svgs/textPlain.svg`;
      case "image/jpeg":
        return `../../../assets/svgs/jpg.svg`;
      case "image/png":
        return `../../../assets/svgs/png.svg`;
      case "application/7z":
        return `../../../assets/svgs/7z.svg`;
      case "application/x-zip-compressed":
        return `../../../assets/svgs/zip.svg`;
      case "application/rar":
        return `../../../assets/svgs/rar.svg`;
      case "application/pdf":
        return `../../../assets/svgs/pdf.svg`;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return `../../../assets/svgs/docx.svg`;
      case "application/x-rar":
        return `../../../assets/svgs/rar.svg`;
      default:
        return `../../../assets/svgs/unknownFile.svg`;
    }
  }

  ShowFullPageLoader(textToShowUnder:any = null){
    console.log(textToShowUnder);
    if(textToShowUnder){
      let x:any = document.getElementById("fullPageLoaderText");
      x.innerHTML = textToShowUnder;
    }
    else{
      let x:any = document.getElementById("fullPageLoaderText");
      x.innerHTML = "";
    }
    document.getElementById("fullPageLoaderContainer")?.classList.add("show");
  }

  HideFullPageLoader(){
    document.getElementById("fullPageLoaderContainer")?.classList.remove("show");
  }

  copyText(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
