import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SearchBarService {

  private term = new BehaviorSubject<string>('');
  currentTerm = this.term.asObservable();
  private orderByTitle = new BehaviorSubject<boolean>(true);
  currentIsTitleState = this.orderByTitle.asObservable();
  constructor() {
  }

  getNewTerm(term: string) {
    this.term.next(term);
  }

  orderBy(title: boolean) {
    const orderByTitle = title;

    this.orderByTitle.next(orderByTitle);
  }
}
