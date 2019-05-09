import { Component } from '@angular/core';
import { SearchBarService } from '../../services/search-bar.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  isTitle = true;

  constructor(private searchBarService: SearchBarService) { }

  onBoxChecked(ev: boolean) {
    this.isTitle = !this.isTitle;
    this.searchBarService.isTitleChange(ev);
  }

  onChange(ev: string) {
    this.searchBarService.getNewTerm(ev);
  }
}
