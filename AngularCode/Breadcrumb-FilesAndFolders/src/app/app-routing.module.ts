import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoldersFilesComponent } from './Components/folders-files/folders-files.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'FoldersFiles' },
  { path: 'FoldersFiles', component: FoldersFilesComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }