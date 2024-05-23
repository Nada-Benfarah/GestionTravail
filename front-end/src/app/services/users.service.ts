import { HttpClient } from '@angular/common/http';
import { GlobalService } from './../global.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  url: any;
  constructor(gs: GlobalService, private http: HttpClient) {
    this.url = gs.uri + '/user';
  }

  addUser(user: any) {
    return this.http.post(this.url, { user });
  }

  updateUser(user_id: any, user: any) {
    return this.http.put(`${this.url}/${user_id}`, { user });
  }

  deleteUser(user_id: any) {
    return this.http.delete(`${this.url}/${user_id}`);
  }

  getAllUsers() {
    return this.http.get(`${this.url}/all`);
  }
}
