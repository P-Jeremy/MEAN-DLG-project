import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SearchBarService {

  private term = new BehaviorSubject<string>('');
  currentTerm = this.term.asObservable();
  private isTitle = new BehaviorSubject<boolean>(true);
  currentIsTitleState = this.isTitle.asObservable();
  constructor() {
  }

  getNewTerm(term: string) {
    this.term.next(term);
  }

  isTitleChange(ev: boolean) {
    const newStatus = ev;

    this.isTitle.next(newStatus);
  }
}
