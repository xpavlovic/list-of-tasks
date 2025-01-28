import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

@Component({
  selector: 'app-task-list',
  imports: [],
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  // Register all community features
  //ModuleRegistry.registerModules([AllCommunityModule]);
}
