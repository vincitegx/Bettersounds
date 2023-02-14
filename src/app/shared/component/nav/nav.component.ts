import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthServiceService } from '../../service/auth-service.service';
import { Router } from '@angular/router';
import { CartServiceService } from '../../service/cart-service.service';
import { Userinfo } from 'src/app/dtos/userinfo';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { NavbarService } from '../../service/navbar.service';
import { Loginresponsepayload } from 'src/app/dtos/loginresponsepayload';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {

  isLoggedIn$ = this.navbarService.isLoggedIn$;
  loginPayloadDataSubject: BehaviorSubject<Loginresponsepayload>;
  isLoggedInSub$: Subscription;
  logout$: Subscription;
  user: Userinfo;
  items$ = this.cartService.items$;
  constructor(private authService: AuthServiceService,
    private router: Router,
    private cartService: CartServiceService,
    private toastr: ToastrService,
    private localStorage: LocalStorageService,
    private navbarService: NavbarService) {
  }
  ngOnDestroy(): void {
    this.isLoggedInSub$.unsubscribe();
    this.logout$.unsubscribe();
  }

  ngOnInit() {
    // if (window.location.pathname == "/") {
    //   document.getElementById("home").style.color = "#45fe34";
    // }
    // if (window.location.pathname == "/beats") {
    //   document.getElementById("beats").style.color = "#45fe34";
    // }
    this.isLoggedInSub$ = this.authService.isLoggedInClient$.subscribe(
      response => {
        this.isLoggedIn$.next(response);
        if (response) {
          this.loginPayloadDataSubject = this.authService.refreshTokenSubject$;
        }
      }
    );
    this.authService.user.subscribe((data: Userinfo) => this.user = data);
  }

  logout() {
    this.logout$ = this.authService.logOutUser$().subscribe(
      subscriber => {
        if (subscriber.data.taskStatus) {
          this.isLoggedIn$.next(false);
          // this.localStorage.clear('cartitems');
          this.localStorage.clear('authtoken');
          this.localStorage.clear('user');
          this.localStorage.clear('refreshtoken');
          this.localStorage.clear('expiresat');
          this.toastr.success('You Have Been Logged Out !!!');
          this.router.navigateByUrl('/');
        }
      }
    )
  }
}
