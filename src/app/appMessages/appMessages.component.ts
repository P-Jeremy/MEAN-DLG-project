import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AppMessages } from '../models/appMessages.model';

@Component({
    templateUrl: './appMessages.component.html'
  })


export class AppMessagesComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: AppMessages) {}
}
