import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userIsAuth = false;
  userIsAdmin = false;

  private authListenerSubs: Subscription;
  private adminListenerSubs: Subscription;


  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuth = this.authService.getIsAuth();
    this.userIsAdmin = this.authService.getIsAdmin();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.userIsAuth = isAuth;
    });
    this.adminListenerSubs = this.authService.getAdminStatusListener().subscribe(isAdmin => {
      this.userIsAdmin = isAdmin;
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.adminListenerSubs.unsubscribe();
  }

  onLogout() {
    if (confirm('Êtes vous sûr de vouloir vous déconnecter ?')) {
      this.authService.logout();
    } else {
      return;
    }
  }

}
