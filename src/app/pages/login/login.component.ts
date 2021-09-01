import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IAuth } from '@core/models/auth.interface';

import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    class: 'h-100',
  },
})
export class LoginComponent {
  public loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  public authData: IAuth = {
    username: '',
    password: '',
  };
  public passwordVisible = true;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _notificationService: NotificationService
  ) {}

  public onSubmit(): void {
    this._notificationService.setLoader();
    this._authService.auth(this.authData).subscribe(
      (res) => {
        this._notificationService.clearLoading();
        this._router.navigate(['./calls/list']);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
