import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tag-container',
  templateUrl: './tag-container.component.html',
  styleUrls: ['./tag-container.component.css']
})
export class TagContainerComponent implements OnInit {

  showTagCreate = false;

  constructor() { }

  ngOnInit() {
  }

  onShowTagEmit() {
    this.showTagCreate = true;
  }

}
