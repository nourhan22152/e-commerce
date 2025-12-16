import { Component,  OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile  implements OnInit {

  customer: any;

    constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.customer = this.auth.getCustomer();
  }

  logout() {
  this.auth.logout();
  this.router.navigate(['/login']);
}


}
