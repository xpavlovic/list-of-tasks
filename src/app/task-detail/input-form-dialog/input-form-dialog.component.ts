import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './input-form-dialog.component.html',
  styleUrl: './input-form-dialog.component.scss',
})
export class InputFormDialogComponent {
  form = new FormGroup({});

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: InputDialogModel,
    private dialogRef: MatDialogRef<InputFormDialogComponent>
  ) {
    dialogData.formFields.forEach((field) => {
      this.form!.addControl(field.name, new FormControl());
    });
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }
}

export interface InputDialogModel {
  title: string;
  confirmationActionLabel: string;
  cancelationActionLabel: string;
  formFields: FormFieldModel[];
  preDefinedOptions?: string[];
}

interface FormFieldModel {
  name: string;
  label: string;
  type: 'matSelect' | 'matInput';
}
