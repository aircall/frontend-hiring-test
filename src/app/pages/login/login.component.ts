import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IAuth } from '@core/models/auth.interface';

import { AuthService } from '@core/services/auth/auth.service';

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

  constructor(private _authService: AuthService) {}

  public onSubmit(): void {
    this._authService.auth(this.authData).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
