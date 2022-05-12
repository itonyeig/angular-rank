import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularContributorsComponent } from './angular-contributors/angular-contributors.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GithubInterceptor } from './shared/github.interceptor';

@NgModule({
  declarations: [AppComponent, AngularContributorsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: GithubInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
