import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-right-menu',
  templateUrl: './right-menu.component.html',
  styleUrls: ['./right-menu.component.css']
})
export class RightMenuComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) { }

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
}
