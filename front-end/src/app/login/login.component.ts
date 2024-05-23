import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  password_icon: 'visibility' | 'visibility_off' = 'visibility';
  loginForm: FormGroup;

  error = '';
  errorTimer: any;

  constructor(
    public form: FormBuilder,
    private service: LoginService,
    private router: Router,
    private gs: GlobalService
  ) {
    this.loginForm = this.form.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  password_icon_click() {
    this.password_icon =
      this.password_icon === 'visibility' ? 'visibility_off' : 'visibility';
  }

  login() {
    let login = this.loginForm.controls['username'].value;
    let password = this.loginForm.controls['password'].value;
    this.service.loggin(login, this.gs.hashPassword(password)).subscribe(
      (res: any) => {
        if (res.err) {
          if (res.err === 'USER_NOT_EXIST') {
            this.error = 'utilisateur ou mot de passe est incorect';
            this.setErrorTimer();
          } else {
            this.error =
              'il y a un problème sur le serveur lors de la tentative de connexion';
            this.setErrorTimer();
          }
        } else if (res.token && res.user) {
          this.gs.saveToken(res.token);
          this.gs.setUser(res.user);
          this.router.navigate(['']);
        }
      },
      (err: any) => {
        if (err.status === 401) {
          this.error = 'utilisateur ou mot de passe est incorect';
          this.setErrorTimer();
        }
      }
    );
  }

  setErrorTimer() {
    clearTimeout(this.errorTimer);
    this.errorTimer = setTimeout(() => {
      this.error = '';
    }, 5000);
  }
}
