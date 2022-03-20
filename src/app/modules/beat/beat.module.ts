import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeatComponent } from './beat/beat.component';
import { BeatInfoComponent } from './beat-info/beat-info.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BeatComponent,
    BeatInfoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    BeatComponent,
    BeatInfoComponent
  ]
})
export class BeatModule { }
