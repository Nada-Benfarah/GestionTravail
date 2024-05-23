import { ReponseService } from './../../services/reponse.service';
import { GlobalService } from './../../global.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.scss'],
})
export class ConsultComponent implements OnInit {
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
          this.service.getAllDemande('user').subscribe(
            (res: any) => {
              this.isLoading = false;
              const demandes = res as any[];
              demandes.forEach((element) => {
                const index = this.demandes.findIndex(
                  (value) => value.demande_id === element.demande_id
                );

                let demande = null,
                  reponse: { [key: string]: any } = {};

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
                  if (reponse && Object.keys(reponse).length !== 0) demande.reponses.push(reponse);
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
}
