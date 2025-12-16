import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  form = {
    email: '',
    password: ''
  };

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.login(this.form).subscribe({
      next: () => {
        this.router.navigate(['/']); // بعد اللوجين
      },
      error: err => alert(err.error.message)
    });
  }
}
