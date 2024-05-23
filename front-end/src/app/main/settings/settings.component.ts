import { ErrorComponent } from './../../dialogs/error/error.component';
import { GlobalService } from './../../global.service';
import { SettingsService } from './../../services/settings.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  checked: boolean = false;
  updateForm: FormGroup;
  user: any;

  constructor(
    fb: FormBuilder,
    private service: SettingsService,
    private gs: GlobalService,
    private detectorRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    gs.getUser().subscribe((user) => {
      this.user = user;
    });

    this.updateForm = fb.group({
      fname: [this.user.fname, Validators.required],
      lname: [this.user.lname, Validators.required],
      login: [this.user.login, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      old_password: ['', Validators.required],
      password: ['', Validators.required],
      password_confirm: ['', Validators.required],
    });

    if (this.user.role === 'admin') {
      this.clearValidators('email');
    }
    this.clearPassword();
  }

  ngOnInit(): void {}

  updateUser() {
    const user = this.updateForm.getRawValue();
    if (!this.checked) delete user.password;

    let { old_password, password_confirm } = user;
    delete user.old_password;
    delete user.password_confirm;

    if (this.checked) {
      old_password = this.gs.hashPassword(old_password);
      user.password = this.gs.hashPassword(user.password);
      password_confirm = this.gs.hashPassword(password_confirm);
    }

    if (old_password === this.user.password || !this.checked) {
      if (user.password === password_confirm || !this.checked) {
        this.service
          .updateAdmin(this.user.user_id, user)
          .subscribe((res: any) => {
            if (res.err) {
              if (res.err === 'USERNAME_EXIST') {
                this.openError('nom utlisateur deja exist');
              } else {
                this.openError('erreur dans le serveur');
                console.log(res.err);
              }
            } else if (!!res.user && !!res.token) {
              this.gs.setUser(res.user);
              this.gs.saveToken(res.token);
              this.clearPassword();
              this.checked = false;
            }
          });
      } else {
        this.openError('new password and confirm must be the same');
      }
    } else {
      this.openError('old password incorrect');
    }
  }

  toggleChange(event: any) {
    if (!this.checked) {
      this.clearPassword();
    } else {
      this.addPasswordValidators();
    }
    this.detectorRef.detectChanges();
  }

  clearValidators(name: any) {
    this.updateForm.controls[name].clearValidators();
    this.updateForm.controls[name].markAsPristine();
    this.updateForm.controls[name].markAsUntouched();
    this.updateForm.controls[name].setValue('');
  }

  clearPassword() {
    this.clearValidators('old_password');
    this.clearValidators('password');
    this.clearValidators('password_confirm');
  }

  addPasswordValidators() {
    this.updateForm.controls['old_password'].setValidators([
      Validators.required,
    ]);
    this.updateForm.controls['password'].setValidators([Validators.required]);
    this.updateForm.controls['password_confirm'].setValidators([
      Validators.required,
    ]);
  }

  openError(message: any) {
    const dialogRef = this.dialog.open(ErrorComponent, {
      width: '350px',
      data: {
        title: 'erreur',
        message: message,
      },
      panelClass: 'error-popup',
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
