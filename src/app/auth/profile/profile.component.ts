import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
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

  constructor(public route: ActivatedRoute, public authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId = paramMap.get('userId');
      this.userData = this.authService.getUserData(this.userId).subscribe((data) => {
        this.userData = data.data;
        this.isLoading = false;
      });
    });
  }
}
