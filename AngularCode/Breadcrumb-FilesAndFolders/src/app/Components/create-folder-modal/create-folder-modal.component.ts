import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonServicesService } from 'src/app/Services/CommonServices/common-services.service';
import { CustomNotificationService } from 'src/app/Services/CustomNotification/custom-notification.service';
import { GoogleAppScritsService } from 'src/app/Services/GoogleAppScripts/google-app-scrits.service';
import { LocalBaseService } from 'src/app/Services/LocalBase/local-base.service';

@Component({
  selector: 'app-create-folder-modal',
  templateUrl: './create-folder-modal.component.html',
  styleUrls: ['./create-folder-modal.component.css']
})
export class CreateFolderModalComponent implements OnInit {
  CreateFolderForm!: FormGroup;
  ServerIDURL:string = "";
  UpperFolderIDURL:string = "";

  constructor(private customNotificationService: CustomNotificationService,private LocalBase:LocalBaseService, private fb: FormBuilder, private route: ActivatedRoute, public GoogleAppScripts: GoogleAppScritsService, public _cs : CommonServicesService) { }

  ngOnInit(): void {
    this.CreateFolderForm = this.fb.group({
      Folder_Name: [null, [Validators.required]],
      Folder_Info: [null, []],
      Is_Stared: [false, []]
    });

    this.route.queryParams.subscribe(params => {
      this.ServerIDURL = params['ServerId'];
      this.UpperFolderIDURL = params['FolderId'] == "" || params['FolderId'] == null || params['FolderId'] == undefined ? "-" : params['FolderId'];
    });
  }

  closeCreateFolder(){
    document.getElementById("create-folder-modal")?.classList.remove("open");
  }

  submitCreateFolderForm(): void {
    if (this.CreateFolderForm.valid) {
      this._cs.ShowFullPageLoader();
      this.createFolder(this.CreateFolderForm.value);
    } else {
      Object.values(this.CreateFolderForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  createFolder(formObj:any){
    var currentdate:any = new Date();
    currentdate = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    if(!formObj.Folder_Info){
      formObj.Folder_Info = "-";
    }

    let toSheetObj = {
      Folder_Name : formObj.Folder_Name,
      Folder_Info : formObj.Folder_Info,
      Is_Stared : formObj.Is_Stared,
      Server_ID : this.ServerIDURL,
      Folder_UpperFolderId: this.UpperFolderIDURL,
      TodayDateTime : currentdate
    }

    this.GoogleAppScripts.PostCreateFolder(toSheetObj).subscribe((response:any) => {
      try{
        if(response.status == "200"){
          this.closeCreateFolder();
          this.LocalBase.AddFolderToLocalBase(response.data.data,response.data.serverId).subscribe((res:any) => {
           if(res){
             this._cs.HideFullPageLoader();
             this.customNotificationService.SmallMessage("success", "Folder Created");
             document.getElementById("refreshFilesAndFoldersOnlyLocalHiddenBTN")?.click();
           }
          });
         }
         else{
           this._cs.HideFullPageLoader();
           this.closeCreateFolder();
           this.customNotificationService.SmallMessage("error", "Error Creating Folder");
           console.log(response);
         }
      }
      catch(ex){
        this._cs.HideFullPageLoader();
        this.closeCreateFolder();
        this.customNotificationService.SmallMessage("error", "Error Creating Folder");
        console.log(response);
      }
    },
    (error) => {
      this._cs.HideFullPageLoader();
      this.closeCreateFolder();
      this.customNotificationService.SmallMessage("error", "Error Creating Folder");
      console.log(error);
    });
  }

}
