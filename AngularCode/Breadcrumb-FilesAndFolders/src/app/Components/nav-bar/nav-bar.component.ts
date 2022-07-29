import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
  }

  toggleLeftMenu(){
    var leftmenu:any = this.document.getElementById("gs-dropbox-left");
    leftmenu.classList.toggle("open");
  }

  updateSearchTextBox(flag:boolean){
    var container:any = this.document.getElementById("gs-dropbox-navbar-right-search-container");
    var searchModal:any = this.document.getElementById("gs-dropbox-search-modal");
    if(flag){
        container.classList.add("active");
        searchModal.classList.add("open");
    }
    else{
        container.classList.remove("active");
        searchModal.classList.remove("open");
    }
  }
}
