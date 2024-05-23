import { FileComponent } from './../../dialogs/file/file.component';
import { ErrorComponent } from './../../dialogs/error/error.component';
import { EvaluationComponent } from './../../dialogs/evaluation/evaluation.component';
import { ReponseService } from './../../services/reponse.service';
import { GlobalService } from './../../global.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-gerer-demandes',
  templateUrl: './gerer-demandes.component.html',
  styleUrls: ['./gerer-demandes.component.scss'],
})
export class GererDemandesComponent implements OnInit {
  demandes: any[] = [];
  user: any;
  destroy$: Subject<any>;
  isLoading: boolean = false;

  constructor(
    private gs: GlobalService,
    private service: ReponseService,
    private dialog: MatDialog
  ) {
    this.destroy$ = new Subject<any>();
  }

  ngOnInit(): void {
    this.gs
      .getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: any) => {
        this.user = user;
        if (this.user) {
          this.isLoading = true;
          this.service.getAllDemande(user.role).subscribe(
            (res: any) => {
              this.isLoading = false;
              const demandes = res as any[];
              demandes.forEach((element) => {
                const index = this.demandes.findIndex(
                  (value) => value.demande_id === element.demande_id
                );

                let demande = null,
                  reponse: { [key: string]: any } | null = null;

                if (element.rb_id) {
                  reponse = {
                    rb_id: element.rb_id,
                    rb_fname: element.rb_fname,
                    rb_lname: element.rb_lname,
                    rb_login: element.rb_login,
                    rb_role: element.rb_role,
                    reponse_id: element.reponse_id,
                    response: element.response,
                    evaluation: element.evaluation,
                  };

                  if (element.pdf_file) {
                    reponse.pdf_file = this.service.downloadpdf(
                      element.pdf_file
                    );
                  }
                }
                if (index === -1) {
                  demande = {
                    demande_id: element.demande_id,
                    type: element.type,
                    start_date: element.start_date,
                    end_date: element.end_date,
                    created_at: element.created_at,
                    user_id: element.user_id,
                    fname: element.fname,
                    lname: element.lname,
                    login: element.login,
                    role: element.user_id,
                    reponses: [].constructor(),
                  };
                  if (reponse && reponse.reponse_id)
                    demande.reponses.push(reponse);
                  this.demandes.push(demande);
                } else {
                  if (reponse) this.demandes[index].reponses.push(reponse);
                }
              });
            },
            (err) => (this.isLoading = false)
          );
        }
      });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  isResponsed(demande: any) {
    const reponses = demande.reponses as [];
    for (let index = 0; index < reponses.length; index++) {
      const element: any = reponses[index];
      if (this.user.user_id === element.rb_id) return true;
    }
    return false;
  }

  responseType(demande: any) {
    const reponse: any = this.reponse(demande);
    if (reponse) return reponse.response;
    else return null;
  }

  reponse(demande: any) {
    const reponses = demande.reponses as [];
    for (let index = 0; index < reponses.length; index++) {
      const element: any = reponses[index];
      if (this.user.user_id === element.rb_id) return element;
    }
    return null;
  }

  addReponse(reponse: any, demande: any, i: any) {
    const body: { [k: string]: any } = {
      response: reponse,
      from: this.user.user_id,
      demande: demande.demande_id,
    };

    if (demande.type === 'evaluation' && reponse === 'accepted') {
      this.askForNote().then((note) => {
        if (note) {
          body.evaluation = note;
          this.add(body).subscribe((reponse) => {
            if (reponse) {
              this.demandes[i].reponses.push(reponse);
            }
          });
        }
      });
    } else if (demande.type === 'fiche_de_paie' && reponse === 'accepted') {
      this.askForPdf().then((file) => {
        if (file) {
          body.pdf_file = file;
          this.add(body).subscribe((reponse) => {
            if (reponse) {
              this.demandes[i].reponses.push(reponse);
            }
          });
        }
      });
    } else {
      this.add(body).subscribe((reponse) => {
        if (reponse) {
          this.demandes[i].reponses.push(reponse);
        }
      });
    }
  }

  add(body: any) {
    return this.service.addReponse(body).pipe(
      map(
        (res: any) => {
          let reponse = null;
          if (res.err) {
            const dialogRef = this.dialog.open(ErrorComponent, {
              width: '350px',
              data: {
                title: 'erreur',
                message: `erreur dans le serveur`,
              },
              panelClass: 'error-popup',
            });

            dialogRef.afterClosed().subscribe(() => {});
            console.log(res.err);
          } else {
            reponse = {
              rb_id: this.user.user_id,
              rb_fname: this.user.fname,
              rb_lname: this.user.lname,
              rb_login: this.user.login,
              rb_role: this.user.role,
              reponse_id: res.reponse_id,
              response: res.response,
              evaluation: res.evaluation,
            };
          }
          return reponse;
        },
        catchError((err) => {
          console.log(err);
          return err;
        })
      )
    );
  }

  updateReponse(reponse: any, demande: any, i: number) {
    const update_reponse = this.reponse(demande);
    const body: { [k: string]: any } = {
      response: reponse,
    };

    if (demande.type === 'evaluation' && reponse === 'accepted') {
      this.askForNote().then((note) => {
        if (note) {
          body.evaluation = note;
          this.service.updateReponse(update_reponse.reponse_id, body).subscribe(
            (updated: any) => {
              if (updated === 1) {
                const j = (this.demandes[i].reponses as []).findIndex(
                  (value: any) => value.reponse_id === update_reponse.reponse_id
                );
                this.demandes[i].reponses[j].response = reponse;
                this.demandes[i].reponses[j].evaluation = note;
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      });
    } else if (demande.type === 'fiche_de_paie' && reponse === 'accepted') {
      this.askForPdf().then(
        (file) => {
          if (file) {
            body.pdf_file = file;
            this.service
              .updateReponse(update_reponse.reponse_id, body)
              .subscribe(
                (updated: any) => {
                  if (updated === 1) {
                    const j = (this.demandes[i].reponses as []).findIndex(
                      (value: any) =>
                        value.reponse_id === update_reponse.reponse_id
                    );
                    this.demandes[i].reponses[j].response = reponse;
                  }
                },
                (err) => {
                  console.log(err);
                }
              );
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      body.evaluation = null;
      body.pdf_file = null;
      this.service.updateReponse(update_reponse.reponse_id, body).subscribe(
        (updated: any) => {
          if (updated === 1) {
            const j = (this.demandes[i].reponses as []).findIndex(
              (value: any) => value.reponse_id === update_reponse.reponse_id
            );
            this.demandes[i].reponses[j].response = reponse;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  askForNote(): Promise<any> {
    return new Promise((res, rej) => {
      const dialogRef = this.dialog.open(EvaluationComponent, {
        width: '350px',
      });

      dialogRef.afterClosed().subscribe((note) => {
        res(note);
      });
    });
  }

  askForPdf(): Promise<any> {
    return new Promise((res, rej) => {
      const dialogRef = this.dialog.open(FileComponent, {
        width: '350px',
      });

      dialogRef.afterClosed().subscribe((file) => {
        res(file);
      });
    });
  }
}
