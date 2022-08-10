import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonServicesService } from 'src/app/Services/CommonServices/common-services.service';
import { GoogleAppScritsService } from 'src/app/Services/GoogleAppScripts/google-app-scrits.service';
import { LocalBaseService } from 'src/app/Services/LocalBase/local-base.service';

@Component({
  selector: 'app-create-file-modal',
  templateUrl: './create-file-modal.component.html',
  styleUrls: ['./create-file-modal.component.css']
})
export class CreateFileModalComponent implements OnInit {

  CreateFileForm!: FormGroup;
  ServerIDURL:string = "";
  UpperFolderIDURL:string = "";

  constructor(private LocalBase:LocalBaseService, private fb: FormBuilder, private route: ActivatedRoute, public GoogleAppScripts: GoogleAppScritsService, public _cs : CommonServicesService) { }

  ngOnInit(): void {
  }

  closeCreateFile(){
    document.getElementById("create-file-modal")?.classList.remove("open");
  }

}
