import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { NewPasswordComponent } from './auth/newPassword/newPassword.component';
import { ForgottenPasswordComponent } from './auth/forgottenPassword/forgottenPassword.component';


const routes: Routes = [
{ path: '', component: PostListComponent },
{ path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
{ path: 'edit/:postId', component: PostCreateComponent,  canActivate: [AuthGuard] },
{ path: 'login', component: LoginComponent},
{ path: 'signup', component: SignupComponent},
{ path: 'newpassword/:token', component: NewPasswordComponent},
{ path: 'login/resetpassword', component: ForgottenPasswordComponent},




];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule],
providers: [AuthGuard]
})

export class AppRoutingModule {}
