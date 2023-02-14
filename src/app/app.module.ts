import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgxWebstorageModule} from 'ngx-webstorage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultModule } from './layouts/default/default.module';
import { AdminModule } from './layouts/admin/admin.module';
import { AdminloginModule } from './layouts/adminlogin/adminlogin.module';
import { UsersModule } from './layouts/users/users.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token-interceptor';
import { DataTablesModule } from 'angular-datatables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DefaultModule,
    AdminModule,
    AdminloginModule,
    UsersModule,
    DataTablesModule,
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
