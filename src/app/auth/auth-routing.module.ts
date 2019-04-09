import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { NewPasswordComponent } from '../auth/newPassword/newPassword.component';
import { ForgottenPasswordComponent } from '../auth/forgottenPassword/forgottenPassword.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'newpassword/:token', component: NewPasswordComponent },
  { path: 'login/resetpassword', component: ForgottenPasswordComponent },
]
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AuthRoutingModule {}
