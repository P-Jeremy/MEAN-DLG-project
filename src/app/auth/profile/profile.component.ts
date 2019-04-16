import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {

  userData: {};
  isLoading = false;
  isNotifications = false;
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
      this.isNotifications = data.data.notifications;
      this.isLoading = false;
    });
  }

  /* Handle the notification status change */
  onCheckBoxChange(ev: boolean) {
    this.authService.changeNotifStatus(ev);
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
    if (confirm('Etes vous psur de vouloir supprimer votre profile ?')) {
      this.authService.deleteProfile();
    }
  }
}
