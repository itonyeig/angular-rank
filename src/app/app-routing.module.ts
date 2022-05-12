import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularContributorsComponent } from './angular-contributors/angular-contributors.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserGuard } from './user-details/user.guard';

const routes: Routes = [
  { path: '', redirectTo: '/contributors', pathMatch: 'full' },
  { path: 'contributors', component: AngularContributorsComponent },
  {
    path: 'user/:id',
    canActivate: [UserGuard],
    component: UserDetailsComponent,
  },
  { path: '**', redirectTo: '/contributors' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
