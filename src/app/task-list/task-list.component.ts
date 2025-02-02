import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import { ActionRendererComponent } from './action-renderer/action-renderer.component';
import { ICellRendererParams } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskItemServiceService } from '../task-item-service.service';
import { firstValueFrom, pipe, tap, map } from 'rxjs';
import { RouterLink, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationActionDialogComponent } from '../shared/confirmation-action-dialog/confirmation-action-dialog.component';

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-task-list',
  imports: [AgGridAngular, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  data: IDataViewModel[] = [];
  readonly columnDefs: ColDef[] = [
    { field: 'name', headerName: 'Name' },
    { field: 'type', headerName: 'Type' },
    {
      field: '',
      headerName: 'Actions',
      cellRenderer: ActionRendererComponent,
      cellRendererParams: (params: ICellRendererParams) => ({
        actions: [
          {
            label: 'Edit',
            icon: 'edit',
            onClick: (params: any) => this.onEditTask(params.id),
          },
          {
            label: 'Delete',
            icon: 'delete',
            onClick: (params: any) => this.onDeleteTask(params),
          },
        ],
      }),
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
  };
  private gridApi: GridApi | undefined;
  constructor(
    private httpClient: HttpClient,
    private taskItemService: TaskItemServiceService,
    private router: Router,
    private matDialog: MatDialog
  ) {}
  async ngOnInit() {
    //TODO add loader
    this.data = await firstValueFrom(
      this.httpClient
        .get<IDataViewModel & any>('http://64.225.105.163:3000/tasks', {
          responseType: 'json',
        })
        .pipe(
          map((data: any[]) => {
            return data.map(
              (d) =>
                ({
                  id: d._id,
                  name: d.name,
                  type: d.type,
                  fields: d.fields,
                } as IDataViewModel)
            );
          }),
          tap((data: IDataViewModel[]) => {
            const taskTypes = data.map(
              (d: IDataViewModel) => d.type
            ) as string[];
            this.taskItemService.setListOfTaskTypes([...new Set(taskTypes)]);
          })
        )
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  private onEditTask(taskId: string) {
    this.router.navigateByUrl(`/task/${taskId}`);
  }

  private async onDeleteTask(task: IDataViewModel) {
    const response = await firstValueFrom(
      this.matDialog
        .open(ConfirmationActionDialogComponent, {
          data: {
            title: `Confirm Action`,
            message: `Are you sure you want to remove ${task.name}?`,
            confirmationLabel: 'Yes',
            rejectionLabel: 'No',
          },
        })
        .afterClosed()
    );
    if (response) {
      await firstValueFrom(
        this.httpClient.delete(`http://64.225.105.163:3000/tasks/${task.id}`)
      );
      const index = this.data.findIndex(
        (d: IDataViewModel) => d.id === task.id
      );
      this.data.splice(index, 1);
      this.gridApi?.setGridOption('rowData', this.data);
    }
  }
}

export interface IDataViewModel {
  id: string;
  name: string;
  type: string;
  fields: any;
}
