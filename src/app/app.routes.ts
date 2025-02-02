import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'task-list', component: TaskListComponent },
  { path: 'task/new', component: TaskDetailComponent },
  { path: 'task/:id', component: TaskDetailComponent },
];
