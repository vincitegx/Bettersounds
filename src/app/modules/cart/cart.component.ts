import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AppState } from 'src/app/dtos/app-state';
import { CustomResponse } from 'src/app/dtos/custom-response';
import { Userinfo } from 'src/app/dtos/userinfo';
import { BeatType } from 'src/app/enum/beattype.enum';
import { DataState } from 'src/app/enum/datastate.enum';
import { CartItem } from 'src/app/models/cart-item';
import { AuthServiceService } from 'src/app/shared/service/auth-service.service';
import { CartServiceService } from 'src/app/shared/service/cart-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  username : BehaviorSubject<string> = new BehaviorSubject<string>('');
  cartItems: CartItem[];
  cartItem: CartItem;
  editCartItem: CartItem;
  totalItems: number;
  totalPrice: number;
  model: any = {};
  beatType: BeatType;
  beatPrice: Observable<number>;
  isLoggedIn = new BehaviorSubject<Boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();
  isLoginSub$: Subscription;
  isLogIn$: BehaviorSubject<boolean>;
  readonly BeatType = BeatType;
  user: Userinfo;
  adminApiUrl = environment.apiBaseUrl.admin;
  fileurl:string = this.adminApiUrl+"/api/beat/download"
  // cartState$: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  constructor(private cartService: CartServiceService,
    private authService: AuthServiceService,
    private toastrService: ToastrService) {
    this.cartItems = this.cartService.cartItems;
    this.cartItem = new CartItem();
    this.isLogIn$ = new BehaviorSubject<boolean>(false);
  }

  items$ = this.cartService.items$;

  ngOnInit() {
    this.cartItems = this.cartService.cartItems;
    // this.cartState$ = this.items$.pipe(
    //   map(response => { return { dataState: DataState.LOADED_STATE, appData: response } }),
    //   startWith({ dataState: DataState.LOADING_STATE }),
    //   catchError((error: string) => { return of({ dataState: DataState.ERROR_STATE, error }) })
    // );
    this.totalPrice = this.cartService.gettotalPrice();
    this.totalItems = this.cartItems.length;
    this.isLoginSub$ = this.authService.isLoggedInClient$.subscribe(
      respone => {
        this.isLogIn$.next(respone);
        if(this.authService.isLoggedIn()){
          this.user = this.authService.getUser();
          this.username.next(this.user.name);
        }else{
          this.username = this.cartService.username;
        }
      })

  }

  onCartQtyChanged(cartItem: CartItem, qty: number) {
    if(qty == null){
      qty =1;
    }
    cartItem.qty = qty;
    let cartUpdated = false;
    cartUpdated = this.cartService.updateCart(cartItem);
    if (cartUpdated == true) {
      this.totalPrice = this.cartService.gettotalPrice();
    }
  }

  removeItemFromCart(cartItem: CartItem) {
    this.cartService.removeCartItem(cartItem);
    this.totalPrice = this.cartService.gettotalPrice();
    this.totalItems = this.cartItems.length;
    this.toastrService.success('Item has Been Removed From Cart');
  }
}
