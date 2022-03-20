import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BeatModule } from 'src/app/modules/beat/beat.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { UserComponent } from 'src/app/modules/user/user.component';
import { UsersComponent } from './users.component';
import { MaterialModule } from 'src/app/material.module';



@NgModule({
  declarations: [
    UsersComponent,
    UserComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    BeatModule,
    MaterialModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ]
})
export class UsersModule { }
