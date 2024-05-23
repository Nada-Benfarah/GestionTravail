import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm.component';
import { ImportsModule } from 'src/app/imports.module';

@NgModule({
  declarations: [ConfirmComponent],
  imports: [CommonModule, ImportsModule],
})
export class ConfirmModule {}
