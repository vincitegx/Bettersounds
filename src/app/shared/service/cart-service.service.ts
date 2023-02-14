import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { catchError, map, take, tap } from 'rxjs/operators';
import { CartItem } from 'src/app/models/cart-item';
import { BeatDto } from 'src/app/dtos/beat-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BeatType } from 'src/app/enum/beattype.enum';
import { AuthServiceService } from './auth-service.service';
import { Userinfo } from 'src/app/dtos/userinfo';
import { BeatServiceService } from './beat-service.service';
import { CustomResponse } from 'src/app/dtos/custom-response';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  cartItems: CartItem[];
  beatIds: Number[];
  totalPrice1: number;
  cartItemPrice: number;
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  username: BehaviorSubject<string> = new BehaviorSubject<string>('');
  itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();
  beatItemsSubject = new BehaviorSubject<CartItem[]>([]);
  beatItems$ = this.beatItemsSubject.asObservable();
  alreadyExistInCart: boolean = false;
  existingCartItem: CartItem;
  beat: Observable<CustomResponse>;

  constructor(private localStorageService: LocalStorageService,
    private beatService: BeatServiceService) {
    this.cartItems = JSON.parse(localStorageService.retrieve('cartitems'));
    if (!this.cartItems) {
      this.cartItems = [];
      this.totalPrice1 = 0;
    } else {
      this.cartItems = this.getBeatsByIds(this.cartItems);
    }
    this.totalPrice1 = this.gettotalPrice();
    this.itemsSubject.next(this.cartItems);
  }

  getBeatsByIds(cartItems: CartItem[]): CartItem[] {
    cartItems.forEach(cartItem => {
      this.beatService.getBeat$(cartItem.beatId).subscribe(
        (response)=>{
          cartItem.beat = response.data.beat;
        }
      );
    })
    return cartItems;
  }

  addToCart(cartItem: CartItem): boolean {
    let added = false;
    let addedbefore = false;
    if (this.cartItems.length > 0) {
      let i;
      for (i in this.cartItems) {
        if (cartItem.beatId == this.cartItems[i].beatId && cartItem.beatType == this.cartItems[i].beatType) {
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
      this.totalPrice1 += this.cartItems[i].price * this.cartItems[i].qty;
    }
    return this.totalPrice1;
  }

  removeCartItem(cartItem: CartItem) {
    if (this.cartItems.length > 0) {
      this.localStorageService.clear('cartitems');
      let i;
      for (i in this.cartItems) {
        if (cartItem.beat == this.cartItems[i].beat) {
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