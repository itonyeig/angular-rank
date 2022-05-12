import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularContributorsComponent } from './angular-contributors/angular-contributors.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserDetailsComponent } from './user-details/user-details.component';
import { HeaderComponent } from './shared/header/header.component';
import { RepoDetailsComponent } from './repo-details/repo-details.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    AngularContributorsComponent,
    UserDetailsComponent,
    HeaderComponent,
    RepoDetailsComponent,
    LoadingSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: GithubInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
