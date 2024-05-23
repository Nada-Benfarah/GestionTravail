import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateUserComponent } from './update-user.component';
import { ImportsModule } from 'src/app/imports.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UpdateUserComponent],
  imports: [CommonModule, ImportsModule, FormsModule],
})
export class UpdateUserModule {}
