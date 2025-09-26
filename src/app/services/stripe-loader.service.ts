import { Injectable } from '@angular/core';

import { STRIPE_PUBLISHABLE_KEY } from '../utils/stripe.config';

export interface StripePaymentMethodResult {
  error?: { message?: string };
  paymentMethod?: { id: string };
}

export interface StripeCardElement {
  mount(element: HTMLElement): void;
  destroy(): void;
}

export interface StripeElements {
  create(type: 'card'): StripeCardElement;
}

export interface StripeInstance {
  elements(options?: { locale?: string }): StripeElements;
  createPaymentMethod(options: {
    type: 'card';
    card: StripeCardElement;
    billing_details?: { name?: string };
  }): Promise<StripePaymentMethodResult>;
}

interface StripeConstructor {
  (key: string): StripeInstance;
}

interface StripeWindow extends Window {
  Stripe?: StripeConstructor;
}

@Injectable({ providedIn: 'root' })
export class StripeLoaderService {
  private stripePromise?: Promise<StripeInstance | null>;
  private stripeInstance: StripeInstance | null = null;

  loadStripe(): Promise<StripeInstance | null> {
    if (!STRIPE_PUBLISHABLE_KEY) {
      return Promise.resolve(null);
    }

    if (this.stripeInstance) {
      return Promise.resolve(this.stripeInstance);
    }

    if (!this.stripePromise) {
      this.stripePromise = new Promise((resolve) => {
        if (typeof window === 'undefined') {
          resolve(null);
          return;
        }

        const stripeWindow = window as StripeWindow;

        if (stripeWindow.Stripe) {
          this.stripeInstance = stripeWindow.Stripe(STRIPE_PUBLISHABLE_KEY);
          resolve(this.stripeInstance);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => {
          if (stripeWindow.Stripe) {
            this.stripeInstance = stripeWindow.Stripe(STRIPE_PUBLISHABLE_KEY);
            resolve(this.stripeInstance);
          } else {
            resolve(null);
          }
        };
        script.onerror = () => resolve(null);
        document.body.appendChild(script);
      });
    }

    return this.stripePromise;
  }
}
