import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonServicesService } from 'src/app/Services/CommonServices/common-services.service';
import { CustomNotificationService } from 'src/app/Services/CustomNotification/custom-notification.service';
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

  constructor(private customNotificationService: CustomNotificationService, private LocalBase:LocalBaseService, private fb: FormBuilder, private route: ActivatedRoute, public GoogleAppScripts: GoogleAppScritsService, public _cs : CommonServicesService) { }

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
      this._cs.ShowFullPageLoader();
      this.createFile(this.CreateFileForm.value);
    } else {
      Object.values(this.CreateFileForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  createFile(formObj:any){
    var currentdate:any = new Date();
    currentdate = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    if(!formObj.Files_Info){
      formObj.Files_Info = "-";
    }
    if(!formObj.Link_Password){
      formObj.Link_Password = "-";
    }
    if(!formObj.Link_Email){
      formObj.Link_Email = "-";
    }
    if(!formObj.Link_Desc){
      formObj.Link_Desc = "-";
    }
    formObj.Server_ID = this.ServerIDURL;
    formObj.Files_UpperFolderId = this.UpperFolderIDURL;
    formObj.Created_On = currentdate;

    this.GoogleAppScripts.PostCreateFile(formObj).subscribe((response:any) => {
      try{
        if(response.status == "200"){
          console.log(response);
          this.closeCreateFile();
          this.LocalBase.AddFileToLocalBase(response.data.Files,response.data.File_Links,response.data.Server_ID).subscribe((res:any) => {
            if(res){
              this._cs.HideFullPageLoader();
              this.customNotificationService.SmallMessage("success", "File Created");
              document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
            }
          });
        }
        else{
          this._cs.HideFullPageLoader();
          this.closeCreateFile();
          this.customNotificationService.SmallMessage("error", "Error Creating File");
          console.log(response);
        }
      }
      catch(ex){
        this._cs.HideFullPageLoader();
        this.closeCreateFile();
        this.customNotificationService.SmallMessage("error", "Error Creating File");
        console.log(response);
      }
    },
    (error) => {
      this._cs.HideFullPageLoader();
        this.closeCreateFile();
        this.customNotificationService.SmallMessage("error", "Error Creating File");
      console.log(error);
    });
  }

}
