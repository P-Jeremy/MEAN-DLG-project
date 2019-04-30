import { Component, OnInit } from '@angular/core';
import { SearchBarService } from './search-bar.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  isTitle = true;

  constructor(private searchBarService: SearchBarService) { }

  ngOnInit() {
  }

  onBoxChecked(ev: boolean) {
    this.searchBarService.isTitleChange(ev);
  }

  onChange(ev: string) {
    this.searchBarService.getNewTerm(ev);
  }
}
