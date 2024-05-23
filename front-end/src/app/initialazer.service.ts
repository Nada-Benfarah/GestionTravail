import { ErrorComponent } from './dialogs/error/error.component';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class InitialazerService {
  constructor(
    private http: HttpClient,
    private gs: GlobalService,
    private dialog: MatDialog
  ) {}

  Init() {
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem('token');
      if (token) {
        this.http.get(`${this.gs.uri}/current`).subscribe(
          (user: any) => {
            if (user.err) {
              this.gs.logOut();
            } else this.gs.setUser(user);
            resolve(true);
          },
          (err) => {
            if (err.status === 401 || err.status === 403) {
              this.gs.logOut();
            } else if (err.status === 0) {
              this.openError('erreur dans le serveur');
            }
            resolve(true);
          }
        );
      } else {
        this.gs.logOut();
        resolve(true);
      }
    });
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
