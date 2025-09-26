import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartItem } from '../../models/cart-item';
import {
  StripeCardElement,
  StripeElements,
  StripeInstance,
  StripeLoaderService
} from '../../services/stripe-loader.service';

interface PaymentModalData {
  total: number;
  items: CartItem[];
}

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    FormsModule,
    CurrencyPipe,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './payment-modal.html',
  styleUrl: './payment-modal.scss'
})
export class PaymentModal implements AfterViewInit, OnDestroy {
  @ViewChild('cardElement', { static: true })
  cardElement?: ElementRef<HTMLDivElement>;

  cardHolderName = '';
  loading = false;
  stripeReady = false;
  statusMessage = '';

  private stripe: StripeInstance | null = null;
  private elements: StripeElements | null = null;
  private card?: StripeCardElement;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PaymentModalData,
    private dialogRef: MatDialogRef<PaymentModal>,
    private stripeLoader: StripeLoaderService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await this.initializeStripe();
  }

  ngOnDestroy(): void {
    this.card?.destroy();
  }

  async submitPayment(): Promise<void> {
    if (!this.stripe || !this.card) {
      this.statusMessage = 'O Stripe ainda está inicializando. Tente novamente em instantes.';
      return;
    }

    this.loading = true;
    this.statusMessage = '';

    try {
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.card,
        billing_details: {
          name: this.cardHolderName || undefined
        }
      });

      if (error) {
        this.statusMessage = error.message ?? 'Não foi possível criar o método de pagamento.';
      } else if (paymentMethod) {
        this.statusMessage = `Pagamento autorizado! Código: ${paymentMethod.id}.`;
      }
    } catch (error) {
      this.statusMessage = 'Ocorreu um erro inesperado. Tente novamente em instantes.';
    } finally {
      this.loading = false;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  private async initializeStripe(): Promise<void> {
    this.stripe = await this.stripeLoader.loadStripe();

    if (!this.stripe) {
      this.statusMessage = 'Não foi possível inicializar o Stripe. Verifique sua configuração.';
      return;
    }

    if (!this.cardElement) {
      this.statusMessage = 'Elemento de cartão não encontrado.';
      return;
    }

    this.elements = this.stripe.elements({ locale: 'pt-BR' });
    this.card = this.elements.create('card');
    this.card.mount(this.cardElement.nativeElement);
    this.stripeReady = true;
  }
}
