import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModulesModule } from '../../../shared/shared/shared.module';
import { ApiService } from '../../../api/api.service';
// import { SharedModulesModule } from '../../shared/shared-modules/shared-modules.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModulesModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  submitted = false;
  errorMsg = '';
  loading = false;
  hidePassword = true;

  constructor(private fb: FormBuilder, private router: Router, private api: ApiService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }


  onLogin() {
    this.submitted = true;
    this.errorMsg = '';

    if (this.loginForm.invalid) return;

    this.loading = true;

    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    // Call API login
    const credentials = {
      username: username,
      password: password
    }
    this.api.login(credentials).subscribe({
      next: (res: any) => {
        // Assuming backend returns a token on successful login
        if (res && res.token) {
          sessionStorage.setItem('token', res.token);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMsg = res?.message || 'Login failed';
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Login error', err);
        this.errorMsg = err?.error?.message || 'Server error, please try again';
        this.loading = false;
      },
      complete: () => {
        // Optional: runs after next or error
        console.log('Login request completed');
      }
    });
  }

}
