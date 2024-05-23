import { ErrorComponent } from './../../dialogs/error/error.component';
import { Router } from '@angular/router';
import { GlobalService } from './../../global.service';
import { DemandeService } from './../../services/demande.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.scss'],
})
export class DemandeComponent implements OnInit {
  types = types;
  addForm: FormGroup;
  user: any;

  constructor(
    fb: FormBuilder,
    private service: DemandeService,
    gs: GlobalService,
    private detectorRef: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog
  ) {
    gs.getUser().subscribe((user) => (this.user = user));

    this.addForm = fb.group({
      type: ['', Validators.required],
      aut_date: [null],
      start_date: [null],
      end_date: [null],
      start_time: [null],
      end_time: [null],
    });
  }

  ngOnInit(): void {}

  addDemande() {
    try {
      const type = this.addForm.controls['type'].value;
      let demande: { [key: string]: any } = { type, from: this.user.user_id };
      if (type === 'conge') {
        const start = this.addForm.controls['start_date'].value;
        const end = this.addForm.controls['end_date'].value;
        if (start.diff(moment(), 'days') < 0) {
          throw Error('le jour de début ne peut pas être passé');
        }
        if (end.diff(start, 'days') < 1) {
          throw Error('la date de fin doit être râpée puis la date de début');
        }
        demande.start_date = start.format('YYYY-MM-DD HH:mm:ss');
        demande.end_date = end.format('YYYY-MM-DD HH:mm:ss');
      } else if (type === 'autorisation') {
        const date = this.addForm.controls['aut_date'].value;

        const start = moment(
          date.format('L') + ' ' + this.addForm.controls['start_time'].value,
          'MM/DD/YYYY HH:mm'
        );
        const end = moment(
          date.format('L') + ' ' + this.addForm.controls['end_time'].value,
          'MM/DD/YYYY HH:mm'
        );

        if (start.diff(moment(), 'days') < 0) {
          throw Error('le jour de début ne peut pas être passé');
        }

        if (end.diff(start, 'hours') < 1) {
          throw Error("l'heure de fin doit être râpée puis l'heure de début");
        }

        demande.start_date = start.format('YYYY-MM-DD HH:mm:ss');
        demande.end_date = end.format('YYYY-MM-DD HH:mm:ss');
      }

      this.service.addDemande(demande).subscribe((res: any) => {
        if (res.err) {
          this.openError(`erreur dans le serveur`);
          console.log(res.err);
        } else {
          this.router.navigate(['/consult']);
        }
      });
    } catch (error) {
      this.openError(error.message);
    }
  }

  selectionChange(event: any) {
    const { value } = event;

    if (value === 'conge') {
      this.addValidator('start_date');
      this.addValidator('end_date');

      this.clearValidator('aut_date');
      this.clearValidator('start_time');
      this.clearValidator('end_time');
    } else if (value === 'autorisation') {
      this.addValidator('aut_date');
      this.addValidator('start_time');
      this.addValidator('end_time');

      this.clearValidator('start_date');
      this.clearValidator('end_date');
    } else {
      this.clearValidator('aut_date');
      this.clearValidator('start_time');
      this.clearValidator('end_time');
      this.clearValidator('start_date');
      this.clearValidator('end_date');
    }

    this.detectorRef.detectChanges();
  }

  clearValidator(name: any) {
    this.addForm.controls[name].clearValidators();
    this.addForm.controls[name].markAsPristine();
    this.addForm.controls[name].markAsUntouched();
    this.addForm.controls[name].setValue('');
  }
  addValidator(name: any) {
    this.addForm.controls[name].setValidators([Validators.required]);
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

const types = ['conge', 'fiche_de_paie', 'autorisation', 'evaluation'];
