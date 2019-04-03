import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


/* USER interface */
import { AuthData } from './authData.model';

/*
* Makes the service available at all 'root' levels of the application.
* Wich means everywhere on the SPA
*/
@Injectable({providedIn: 'root'})
export class AuthService {

  private isAuthenticated = false;
  private tokenTimer: NodeJS.Timer;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  /** Returns the token */
  getToken() {
    return this.token;
  }

  /** Checks if user is authenticated */
  getIsAuth() {
    return this.isAuthenticated;
  }

  /** Returns the auth status */
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  /**
   * Allows to create a new user
   *
   * @param email of the user
   *
   * @param password of the user
   */
  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http.post('http://localhost:8080/api/auth/signup', authData)
      .subscribe(response => {
        console.log(response);
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
      password
    };
    this.http.post<{token: string, expiresIn: number}>('http://localhost:8080/api/auth/login', authData)
        .subscribe(response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date ();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate);
            this.goHome();
          }
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
      /* expiresIn is in milliseconds so we need to convert in seconds */
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }


  /**
   * Allows a user to logout
   * and clear local storage
   */
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.goHome();
  }

  /** Return to home page */
  goHome() {
    this.router.navigate(['/']);
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
   * Saves token and expiration date in local storage
   *
   * @param token of the user
   *
   * @param expirationDate of the token
   */
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
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
  }

  /**
   * Get the auth info from local storage
   */
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate){
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }
}
