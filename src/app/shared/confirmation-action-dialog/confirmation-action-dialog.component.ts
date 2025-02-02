import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-action-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirmation-action-dialog.component.html',
  styleUrl: './confirmation-action-dialog.component.scss',
})
export class ConfirmationActionDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: ConfirmationActionDialogData,
    private dialogRef: MatDialogRef<ConfirmationActionDialogComponent>
  ) {}

  submit() {
    this.dialogRef.close(true);
  }
}

export interface ConfirmationActionDialogData {
  title: string;
  message: string;
  confirmationLabel: string;
  rejectionLabel: string;
}
