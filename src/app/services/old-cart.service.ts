import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class OldCartService {
  // Estado interno
  private cartItemsArray: CartItem[] = [];

  // Streams públicas (Observables)
  private totalPriceSubject = new BehaviorSubject<number>(0);
  totalPrice$ = this.totalPriceSubject.asObservable();

  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  // Evento pontual para “algo mudou no carrinho”
  private cartChangedSubject = new Subject<void>();
  cartChanged$ = this.cartChangedSubject.asObservable();

  constructor() {
    try {
      const raw = localStorage.getItem('cartArray');
      this.cartItemsArray = raw ? JSON.parse(raw) : [];
    } catch {
      this.cartItemsArray = [];
    }
    this.emitState(); // atualiza itens$ e totalPrice$
  }

  /** Atualiza o BehaviorSubject do total. */
  private updateTotalPrice(): void {
    const total = this.cartItemsArray
      .reduce((acc, item) => acc + (item.movie.price * item.quantity), 0);
    this.totalPriceSubject.next(total);
  }

  /** Dispara todos os Observables e persiste no localStorage. */
  private emitState(): void {
    this.itemsSubject.next([...this.cartItemsArray]); // cópia para evitar mutação externa
    this.updateTotalPrice();
    localStorage.setItem('cartArray', JSON.stringify(this.cartItemsArray));
    this.cartChangedSubject.next();
  }

  /** Mantém compatibilidade com o código existente (não reativo). */
  getAllItems(): CartItem[] {
    return [...this.cartItemsArray];
  }

  addItem(movie: Movie): boolean {
    const index = this.cartItemsArray.findIndex((item: CartItem) => movie.id === item.movie.id);

    if (movie.availableInStock <= 0) return false;

    if (index !== -1) {
      const current = this.cartItemsArray[index].quantity;
      this.cartItemsArray[index].quantity = current < movie.availableInStock ? current + 1 : current;
    } else {
      this.cartItemsArray.push({ movie, quantity: 1 });
    }

    this.emitState();
    return true;
  }

  removeItem(movie: Movie): void {
    const index = this.cartItemsArray.findIndex((item: CartItem) => movie.id === item.movie.id);
    if (index !== -1) {
      this.cartItemsArray[index].quantity--;
      if (this.cartItemsArray[index].quantity <= 0) {
        this.cartItemsArray.splice(index, 1);
      }
      this.emitState();
    }
  }

  /** Extra opcional */
  clear(): void {
    this.cartItemsArray = [];
    this.emitState();
  }
}
