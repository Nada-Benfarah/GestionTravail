import { GlobalService } from './../../global.service';
import { UsersService } from './../../services/users.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {
  roles: any = roles;
  checked: boolean = false;
  updateForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: UsersService,
    private gs: GlobalService,
    private detectorRef: ChangeDetectorRef
  ) {
    const user = data.user;
    this.updateForm = fb.group({
      fname: [user.fname, Validators.required],
      lname: [user.lname, Validators.required],
      email: [user.email],
      login: [user.login, Validators.required],
      password: ['', Validators.required],
      role: [user.role, Validators.required],
    });
    this.clearPassword();
    this.updateForm.controls['email'].setValidators([
      Validators.required,
      Validators.email,
    ]);
  }

  ngOnInit(): void {}

  annuler() {
    this.dialogRef.close();
  }

  updateUser() {
    const user = this.updateForm.getRawValue();
    if (!this.checked) delete user.password;
    else user.password = this.gs.hashPassword(user.password);
    this.service.updateUser(this.data.user.user_id, user).subscribe((res) => {
      this.dialogRef.close(res);
    });
  }

  toggleChange(event: any) {
    this.checked = event.checked;
    if (!event.checked) {
      this.clearPassword();
    } else {
      this.updateForm.controls['password'].setValidators([Validators.required]);
    }
    this.detectorRef.detectChanges();
  }

  clearPassword() {
    this.updateForm.controls['password'].clearValidators();
    this.updateForm.controls['password'].markAsPristine();
    this.updateForm.controls['password'].markAsUntouched();
    this.updateForm.controls['password'].setValue('');
  }
}

const roles = ['responsable', 'user'];
