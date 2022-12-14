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

  GetDeletedFoldersFiles(ServerID:string){
    let finalData = new Observable((observer:any) => {
      this.db.collection('FoldersAndFiles').get().then((resultGET:any) => {
        let currentServer = resultGET[0].datas.find((x:any) => x.ServerID == ServerID);
        let currentFolder = currentServer.Data.Folders;
        let currentFiles = currentServer.Data.Files;
        let FoldersList = currentFolder.filter((x:any) => x.Is_Deleted);
        let FilesList = currentFiles.filter((x:any) => x.Is_Deleted);

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

  GetFolderDataFromId(FolderId:any, ServerId:any){
    let finalData = new Observable((observer:any) => {
      this.db.collection('FoldersAndFiles').get().then((resultGET:any) => {
        let currentServer = resultGET[0].datas.find((x:any) => x.ServerID == ServerId);
        let currentFolder = currentServer.Data.Folders.find((x:any) => x.Folder_Id == FolderId);
        observer.next(currentFolder);
        observer.complete();
      });
    })
    return finalData;
  }

  GetFoldersFilesByUpperFolderID(UpperFolderID:any, ServerID:string, deleteType:number = 1){
    let finalData = new Observable((observer:any) => {
      this.db.collection('FoldersAndFiles').get().then((resultGET:any) => {
        let currentServer = resultGET[0].datas.find((x:any) => x.ServerID == ServerID);
        let currentFolder = currentServer.Data.Folders;
        let currentFiles = currentServer.Data.Files;
        let FoldersList:any = null;
        let FilesList:any = null;

        if(deleteType == 1){
          FoldersList = currentFolder.filter((x:any) => x.Folder_UpperFolderId == UpperFolderID && !x.Is_Deleted);
          FilesList = currentFiles.filter((x:any) => x.Files_UpperFolderId == UpperFolderID && !x.Is_Deleted);
        }
        else if(deleteType == 2){
          FoldersList = currentFolder.filter((x:any) => x.Folder_UpperFolderId == UpperFolderID && x.Is_Deleted);
          FilesList = currentFiles.filter((x:any) => x.Files_UpperFolderId == UpperFolderID && x.Is_Deleted);
        }
        else if(deleteType == 3){
          FoldersList = currentFolder.filter((x:any) => x.Folder_UpperFolderId == UpperFolderID);
          FilesList = currentFiles.filter((x:any) => x.Files_UpperFolderId == UpperFolderID);
        }

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

  ReplaceDataInLocal(dataToAdd:any){
    let finalData = new Observable((observer:any) => {
      try{
        this.db.collection('FoldersAndFiles').delete().then((resultLBDEL:any) => {
          this.db.collection('FoldersAndFiles').add(dataToAdd).then((resultLBADD:any) => {
            observer.next(true);
            observer.complete();
          });
        });
      }
      catch(ex){
        observer.next(false);
        observer.complete();
      }
    });
    return finalData;
  }

  AddFolderToLocalBase(folder:any,serverId:any){
    let finalData = new Observable((observer:any) => {
      try{
        this.db.collection('FoldersAndFiles').get().then((resultGET:any) => {
          let localData = resultGET;
          localData[0].datas.find((x:any) => x.ServerID == serverId).Data.Folders.push(folder);
          this.ReplaceDataInLocal(localData[0]).subscribe((res:any) => {
            observer.next(true);
            observer.complete();
          });
        })
      }
      catch(ex){
        observer.next(false);
        observer.complete();
      }
    })
    return finalData;
  }

  UpdateFolderToLocalBase(folder:any, serverId:any){
    let finalData = new Observable((observer:any) => {
      try{
        this.db.collection('FoldersAndFiles').get().then((resultGET:any) => {
          let localData = resultGET;
          let foundIndex = localData[0].datas.find((x:any) => x.ServerID == serverId).Data.Folders.findIndex((y:any) => y.Folder_Id == folder.Folder_Id);
          localData[0].datas.find((x:any) => x.ServerID == serverId).Data.Folders.splice(foundIndex, 1, folder);
          this.ReplaceDataInLocal(localData[0]).subscribe((res:any) => {
            observer.next(true);
            observer.complete();
          });
        })
      }
      catch(ex){
        observer.next(false);
        observer.complete();
      }
    })
    return finalData;
  }

  UpdateFileToLocalBase(file:any, serverId:any){
    let finalData = new Observable((observer:any) => {
      try{
        this.db.collection('FoldersAndFiles').get().then((resultGET:any) => {
          let localData = resultGET;
          let foundIndex = localData[0].datas.find((x:any) => x.ServerID == serverId).Data.Files.findIndex((y:any) => y.Files_Id == file.Files_Id);
          localData[0].datas.find((x:any) => x.ServerID == serverId).Data.Files.splice(foundIndex, 1, file);
          this.ReplaceDataInLocal(localData[0]).subscribe((res:any) => {
            observer.next(true);
            observer.complete();
          });
        })
      }
      catch(ex){
        observer.next(false);
        observer.complete();
      }
    })
    return finalData;
  }

  AddFileToLocalBase(file:any,fileLink:any,serverId:any){
    let finalData = new Observable((observer:any) => {
      try{
        this.db.collection('FoldersAndFiles').get().then((resultGET:any) => {
          let localData = resultGET;
          localData[0].datas.find((x:any) => x.ServerID == serverId).Data.Files.push(file);
          this.ReplaceDataInLocal(localData[0]).subscribe((res:any) => {
            this.db.collection('FoldersAndFiles').get().then((resultGET:any) => {
              let localData = resultGET;
              localData[0].datas.find((x:any) => x.ServerID == serverId).Data.File_Links.push(fileLink);
              this.ReplaceDataInLocal(localData[0]).subscribe((res2:any) => {
                observer.next(true);
                observer.complete();
              });
            })
          });
        })
      }
      catch(ex){
        observer.next(false);
        observer.complete();
      }
    })
    return finalData;
  }
  // --------------------------------------------------------------------------------------------
}
