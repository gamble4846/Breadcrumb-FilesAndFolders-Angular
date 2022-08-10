import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    this.CreateFileForm = this.fb.group({
      Files_Name: [null, [Validators.required]],
      File_Type: [null, [Validators.required]],
      Files_Info: [null, []],
      Is_Stared: [false, []],
      Link_link: [null, [Validators.required]],
      Link_Size: [null, [Validators.required]],
      Link_Password: [null, []],
      Link_Email: [null, []],
      Link_Desc: [null, []],
    });

    this.route.queryParams.subscribe(params => {
      this.ServerIDURL = params['ServerId'];
      this.UpperFolderIDURL = params['FolderId'] == "" || params['FolderId'] == null || params['FolderId'] == undefined ? "-" : params['FolderId'];
    });
  }

  closeCreateFile(){
    document.getElementById("create-file-modal")?.classList.remove("open");
  }

  submitCreateFileForm(){
    if (this.CreateFileForm.valid) {
      console.log(this.CreateFileForm.value);
    } else {
      Object.values(this.CreateFileForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
