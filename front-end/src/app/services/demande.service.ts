import { GlobalService } from './../global.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DemandeService {
  url;

  constructor(private http: HttpClient, private gs: GlobalService) {
    this.url = gs.uri + '/demande';
  }

  addDemande(demande: any) {
    return this.http.post(this.url, { demande });
  }
}
