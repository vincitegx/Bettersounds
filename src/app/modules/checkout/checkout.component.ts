import { Component, OnInit } from '@angular/core';
import { CartServiceService } from 'src/app/shared/service/cart-service.service';
import { AuthServiceService } from 'src/app/shared/service/auth-service.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from 'src/app/service/checkout.service';
import { Order } from 'src/app/models/order';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { CartItem } from 'src/app/models/cart-item';
import { Cart } from 'src/app/models/cart';
import { Users } from 'src/app/models/users';
import { ToastrService } from 'ngx-toastr';
import { OrderDto } from 'src/app/dtos/order-dto';
import { LocalStorageService } from 'ngx-webstorage';
import { AppState } from 'src/app/dtos/app-state';
import { CustomResponse } from 'src/app/dtos/custom-response';
import { DataState } from 'src/app/enum/datastate.enum';
import { catchError, map, startWith } from 'rxjs/operators';
import { NavbarService } from 'src/app/shared/service/navbar.service';
import { render } from 'creditcardpayments/creditCardPayments';
import { environment } from 'src/environments/environment';
import { Userinfo } from 'src/app/dtos/userinfo';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  clientApiUrl = environment.apiBaseUrl.client;
  userInfo: Userinfo;
  cartItems: CartItem[];
  checkoutFormGroup: FormGroup;
  totalPrice: number;
  totalQuantity: number = 0;
  order: Order;
  cart: Cart;
  orderDto: OrderDto;
  appState$: Observable<AppState<CustomResponse>>;
  adminApiUrl = environment.apiBaseUrl.admin;
  fileurl:string = this.adminApiUrl+"/api/beat/download"
  readonly DataState = DataState;
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  isLoggedIn$ = this.navbarService.isLoggedIn$;
  isLoggedInSub$: Subscription;

  ngOnInit() {
    this.isLoggedInSub$ = this.authService.isLoggedInClient$.subscribe(
      response => {
        this.isLoggedIn$.next(response);
        if (response) {
          this.userInfo = this.authService.getUser();
          console.log(this.userInfo);
          this.cartItems = this.cartService.cartItems;
          this.totalPrice = this.cartService.gettotalPrice();
          this.dataSubject.next(null);
        }else{
          this.router.navigateByUrl('/account');
        }
      }
    );
  }
  constructor(
    private cartService: CartServiceService,
    private authService: AuthServiceService,
    private router: Router,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private localStorage: LocalStorageService,
    private navbarService: NavbarService) {
    this.orderDto = {
      orderTotal: this.cartService.totalPrice1,
      cart: {
        grandTotal: this.cartService.totalPrice1,
        cartItems: this.cartService.cartItems
      },
      userInfo: this.authService.getUser()
    }
    // render(
    //   {
    //     id:"#myPaypalButtons",
    //     currency:"USD",
    //     value:this.cartService.totalPrice1.toString(),
    //     onApprove:(details)=>{
    //       toastr.success("Transaction Successful");
    //     }
    //   }
    // );
  }

  items$ = this.cartService.items$;


  submitOrder(): void {
    this.isLoading.next(true);
    this.checkoutService.placeOrder(this.orderDto)
      .subscribe(
        (data: any) => {
          this.isLoading.next(false);
          this.localStorage.clear('cartitems');
          this.router.navigateByUrl('/beats');
          this.toastr.success('Transaction Successful !!! Your order has been sent to your mail')
        },
        error => {
          throwError(error);
        });
  }
}
