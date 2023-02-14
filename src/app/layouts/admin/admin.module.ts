import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from 'src/app/modules/admin/dashboard/dashboard.component';
import { SidebarComponent } from 'src/app/modules/admin/shared/sidebar/sidebar.component';
import { HeaderComponent } from 'src/app/modules/admin/shared/header/header.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminFooterComponent } from 'src/app/modules/admin/shared/admin-footer/admin-footer.component';
import { AllbeatsComponent } from 'src/app/modules/admin/allbeats/allbeats.component';
import { AddbeatComponent } from 'src/app/modules/admin/addbeat/addbeat.component';
import { UpdatebeatComponent } from 'src/app/modules/admin/updatebeat/updatebeat.component';
import { ViewbeatinfoComponent } from 'src/app/modules/admin/viewbeatinfo/viewbeatinfo.component';
import { MaterialModule } from 'src/app/material.module';
import { DataTablesModule } from 'angular-datatables';
import { TokenInterceptor } from 'src/app/token-interceptor';
import { OrderComponent } from 'src/app/modules/admin/order/order.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    AdminFooterComponent,
    AllbeatsComponent,
    AddbeatComponent,
    UpdatebeatComponent,
    ViewbeatinfoComponent,
    OrderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    DataTablesModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  exports:[
    AdminComponent,
    DashboardComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class AdminModule { }
