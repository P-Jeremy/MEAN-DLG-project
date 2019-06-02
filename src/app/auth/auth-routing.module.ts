import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NewPasswordComponent } from './newPassword/newPassword.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { ForgottenPasswordComponent } from './forgottenPassword/forgottenPassword.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'newpassword/:token', component: NewPasswordComponent },
  { path: 'login/resetpassword', component: ForgottenPasswordComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
];
@NgModule({
  imports: [
  RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthGuard]
})

export class AuthRoutingModule {}
