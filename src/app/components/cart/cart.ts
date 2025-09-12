import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/cart.service';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-cart',
  imports: [ MatIcon, MatIconButton,  MatListModule ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  cartArray: Array<CartItem> = [];

  constructor(private cartService: CartService) {

  }

  ngOnInit(): void {
    this.cartArray = this.cartService.getAllItems();
  }
}
