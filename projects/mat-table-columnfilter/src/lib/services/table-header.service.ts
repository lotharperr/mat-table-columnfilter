import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableHeaderService {
  public panelVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public top$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public left$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public columnName$ = new BehaviorSubject<string>("");
  public options$ = new BehaviorSubject<Array<string> | undefined>(new Array<string>());
  public selectedOptions$ = new BehaviorSubject<Array<string> | undefined>(new Array<string>());

  constructor() { }

  public show(left: number, top: number) {
    this.top$.next(top);
    this.left$.next(left);
    this.panelVisible$.next(true);
  }

  public hide() {
    this.panelVisible$.next(false);
  }
}
