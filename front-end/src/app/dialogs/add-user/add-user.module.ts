import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user.component';
import { ImportsModule } from 'src/app/imports.module';

@NgModule({
  declarations: [AddUserComponent],
  imports: [CommonModule, ImportsModule],
})
export class AddUserModule {}
