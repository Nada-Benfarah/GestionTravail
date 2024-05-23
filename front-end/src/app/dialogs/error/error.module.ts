import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { ImportsModule } from 'src/app/imports.module';

@NgModule({
  declarations: [ErrorComponent],
  imports: [CommonModule, ImportsModule],
})
export class ErrorModule {}
