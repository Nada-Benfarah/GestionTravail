import { HttpClient } from '@angular/common/http';
import { GlobalService } from './../global.service';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  url: any;

  constructor(gs: GlobalService, private http: HttpClient) {
    this.url = gs.uri + '/workflow';
  }

  getUsers() {
    return forkJoin({
      employees: this.http.get(`${this.url}/employees/all`),
      responsables: this.http.get(`${this.url}/responsables/all`),
    });
  }

  addWorkflow(body: any) {
    return this.http.post(this.url, body);
  }

  deleteWorkflow(responsable: any, responseTo: any) {
    return this.http.delete(this.url, { params: { responsable, responseTo } });
  }
}
