import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

closeFile(){
  var fileModel:any = document.getElementById("gs-dropbox-file-model");
  fileModel.classList.remove("open");
}

}
