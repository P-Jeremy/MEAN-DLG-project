import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  templateUrl: './newPassword.component.html',
  styleUrls: ['./newPassword.component.css']
})

export class NewPasswordComponent implements OnInit, OnDestroy {

  isLoading = false;

  public token: string;

  constructor(public authService: AuthService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
    this.token = paramMap.get('token');
    });
  }


  /** Allows to submit a new password
   * @param form of input
   */
  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.updatePassword(form.value.password, form.value.passwordBis, this.token);
  }


  ngOnDestroy() {
  }
}
