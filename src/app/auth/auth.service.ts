import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AppMessagesComponent } from '../appMessages/appMessages.component';



/* USER interface */
import { AuthData } from '../models/authData.model';
import { AppMessages } from '../models/appMessages.model';

import { environment } from '../../environments/environment';

const API_DOMAIN = environment.apiDomain + '/auth/';


/*
* Makes the service available at all 'root' levels of the application.
* Wich means everywhere on the SPA
*/
@Injectable({providedIn: 'root'})
export class AuthService {


  private message: AppMessages = {
    title: 'Oh yeah!',
    content: null
  };

  private isAdmin = false;
  private isAuthenticated = false;
  private tokenTimer: NodeJS.Timer;
  private token: string;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private adminStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) {}

  /** Returns the token */
  getToken() {
    return this.token;
  }

  /** Checks if user is authenticated */
  getIsAuth() {
    return this.isAuthenticated;
  }

  /** Checks if user is an admin */
  getIsAdmin() {
    return this.isAdmin;
  }

  /**
   *
   * Returns the auth status
   * as an observable
   *
   */
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  /**
   *
   * Returns the admin status
   * as an observable
   *
   */
  getAdminStatusListener() {
    return this.adminStatusListener.asObservable();
  }

  /** Returns the user Id */
  getUserId() {
    return this.userId;
  }

  /**
   * Allows to create a new user
   *
   * @param email of the user
   *
   * @param password of the user
   *
   * @param passwordBis of the user
   *
   * @param pseudo of the user
   *
   * @param apiKey secret key of the api
   */
  createUser(email: string, pseudo: string, password: string, passwordBis: string, apiKey: string) {
    const authData: AuthData = {
      email,
      pseudo,
      password
    };
    if (password !== passwordBis) {
      this.message.title = 'Oh hell no...';
      this.message.content = 'Veuillez entrer deux mots de passes identiques';
      this.authStatusListener.next(false);
      return this.dialog.open(AppMessagesComponent, {data: this.message});
    }
    return this.http.post(API_DOMAIN + `signup?key=${apiKey}`, authData)
      .subscribe(() => {
        this.redirect(['/auth/login']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  /**
   * Allows a registered user to login
   * and save the token and expiration in localstorage
   *
   * @param email of the user
   *
   * @param password of the user
   */
  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password,
    };
    this.http.post<{token: string, expiresIn: number, userId: string, isAdmin: boolean}>( API_DOMAIN + `login`, authData)
        .subscribe(response => {
          const token = response.token;
          this.token = token;
          if (token) {
            this.isAdmin = response.isAdmin;
            this.adminStatusListener.next(response.isAdmin);
            this.message.content = 'Vous êtes connectés';
            this.userId = response.userId;
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date ();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate, this.userId, this.isAdmin);
            this.dialog.open(AppMessagesComponent, {data: this.message});
            this.redirect(['/song']);
          }
        },
        error => {
          this.authStatusListener.next(false);
        });
  }

  /**
   * Authenticate automatically a user if auth info are still valid
   */
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.isAdmin = (authInformation.isAdmin) ? true : false;
      /* expiresIn is in milliseconds so we need to convert in seconds */
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.adminStatusListener.next(this.isAdmin);
    }
  }

  /**
   * Allows a user to ask to change his password
   * @param email of the user
   */
  newPasswordAsked(email: string) {
    const userEmail = {
      email
    };
    return this.http.post( API_DOMAIN + `newpassword`, userEmail)
    .subscribe(() => {
      this.message.content = 'Veillez vérifier votre boîte mail';
      this.dialog.open(AppMessagesComponent, {data: {message: this.message}});
      this.redirect(['/login']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  /**
   * Allows the user to choose a new password
   * @param password new password
   * @param passwordBis new password bis
   * @param token token received in the link
   */
  updatePassword(password: string, passwordBis: string, token: string) {
    if (password !== passwordBis) {
      this.message.title = 'Oh hell no...';
      this.message.content = 'Veuillez entrer deux mots de passes identiques';
      return this.dialog.open(AppMessagesComponent, {data: this.message});
    }
    this.clearAuthData();
    const authData: AuthData = {
      password
    };
    this.token = token ;
    return this.http.put( API_DOMAIN + `newpassword`, authData)
    .subscribe(() => {
      this.message.content = 'Nouveau mot de passe crée avec succès';
      this.token = null;
      this.dialog.open(AppMessagesComponent, {data: {message: this.message}});
      this.redirect(['/auth/login']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  /**
   * Allows a user to logout
   * and clear local storage
   */
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.isAdmin = false;
    this.adminStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.redirect(['/']);
  }

  /** Return to home page */
  redirect(to: any[]) {
    this.router.navigate(to);
  }

  /**
   * Set the timer to logout
   *
   * @param duration of the token set in the backend
   */
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  /**
   * Saves token, user id and expiration date in local storage
   *
   * @param token of the user
   *
   * @param expirationDate of the token
   *
   * @param userId of the user
   */
  private saveAuthData(token: string, expirationDate: Date, userId: string, isAdmin: boolean) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('isAdmin', isAdmin.toString());
  }

  /**
   * Clear token and expiration date in local storage
   *
   * @param token of the user
   *
   * @param expirationDate of the token
   */
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
  }

  /**
   * Get the auth info from local storage
   */
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const isAdmin = localStorage.getItem('isAdmin') === 'true' ? true : false;
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
      isAdmin
    };
  }
}
