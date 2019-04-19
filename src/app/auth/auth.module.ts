import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ForgottenPasswordComponent } from './forgottenPassword/forgottenPassword.component';
import { LoginComponent } from './login/login.component';
import { NewPasswordComponent } from './newPassword/newPassword.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { StaticModule } from '../static/static.module';


@NgModule({
  declarations: [
    ForgottenPasswordComponent,
    LoginComponent,
    NewPasswordComponent,
    SignupComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    StaticModule
  ]
})

export class AuthModule {}
