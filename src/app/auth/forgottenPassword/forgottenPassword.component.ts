import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  templateUrl: './forgottenPassword.component.html',
  styleUrls: ['./forgottenPassword.component.css']
})

export class ForgottenPasswordComponent implements OnInit, OnDestroy {

  isLoading = false;

  public token: string;

  constructor(public authService: AuthService, public route: ActivatedRoute) {}

  ngOnInit() {
  }


  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.newPasswordAsked(form.value.email);
  }


  ngOnDestroy() {
  }
}
