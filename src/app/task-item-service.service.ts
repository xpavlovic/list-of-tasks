import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskItemServiceService {
  private listOfTaskTypes$: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >(['wash-dishes', 'vacuum-clean']);

  get listOfTaskTypes() {
    return this.listOfTaskTypes$.value;
  }

  setListOfTaskTypes(taskTypes: string[]) {
    this.listOfTaskTypes$.next(taskTypes);
  }

  updateListOfTaskTypes(newType: string) {
    this.listOfTaskTypes$.next([
      ...new Set([...this.listOfTaskTypes$.value, newType]),
    ]);
  }
  constructor() {}
}
