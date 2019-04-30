import { Component, OnInit } from '@angular/core';
import { SearchBarService } from './search-bar.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  isTitle = true;
  term: string;

  constructor(private searchBarService: SearchBarService) { }

  ngOnInit() {
  }

  onBoxChecked(ev: boolean) {
    this.searchBarService.isTitleChange(ev);
  }

  onChange(ev: string) {
    this.term = ev;
    this.searchBarService.getNewTerm(this.term);
  }
}
