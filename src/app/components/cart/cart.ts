import { Component, OnInit, Signal, signal } from '@angular/core';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/cart.service';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

import { PaymentModal } from '../payment-modal/payment-modal';

@Component({
  selector: 'app-cart',
  imports: [ MatIcon, MatIconButton, MatButtonModule, MatDialogModule, MatListModule, MatDividerModule, CurrencyPipe ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  cartArray: Array<CartItem> = [];
  getTotalPrice: Signal<number> = signal<number>(0);

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.getTotalPrice = this.cartService.getTotalPrice;
  }

  ngOnInit(): void {
    this.cartArray = this.cartService.getAllItems();
  }

  addItem(item: CartItem) {
    const done = this.cartService.addItem(item.movie);

    if (!done) {
      this.snackBar.open('Não é possível adicionar este filme ao carrinho.', 'Fechar', {
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      });
      return;
    }
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.movie);
  }

  openPaymentModal() {
    if (!this.cartArray.length) {
      this.snackBar.open('Adicione itens ao carrinho antes de finalizar a compra.', 'Fechar', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 3000
      });
      return;
    }

    this.dialog.open(PaymentModal, {
      data: {
        total: this.getTotalPrice(),
        items: this.cartArray
      },
      width: '500px'
    });
  }
}
