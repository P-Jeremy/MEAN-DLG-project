import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private swUpdate: SwUpdate, private authService: AuthService) { }

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

