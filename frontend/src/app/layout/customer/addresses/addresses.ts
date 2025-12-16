import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './addresses.html',
  styleUrls: ['./addresses.css'],
})
export class Addresses implements OnInit {

  customer: any;
  newAddress = {
    label: 'home',
    city: '',
    street: '',
    building: '',
    floor: '',
    apartment: '',
    phone: '',
    notes: ''
  };

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.customer = this.auth.getCustomer();
  }

  add() {
    this.auth.addAddress(this.newAddress).subscribe({
      next: (res: any) => {
        this.customer.addresses = res.addresses;
        this.auth.saveCustomer(this.customer); // مهم جداً
      }
    });
  }


delete(index: number) {
  this.auth.deleteAddress(index).subscribe({
    next: (res: any) => {
      this.customer.addresses = res.addresses;
      this.auth.saveCustomer(this.customer); // مهم جداً
    }
  });
}


  editingIndex: number | null = null;
  editAddress: any = {};

  update(index: number) {
    this.editingIndex = index;
    this.editAddress = { ...this.customer.addresses[index] }; // copy existing address
  }

  saveUpdate() {
    if (this.editingIndex === null) return;

    this.auth.updateAddress(this.editingIndex, this.editAddress).subscribe({
      next: (res: any) => {
        this.customer.addresses = res.addresses;
        this.auth.saveCustomer(this.customer); // مهم جداً
        this.editingIndex = null;
      }
    });
  }


}
