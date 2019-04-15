import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { NewPasswordComponent } from '../auth/newPassword/newPassword.component';
import { ForgottenPasswordComponent } from '../auth/forgottenPassword/forgottenPassword.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'newpassword/:token', component: NewPasswordComponent },
  { path: 'login/resetpassword', component: ForgottenPasswordComponent },
  { path: 'profile/:userId', component: ProfileComponent, canActivate: [AuthGuard] },
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
