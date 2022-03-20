import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { map, take } from 'rxjs/operators';
import { CartItem } from 'src/app/models/cart-item';
import { BeatDto } from 'src/app/dtos/beat-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BeatType } from 'src/app/enum/beattype.enum';
import { AuthServiceService } from './auth-service.service';
import { Userinfo } from 'src/app/dtos/userinfo';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  cartItems: CartItem[];
  totalPrice1: number;
  cartItemPrice: number;
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  username: BehaviorSubject<string> = new BehaviorSubject<string>('');
  itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();
  alreadyExistInCart: boolean = false;
  existingCartItem: CartItem;

  constructor(private localStorageService: LocalStorageService) {
    this.cartItems = JSON.parse(localStorageService.retrieve('cartitems'));
    if (!this.cartItems) {
      this.cartItems = []
      this.totalPrice1 = 0;
    }
    this.totalPrice1 = this.gettotalPrice();
    this.itemsSubject.next(this.cartItems);
  }  

  addToCart(cartItem: CartItem): boolean {
    let added = false;
    let addedbefore = false;
    if (this.cartItems.length > 0) {
      let i;
      for (i in this.cartItems) {
        if (cartItem.beat.id == this.cartItems[i].beat.id && cartItem.beatType == this.cartItems[i].beatType) {
          addedbefore = true;
          break;
        }
      }
      if (addedbefore == false) {
        this.cartItems.push(cartItem);
        this.localStorageService.clear('cartitems');
        this.localStorageService.store('cartitems', JSON.stringify(this.cartItems));
        added = true;
      }
    } else {
      this.cartItems.push(cartItem);
      this.localStorageService.store('cartitems', JSON.stringify(this.cartItems));
      added = true;
    }
    this.gettotalPrice();
    return added;
  }

  updateCart(cartItem: CartItem): boolean {
    let updated = false;
    let added = false;
    if (this.cartItems.length > 0) {
      let i;
      for (i in this.cartItems) {
        if (cartItem.beat == this.cartItems[i].beat) {
          this.cartItems[i] = cartItem;
          added = true;
          break;
        }
      }
      if (added == true) {
        this.localStorageService.clear('cartitems');
        this.localStorageService.store('cartitems', JSON.stringify(this.cartItems));
        updated = true;
      }
    } else {
      updated = false;
    }
    this.gettotalPrice();
    return updated;
  }
  gettotalPrice(): number {
    this.totalPrice1 = 0;
    let i;
    let a = 0;
    for (i in this.cartItems) {
      if (this.cartItems[i].beatType == BeatType.mp3) {
        this.totalPrice1 += this.cartItems[i].beat.priceMp3 * this.cartItems[i].qty;
      } else {
        this.totalPrice1 += this.cartItems[i].beat.priceWav * this.cartItems[i].qty;
      }
    }
    return this.totalPrice1;
  }

  removeCartItem(cartItem: CartItem) {
    if (this.cartItems.length > 0) {
      this.localStorageService.clear('cartitems');
      let i;
      for (i in this.cartItems) {
        if (cartItem.beat.id == this.cartItems[i].beat.id) {
          this.cartItems.splice(i, 1)
          this.localStorageService.store('cartitems', JSON.stringify(this.cartItems));
          break;
        } else {
          this.existingCartItem = undefined;
        }
      }
    }
  }
}