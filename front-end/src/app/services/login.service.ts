import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from '../global.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  url;

  constructor(private http: HttpClient, private gs: GlobalService) {
    this.url = gs.uri + '/auth';
  }

  loggin(login: any, password: any) {
    return this.http.post(this.url, { login, password });
  }
}
