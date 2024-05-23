import { HttpClient } from '@angular/common/http';
import { GlobalService } from './../global.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReponseService {
  url: any;

  constructor(
    private gs: GlobalService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    this.url = gs.uri + '/reponse';
  }

  getAllDemande(role: 'admin' | 'responsable' | 'user') {
    if (role === 'admin') {
      return this.http.get(`${this.url}/admin/all`);
    } else if (role === 'responsable') {
      return this.http.get(`${this.url}/responsable/all`);
    } else {
      return this.http.get(`${this.gs.uri}/demande/all`);
    }
  }

  addReponse(reponse: any) {
    const formdata = new FormData();
    for (let key in reponse) {
      if (reponse[key] !== null) formdata.append(key, reponse[key]);
    }
    return this.http.post(this.url, formdata);
  }

  updateReponse(reponse_id: any, reponse: any) {
    const formdata = new FormData();
    for (let key in reponse) {
      if (reponse[key] !== null) formdata.append(key, reponse[key]);
    }
    return this.http.put(`${this.url}/${reponse_id}`, formdata);
  }

  downloadpdf(pdfPath: any) {
    return this.http
      .get(`${this.gs.uri}/download/pdf`, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'content-disposition': 'inline',
        },
        responseType: 'blob',
        params: { pdfPath },
      })
      .pipe(
        map((data: Blob) => {
          const file = new Blob([data], { type: 'application/pdf' });
          const objectURL = URL.createObjectURL(file);
          return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
        }),
        catchError((err) => {
          return err;
        })
      );
  }
}
