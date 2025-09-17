import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsArray: Array<CartItem> = [];
  private totalPrice: WritableSignal<number> = signal<number>(0);
  getTotalPrice: Signal<number>;

  constructor() {
    this.cartItemsArray = JSON.parse(localStorage.getItem("cartArray") || "[]");
    this.updateTotalPrice();
    this.getTotalPrice = this.totalPrice.asReadonly();
  }

  updateTotalPrice() {
    const total = this.cartItemsArray.reduce((acc, item) => acc + (item.movie.price * item.quantity), 0);
    this.totalPrice.set(total);
  }

  getAllItems() {
    return this.cartItemsArray;
  }

  addItem(movie: Movie): boolean {
    const index = this.cartItemsArray.findIndex((item: CartItem) => movie.id == item.movie.id);
    
    if (movie.availableInStock <= 0) return false;

    if (index != -1) {
      const quantity = this.cartItemsArray[index].quantity;
      this.cartItemsArray[index].quantity = quantity < movie.availableInStock? quantity + 1 : quantity;
    } else {
      this.cartItemsArray.push({ movie, quantity: 1 });
    }

    this.updateTotalPrice();

    localStorage.setItem("cartArray", JSON.stringify(this.cartItemsArray));

    return true;
  }

  removeItem(movie: Movie) {
    const index = this.cartItemsArray.findIndex((item: CartItem) => movie.id == item.movie.id);
    if (index != -1) {
      this.cartItemsArray[index].quantity--;
      if (this.cartItemsArray[index].quantity <= 0) {
        this.cartItemsArray.splice(index, 1);
      }

      this.updateTotalPrice();
      localStorage.setItem("cartArray", JSON.stringify(this.cartItemsArray));
    }  
  }
}
