import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeftMenuComponent } from './Components/left-menu/left-menu.component';
import { RightMenuComponent } from './Components/right-menu/right-menu.component';
import { RightClickMenuComponent } from './Components/right-click-menu/right-click-menu.component';
import { SearchResultsComponent } from './Components/search-results/search-results.component';
import { FoldersFilesComponent } from './Components/folders-files/folders-files.component';
import { FileViewerComponent } from './Components/file-viewer/file-viewer.component';
import { SettingsComponent } from './Components/settings/settings.component';


//-------------------------------------- NG ZORRO ----------------------------------------------
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
//----------------------------------------------------------------------------------------------

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LeftMenuComponent,
    RightMenuComponent,
    RightClickMenuComponent,
    SearchResultsComponent,
    FoldersFilesComponent,
    FileViewerComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzIconModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
