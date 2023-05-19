import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirmation-dailog',
  templateUrl: './confirmation-dailog.component.html',
  styleUrls: ['./confirmation-dailog.component.css']
})
export class ConfirmationDailogComponent implements OnInit {
  message: string = "Are you sure you want to delete this record?"
  confirmButtonText = "Yes, delete it!"
  cancelButtonText = "Cancel"
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmationDailogComponent>) {
  }

  ngOnInit() {
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}
