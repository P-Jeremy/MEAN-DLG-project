import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppMessages } from '../models/appMessages.model';

@Component({
  templateUrl: './appMessages.component.html',
  styleUrls: ['./appMessages.component.scss']

})


export class AppMessagesComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: AppMessages) { }
}
