import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private swUpdate: SwUpdate) { }

  ngOnInit() {
    this.authService.autoAuthUser();
    if (this.swUpdate.isEnabled) {

      this.swUpdate.available.subscribe(() => {

        if (confirm('Une mise à jour est disponnible. Mettre à jour?')) {

          window.location.reload();
        }
      });
    }
  }
}

