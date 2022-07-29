import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Breadcrumb-FilesAndFolders';
  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    var rightClickElements = document.getElementsByClassName("allowRightClick");
    console.log(rightClickElements);
    for (let index = 0; index < rightClickElements.length; index++) {
        const rightClickElement = rightClickElements[index];
        rightClickElement.addEventListener("contextmenu", this.showRightClickMenu);
    }

    document.addEventListener("click", this.fullDocumentClick);
  }

  fullDocumentClick(event:any){
    var rightClickMenu:any = document.getElementById("gs-drop-box-right-click-menu");
    if(!rightClickMenu.contains(event.target)){
        rightClickMenu.classList.remove("open");
        var trsHovered = document.getElementsByClassName("gs-folder-files-table-tr-hover");
        for (let index = 0; index < trsHovered.length; index++) {
            const trHovered = trsHovered[index];
            trHovered.classList.remove("gs-folder-files-table-tr-hover");
        }
    }

    var uploadButton:any = document.getElementById("gs-squareButtonUpload");
    var uploadDropDown:any = document.getElementById("gs-drop-down-for-upload-button");
    if(!uploadButton.contains(event.target)){
        uploadDropDown.classList.remove("open");
    }

    var createButton:any = document.getElementById("gs-squareButtonCreate");
    var createDropDown:any = document.getElementById("gs-drop-down-for-create-button");
    if(!createButton.contains(event.target)){
        createDropDown.classList.remove("open");
    }
  }

  showRightClickMenu(event:any){
    var trsHovered = document.getElementsByClassName("gs-folder-files-table-tr-hover");
    for (let index = 0; index < trsHovered.length; index++) {
        const trHovered = trsHovered[index];
        trHovered.classList.remove("gs-folder-files-table-tr-hover");
    }

    event.target.closest("tr").classList.add("gs-folder-files-table-tr-hover");
    event.preventDefault();
    var rightClickMenu:any = document.getElementById("gs-drop-box-right-click-menu");


    var _docHeight = window.innerHeight;
    var _docWidth = window.innerWidth;

    rightClickMenu.classList.add("open");
    var rightClickMenuWidth = 250;
    rightClickMenu.style.top = event.clientY + "px";


    if((_docWidth - event.clientX) < (rightClickMenuWidth + 20)){
        rightClickMenu.style.right = _docWidth - event.clientX + "px";
        rightClickMenu.style.left = "auto";
    }
    else{
        rightClickMenu.style.right = "auto";
        rightClickMenu.style.left = event.clientX + "px";
    }

    rightClickMenu.style.maxHeight = (_docHeight - event.clientY - 20) + "px";
  }
}
