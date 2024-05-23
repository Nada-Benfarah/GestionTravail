import { GlobalService } from './../global.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  url: any;
  constructor(private http: HttpClient, gs: GlobalService) {
    this.url = gs.uri + '/settings';
  }

  updateAdmin(user_id: any, user: any) {
    return this.http.put(`${this.url}/${user_id}`, { user });
  }
}
