import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { TaskItemServiceService } from '../task-item-service.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IDataViewModel } from '../task-list/task-list.component';
import { firstValueFrom, pipe, map } from 'rxjs';
import { ConfirmationActionDialogComponent } from '../shared/confirmation-action-dialog/confirmation-action-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InputFormDialogComponent } from './input-form-dialog/input-form-dialog.component';

@Component({
  selector: 'app-task-detail',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent implements OnInit {
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [taskValidator()]),
    fields: new FormGroup({}),
  });
  viewModel: ViewModel | null = null;

  get fields(): FormGroup {
    return this.form.controls['fields'] as FormGroup;
  }
  get type(): AbstractControl {
    return this.form.controls['type'];
  }
  constructor(
    public taskItemService: TaskItemServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private matDialog: MatDialog
  ) {}

  async ngOnInit() {
    const taskId = this.activatedRoute.snapshot.params['id'];
    if (taskId && taskId !== 'new') {
      const dataResponse = await firstValueFrom(
        this.httpClient
          .get<IDataViewModel>(`http://64.225.105.163:3000/tasks/${taskId}`, {
            responseType: 'json',
          })
          .pipe(
            map(
              (data: any) =>
                ({
                  id: data._id,
                  name: data.name,
                  type: data.type,
                  fields: data.fields,
                } as IDataViewModel)
            )
          )
      );
      if (dataResponse) {
        this.viewModel = {
          title: `Edit ${dataResponse.name}`,
          data: dataResponse,
          isNew: false,
        };
        this.form.patchValue(dataResponse);
        if (dataResponse.fields) {
          const keys = Object.keys(dataResponse.fields) as string[];
          keys.forEach((k) => {
            this.fields.addControl(k, new FormControl(dataResponse.fields[k]));
          });
        }
      }
    } else {
      this.viewModel = {
        title: 'Create New Task',
        data: null,
        isNew: true,
      };
    }

    this.type.valueChanges.subscribe((v) => {
      if (v) {
        switch (v) {
          case 'vacuum-clean':
            this.fields.removeControl('durationInHours');
            this.fields.addControl(
              'who',
              new FormControl('', [Validators.required])
            );
            this.fields.addControl(
              'room',
              new FormControl('', [Validators.required])
            );
            break;
          case 'wash-dishes':
            this.fields.removeControl('who');
            this.fields.removeControl('room');
            this.fields.addControl(
              'durationInHours',
              new FormControl<number>(0, [Validators.required])
            );
            break;
          default:
            break;
        }
      }
    });
  }

  getFields() {
    return Object.keys(this.fields.controls);
  }

  async onAddNewType() {
    const response = await firstValueFrom(
      this.matDialog
        .open(InputFormDialogComponent, {
          minWidth: '600px',
          minHeight: '300px',
          data: {
            title: `Add New Task Type`,
            confirmationLabel: 'Submit',
            rejectionLabel: 'Cancel',
            formFields: [
              {
                name: 'type',
                label: 'Type',
                type: 'matInput',
              },
            ],
          },
        })
        .afterClosed()
    );
    if (response.type) {
      this.taskItemService.updateListOfTaskTypes(response.type);
    }
  }
  async onAddNewField() {
    const response = await firstValueFrom(
      this.matDialog
        .open(InputFormDialogComponent, {
          minWidth: '600px',
          minHeight: '300px',
          data: {
            title: `Add New Field`,
            confirmationLabel: 'Submit',
            rejectionLabel: 'Cancel',
            preDefinedOptions: ['string', 'number'],
            formFields: [
              {
                name: 'fieldName',
                label: 'Field Name',
                type: 'matInput',
              },
              {
                name: 'fieldType',
                label: 'Field Type',
                type: 'matSelect',
              },
            ],
          },
        })
        .afterClosed()
    );
    if (response.fieldName) {
      if (response.fieldType === 'string') {
        this.fields.addControl(response.fieldName, new FormControl<string>(''));
      } else {
        this.fields.addControl(response.fieldName, new FormControl<number>(0));
      }
    }
  }

  onCancel() {
    this.router.navigateByUrl('');
  }
  async onSubmit() {
    const values = this.form.value;
    if (this.form.valid) {
      const resp = await firstValueFrom(
        this.httpClient.post(`http://64.225.105.163:3000/tasks`, values)
      );
      this.router.navigateByUrl('');
    } else {
      this.form.markAllAsTouched();
    }
  }

  async onSave() {
    const values = this.form.value;
    if (this.form.valid) {
      const resp = await firstValueFrom(
        this.httpClient.put(
          `http://64.225.105.163:3000/tasks/${this.viewModel!.data!.id}`,
          values
        )
      );
      this.router.navigateByUrl('');
    } else {
      this.form.markAllAsTouched();
    }
  }

  async onDeleteTask() {
    const response = await firstValueFrom(
      this.matDialog
        .open(ConfirmationActionDialogComponent, {
          data: {
            title: `Confirm Action`,
            message: `Are you sure you want to remove ${
              this.viewModel!.data!.name
            }?`,
            confirmationLabel: 'Yes',
            rejectionLabel: 'No',
          },
        })
        .afterClosed()
    );
    if (response) {
      await firstValueFrom(
        this.httpClient.delete(
          `http://64.225.105.163:3000/tasks/${this.viewModel!.data!.id}`
        )
      );
      this.router.navigateByUrl('');
    }
  }
}

interface ViewModel {
  title: string;
  data: IDataViewModel | null;
  isNew: boolean;
}

export function taskValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validTasks = ['wash-dishes', 'vacuum-clean'];
    return validTasks.includes(control.value)
      ? null
      : { invalidTask: { value: control.value } };
  };
}
