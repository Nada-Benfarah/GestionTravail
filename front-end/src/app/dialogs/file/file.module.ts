import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileComponent } from './file.component';
import { ImportsModule } from 'src/app/imports.module';

@NgModule({
  declarations: [FileComponent],
  imports: [CommonModule, ImportsModule, FormsModule],
})
export class FileModule {}
