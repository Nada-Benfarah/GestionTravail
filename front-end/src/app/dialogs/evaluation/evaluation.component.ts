import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit {
  note: any = 7;
  error: any = null;

  constructor(
    public dialogRef: MatDialogRef<EvaluationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  annuler() {
    this.dialogRef.close();
  }

  confirm() {
    if (this.note && !isNaN(this.note)) {
      if (this.note >= 0 && this.note <= 10) this.dialogRef.close(this.note);
      else {
        this.error = "l'évaluation doit être comprise entre 0 et 10";
      }
    }
  }
}
