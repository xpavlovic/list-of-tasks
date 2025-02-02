import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './action-renderer.component.html',
  styleUrl: './action-renderer.component.scss',
})
export class ActionRendererComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams & IActionModel;
  agInit(params: ICellRendererParams & IActionModel): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: ICellRendererParams & IActionModel): boolean {
    this.params = params;
    return true;
  }

  onActionClick(action: IActionData) {
    return action.onClick?.(this.params.data);
  }
}

export interface IActionModel {
  actions: IActionData[];
}

interface IActionData {
  label: string;
  icon?: string;
  onClick: (data?: any) => unknown;
}
