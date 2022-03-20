import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccountComponent } from 'src/app/modules/account/account.component';
import { SignupComponent } from 'src/app/modules/signup/signup.component';
import { CartComponent } from 'src/app/modules/cart/cart.component';
import { BeatModule } from 'src/app/modules/beat/beat.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivateAccountComponent } from 'src/app/modules/activate-account/activate-account.component';
import { CheckoutComponent } from 'src/app/modules/checkout/checkout.component';
import { MaterialModule } from 'src/app/material.module';
import { TokenInterceptor } from 'src/app/token-interceptor';


@NgModule({
  declarations: [
    DefaultComponent,
    HomeComponent,
    AccountComponent,
    SignupComponent,
    CartComponent,
    ActivateAccountComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    BeatModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class DefaultModule { }
