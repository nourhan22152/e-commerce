import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product: any = null;
  quantity: number = 1;
  selectedVariant: any = null;
  selectedSize: string = '';
  mainImage: string = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.productService.getById(id!).subscribe((res: any) => {
      this.product = res.data || res;

      this.selectedVariant = this.product.variants[0];
      this.mainImage = this.selectedVariant.image;
      this.selectedSize = this.selectedVariant.sizes[0]?.size || '';
    });
  }

  selectVariant(variant: any) {
    this.selectedVariant = variant;
    this.mainImage = variant.image;
    this.selectedSize = variant.sizes[0]?.size || '';
  }

  selectImage(img: string) {
    this.mainImage = img;
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {

    // ⛔ لو المستخدِم ما اختارش المقاس
    if (!this.selectedSize) {
      alert("Please select size");
      return;
    }

    const cartId = localStorage.getItem("cartId");

    const payload = {
      productId: this.product._id,
      color: this.selectedVariant.color,
      size: this.selectedSize,
      quantity: this.quantity,
      cartId: cartId || undefined
    };

    this.cartService.addToCart(payload).subscribe((res: any) => {
      if (!cartId && res.cartId) {
        localStorage.setItem("cartId", res.cartId);
      }

      alert("Added to cart successfully!");
    });
  }

}
