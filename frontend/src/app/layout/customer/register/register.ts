import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {

  form = {
    name: '',
    email: '',
    phone: '',
    password: ''
  };

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.register(this.form).subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
      error: err => alert(err.error.message)
    });
  }
}
