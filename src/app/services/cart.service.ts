import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItemsArray: Array<CartItem> = [];

  constructor() {
    this.cartItemsArray = JSON.parse(localStorage.getItem("cartArray") || "[]");
  }

  getAllItems() {
    return this.cartItemsArray;
  }

  addItem(movie: Movie) {
    const index = this.cartItemsArray.findIndex((item: CartItem) => movie.id == item.movie.id);
    if (index != -1) {
      this.cartItemsArray[index].quantity++;
    } else {
      this.cartItemsArray.push({ movie, quantity: 1 });
    }

    localStorage.setItem("cartArray", JSON.stringify(this.cartItemsArray));
  }
}
