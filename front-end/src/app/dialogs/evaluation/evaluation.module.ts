import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationComponent } from './evaluation.component';
import { ImportsModule } from 'src/app/imports.module';

@NgModule({
  declarations: [EvaluationComponent],
  imports: [CommonModule, ImportsModule, FormsModule],
})
export class EvaluationModule {}
