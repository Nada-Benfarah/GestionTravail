import { GlobalService } from './../../global.service';
import { UsersService } from './../../services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  roles: any = roles;

  addForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: UsersService,
    private gs: GlobalService
  ) {
    this.addForm = fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: [''],
      login: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });

    this.addForm.controls['email'].setValidators([
      Validators.required,
      Validators.email,
    ]);
  }

  ngOnInit(): void {}

  annuler() {
    this.dialogRef.close();
  }

  addUser() {
    const user = this.addForm.getRawValue();
    user.password = this.gs.hashPassword(user.password);
    this.service.addUser(user).subscribe((res) => {
      this.dialogRef.close(res);
    });
  }
}

const roles = ['responsable', 'user'];
