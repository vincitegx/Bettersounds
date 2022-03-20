import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { HomeComponent } from './modules/home/home.component';
import { BeatComponent } from './modules/beat/beat/beat.component';
import { AccountComponent } from './modules/account/account.component';
import { SignupComponent } from './modules/signup/signup.component';
import { UserComponent } from './modules/user/user.component';
import { CartComponent } from './modules/cart/cart.component';
import { ActivateAccountComponent } from './modules/activate-account/activate-account.component';
import { CheckoutComponent } from './modules/checkout/checkout.component';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { AdminloginComponent } from './layouts/adminlogin/adminlogin.component';
import { LoginComponent } from './modules/admin/login/login.component';
import { UsersComponent } from './layouts/users/users.component';
import { AddbeatComponent } from './modules/admin/addbeat/addbeat.component';
import { AllbeatsComponent } from './modules/admin/allbeats/allbeats.component';
import { BeatInfoComponent } from './modules/beat/beat-info/beat-info.component';
import { UpdatebeatComponent } from './modules/admin/updatebeat/updatebeat.component';
import { ViewbeatinfoComponent } from './modules/admin/viewbeatinfo/viewbeatinfo.component';
import { AuthGuard } from './service/auth.guard';
import { AdminGuard } from './service/admin.guard';

const routes: Routes = [
  {
    path:'',
    component:DefaultComponent,
    children: [
      {
        path:'',
        component:HomeComponent,
      },
      {
        path:'beats',
        component:BeatComponent,
      },
      {
        path:'info/:id',
        component:BeatInfoComponent,
      },
      {
        path:'account',
        component: AccountComponent,
      },
      {
        path:'signup',
        component: SignupComponent,
      },
      {
        path:'cart',
        component: CartComponent,
      },
      {
        path:'activateAccount',
        component: ActivateAccountComponent,
      },
      {
        path:'checkout',
        component: CheckoutComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: 'admin',
    component: AdminloginComponent,
    children:[
      {
        path:'',
        component: LoginComponent,
      }
    ]
  },
  {
    path: 'user',
    component: UsersComponent,
    children:[
      {
        path:'',
        component: UserComponent,
      }
    ]
  },
  {
    path: 'admindashboard',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children:[
      {
        path:'',
        component: DashboardComponent,
        pathMatch: 'full'
      },
      {
        path:'addbeat',
        component: AddbeatComponent,
        pathMatch: 'full'
      },
      {
        path:'allbeats',
        component: AllbeatsComponent,
      },
      {
        path:'updatebeat/:id',
        component:UpdatebeatComponent,
      },
      {
        path:'viewbeatinfo/:id',
        component:ViewbeatinfoComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
