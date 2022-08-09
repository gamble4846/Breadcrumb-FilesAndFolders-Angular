import { Injectable } from '@angular/core';
//@ts-ignore
import Localbase from 'localbase';
import { Observable } from 'rxjs';
import { GoogleAppScritsService } from '../GoogleAppScripts/google-app-scrits.service';

@Injectable({
  providedIn: 'root'
})
export class LocalBaseService {
  db:any;
  constructor(public GoogleAppScripts: GoogleAppScritsService) {
    this.db = new Localbase('BreadCrumb-Folders-Files-DB');
  }

  // -----------------------FOLDERS AND FILE-----------------------------------------------------
  GetFilesLinkByFileID(FileId:any, ServerID:string){
    let finalData = new Observable((observer:any) => {
      this.db.collection('FoldersAndFiles').get().then((resultGET:any) => {
        let currentServer = resultGET[0].datas.find((x:any) => x.ServerID == ServerID);
        let currentFileLinks = currentServer.Data.File_Links;
        let fileLinksList = currentFileLinks.filter((x:any) => x.File_Id == FileId);
        observer.next(fileLinksList);
        observer.complete();
      });
    });
    return finalData;
  }

  GetFoldersFilesByUpperFolderID(UpperFolderID:any, ServerID:string){
    let finalData = new Observable((observer:any) => {
      this.db.collection('FoldersAndFiles').get().then((resultGET:any) => {
        let currentServer = resultGET[0].datas.find((x:any) => x.ServerID == ServerID);
        let currentFolder = currentServer.Data.Folders;
        let currentFiles = currentServer.Data.Files;
        let FoldersList = currentFolder.filter((x:any) => x.Folder_UpperFolderId == UpperFolderID);
        let FilesList = currentFiles.filter((x:any) => x.Files_UpperFolderId == UpperFolderID);

        let toReturnData = {
          Folders: FoldersList,
          Files: FilesList,
          ServerId: ServerID
        }

        observer.next(toReturnData);
        observer.complete();
      });
    })
    return finalData;
  }

  GetAllFodlersByServerID(ServerID:string){
    let finalData = new Observable((observer:any) => {
      this.db.collection('FoldersAndFiles').get().then((resultGET:any) => {
        let currentServer = resultGET[0].datas.find((x:any) => x.ServerID == ServerID);
        let currentFolders = currentServer.Data.Folders;
        observer.next(currentFolders);
        observer.complete();
      });
    })
    return finalData;
  }

  GetFoldersFilesServersList(){
    let finalData = new Observable((observer:any) => {
      this.db.collection('FoldersAndFiles').get().then((resultGET:any) => {
        let listServers:any = [];
        try{
          resultGET[0].datas.forEach((element:any) => {
            listServers.push(element.ServerID);
          });
        }
        catch(ex){};
        observer.next(listServers);
        observer.complete();
      })
    })
    return finalData;
  }

  SaveFoldersFilesFromSheetAndSavetoLocalBase(){
    let finalData = new Observable((observer:any) => {
      this.GoogleAppScripts.GetFoldersAndFiles().subscribe((response:any) => {
        if(response.status == "200"){
          let dataToAdd = {datas:response.data};
          this.db.collection('FoldersAndFiles').delete().then((resultLBDEL:any) => {
            this.db.collection('FoldersAndFiles').add(dataToAdd).then((resultLBADD:any) => {
              observer.next(true);
              observer.complete();
            });
          });
        }
        else{
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

  GetUpperFolderIdFromFolderIdAndServerId(folderId:any, serverId:any){
    let finalData = new Observable((observer:any) => {
      this.GetAllFodlersByServerID(serverId).subscribe((response:any) => {
        try{
          observer.next(response.find((x:any) => x.Folder_Id == folderId).Folder_UpperFolderId);
          observer.complete();
        }
        catch(ex){
          observer.next(-1);
          observer.complete();
        }
      });
    })
    return finalData;
  }
  // --------------------------------------------------------------------------------------------
}
