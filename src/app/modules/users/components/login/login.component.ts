import { Component, InjectionToken, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'user-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {}

  loginForm: FormGroup;
  spinner: boolean;
  notAuthenticated: boolean;

  ngOnInit(): void {
    this.initForm();
  }

  login(): void {
    this.loading();
    this.loginService.authenticate(this.loginForm.value).subscribe(
      (response) => {
        this.loginForm.reset();
      },
      (error) => {
        this.loading(false);
        this.notAuthenticated = true;
      },
      () => {
        this.loading(false);
      }
    );
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  private loading(start = true): void {
    if (start) {
      this.spinner = true;
      this.loginForm.disable();
      this.notAuthenticated = false;
    } else {
      this.spinner = false;
      this.loginForm.enable();
    }
  }
}
