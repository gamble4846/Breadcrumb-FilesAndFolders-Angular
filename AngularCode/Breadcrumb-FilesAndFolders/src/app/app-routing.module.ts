import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoldersFilesComponent } from './Components/folders-files/folders-files.component';
import { SettingsComponent } from './Components/settings/settings.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'FoldersFiles' },
  { path: 'FoldersFiles', component: FoldersFilesComponent},
  { path: 'Settings', component: SettingsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
