import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SessionManagementService } from 'src/app/Services/SessionManagement/session-management.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settingsForm!: FormGroup;

  constructor(private fb: FormBuilder, private sessionManagement: SessionManagementService) { }

  ngOnInit(): void {

    this.settingsForm = this.fb.group({
      ScriptsLink: [this.sessionManagement.GetSettingsFromLocal("ScriptsLink"), []],
      GoogleAPILink: [this.sessionManagement.GetSettingsFromLocal("GoogleAPILink"), []],
    });
  }

  submitSettingsForm(): void {
    if (this.settingsForm.valid) {
      this.sessionManagement.SaveToSettingsLocal(JSON.stringify(this.settingsForm.value));
    } else {
      Object.values(this.settingsForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
