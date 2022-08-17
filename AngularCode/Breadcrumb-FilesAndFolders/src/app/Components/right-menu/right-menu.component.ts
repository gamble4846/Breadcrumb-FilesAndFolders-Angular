import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LocalBaseService } from 'src/app/Services/LocalBase/local-base.service';

@Component({
  selector: 'app-right-menu',
  templateUrl: './right-menu.component.html',
  styleUrls: ['./right-menu.component.css']
})
export class RightMenuComponent implements OnInit {

  currentFolder:any = {
    Created_On: null,
    Deleted_On: null,
    Folder_Id: null,
    Folder_Info: null,
    Folder_Name: null,
    Folder_UpperFolderId: null,
    Is_Deleted: null,
    Is_Stared: null
  }

  constructor(@Inject(DOCUMENT) private document: Document, private LocalBase:LocalBaseService) { }

  ngOnInit(): void {
    var rightPanelSectionContainers:any = document.getElementsByClassName("rightPanelSectionContainer");
    for (let index = 0; index < rightPanelSectionContainers.length; index++) {
      const rightPanelSectionContainer:any = rightPanelSectionContainers[index];
      rightPanelSectionContainer.addEventListener("click", this.openRightPanelSection);
    }
  }

  toggleRightMenu(){
    var rightPanel:any = this.document.getElementById("gs-dropbox-right");
    rightPanel.classList.toggle("open");
  }

  openRightPanelSection(event:any){
    var rightPanel:any = document.getElementById("gs-dropbox-right");
    rightPanel.classList.add("open");

    const allSections = document.getElementsByClassName("rightPanelSectionContainer");
    for (let index = 0; index < allSections.length; index++) {
        const section = allSections[index];
        section.classList.remove("open");
    }

    var container:any = null;
    var paths = event.path;
    try{
      for (let index = 0; index < paths.length; index++) {
        const path = paths[index];
        if(path.classList.contains("rightPanelSectionContainer")){
          container = path;
        }
      }
    }
    catch(ex){}
    container.classList.add("open");
  }

  UpdateRightMenuData(){
    var CurrentFolderData:any = localStorage.getItem("CurrentFolderData");
    CurrentFolderData = JSON.parse(CurrentFolderData);

    this.LocalBase.GetFolderDataFromId(CurrentFolderData.FolderId, CurrentFolderData.ServerId).subscribe((res:any) => {
      if(!res){
        this.currentFolder = {
          Created_On: null,
          Deleted_On: null,
          Folder_Id: null,
          Folder_Info: null,
          Folder_Name: null,
          Folder_UpperFolderId: null,
          Is_Deleted: null,
          Is_Stared: null
        }
      }
      else{
        this.currentFolder = res;
      }
    })
  }
}
