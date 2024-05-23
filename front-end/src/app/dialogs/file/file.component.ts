import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
})
export class FileComponent implements OnInit {
  file: any;
  error: any = null;

  constructor(
    public dialogRef: MatDialogRef<FileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  annuler() {
    this.dialogRef.close();
  }

  confirm() {
    if (this.file) {
      this.dialogRef.close(this.file);
    }
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }
}
