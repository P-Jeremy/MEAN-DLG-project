import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {

  private userId: string;
  userData: {};
  isLoading = false;
  isNotifications = false;
  userPseudo: string;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;

    this.userData = this.authService.getUserData().subscribe((data) => {
      this.userData = data;
      this.userPseudo = data.data.pseudo;
      this.isNotifications = data.data.notifications;
      this.isLoading = false;
    });

  }

  /* Handle the notification status change */
  onCheckBoxChange(ev: boolean) {
    this.authService.changeNotifStatus(ev);
  }
}
