import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularContributorsComponent } from './angular-contributors/angular-contributors.component';


const routes: Routes = [
  { path: '', redirectTo: '/contributors', pathMatch: 'full' },
  {path: 'contributors', component: AngularContributorsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
