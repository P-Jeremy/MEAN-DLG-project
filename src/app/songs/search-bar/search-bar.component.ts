import { Component } from '@angular/core';
import { SearchBarService } from '../../services/search-bar.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  orderBytitle = true;

  constructor(private searchBarService: SearchBarService) { }

  /** Allows to switch from title to artist for the search filter */
  onBoxChecked(ev: boolean) {
    this.orderBytitle = !this.orderBytitle;
    this.searchBarService.orderBy(ev);
  }

  /** Allows to use the input for search */
  onChange(ev: string) {
    this.searchBarService.getNewTerm(ev);
  }
}
