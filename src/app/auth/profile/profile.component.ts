import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {

  userData: {};
  userPosts: number;
  isLoading = false;
  commentNotif = false;
  titleNotif = false;
  postNotif = false;
  userPseudo: string;
  isEdit = false;
  form: FormGroup;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.form = new FormGroup ({
      pseudo: new FormControl(null, {validators: [Validators.required, Validators.minLength(4)]}),
    });
    this.userData = this.authService.getUserData().subscribe((data) => {
      this.userData = data;
      this.userPseudo = data.data.pseudo;
      this.userPosts = data.posts;
      this.titleNotif = data.data.titleNotif;
      this.commentNotif = data.data.commentNotif;
      this.postNotif = data.data.postNotif;
      this.isLoading = false;
    });
  }

  /* Handle the notification status change */
  onCheckBoxChange(ev: boolean, src: string ) {
    this.authService.changeNotifStatus(ev, src);
  }

  onEdit() {
    this.isEdit = !this.isEdit;
  }

  onSaveProfile() {
    this.isLoading = true;
    this.authService.setNewPseudo(this.form.value.pseudo).subscribe(() => {
      this.authService.getUserData().subscribe((res) => {
        this.userPseudo = res.data.pseudo;
        this.isEdit = false;
        this.isLoading = false;
      });
    });
  }

  onDelete() {
    this.isLoading = true;
    if (confirm('Etes vous psur de vouloir supprimer votre profil ?')) {
      this.authService.deleteProfile();
    }
    this.isLoading = false;
  }
}
