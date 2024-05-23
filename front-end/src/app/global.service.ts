import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as shajs from 'sha.js';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private user: BehaviorSubject<any>;
  // backend url
  uri: any = 'http://localhost:3000/api';

  constructor(private injector: Injector) {
    this.user = new BehaviorSubject<any>(null);
  }

  hashPassword(password: any) {
    return shajs('sha256').update(password).digest('hex');
  }

  logOut() {
    localStorage.removeItem('token');
    this.user.next(null);
    this.router.navigate(['/login']);
  }

  saveToken(token: any) {
    localStorage.setItem('token', token);
  }

  getUser(): Observable<any> {
    return this.user.asObservable();
  }

  public get router(): Router {
    return this.injector.get(Router);
  }

  setUser(user: any) {
    this.user.next(user);
  }
}
