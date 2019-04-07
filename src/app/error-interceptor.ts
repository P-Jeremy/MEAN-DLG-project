import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppMessagesComponent } from './appMessages/appMessages.component';
import { AppMessages } from './models/appMessages.model';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {


  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const message: AppMessages = {
          title: 'Oh hell no...',
          content: 'Une erreur est survenue...'
        };
        if (error.error.message) {
          message.content = error.error.message;
        }
        this.dialog.open(AppMessagesComponent, {data: message});
        return throwError(error);
      })
    );
  }
};
