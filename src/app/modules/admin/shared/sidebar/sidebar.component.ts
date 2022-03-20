import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Userinfo } from 'src/app/dtos/userinfo';
import { SidebarService } from 'src/app/service/sidebar.service';
import { AuthServiceService } from 'src/app/shared/service/auth-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class SidebarComponent implements OnInit {

  menus = [];
  // isLoggedIn: boolean;
  name:String;
  user:Userinfo;
  isLoggedIn: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(public sidebarservice: SidebarService,
    private authService: AuthServiceService, 
    private router: Router, 
    private toastr: ToastrService) {
    this.menus = sidebarservice.getMenuList();
   }

  ngOnInit() {
    this.authService.loggedIn.subscribe((data:boolean) => this.isLoggedIn);
    this.authService.user.subscribe((data:Userinfo) => this.user = data);
    // this.isLoggedIn = this.authService.isLoggedIn();
    this.isUserLoggedIn();
    this.user = this.authService.getUser();
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  toggle(currentMenu) {
    if (currentMenu.type === 'dropdown') {
      this.menus.forEach(element => {
        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
        }
      });
    }
  }

  isUserLoggedIn(){
    this.authService.isLoggedInAdmin$
    .pipe(
      map(response=> {
        return this.isLoggedIn.next(response);
      })
    );
  }

  getState(currentMenu) {

    if (currentMenu.active) {
      return 'down';
    } else {
      return 'up';
    }
  }

  hasBackgroundImage() {
    return this.sidebarservice.hasBackgroundImage;
  }

  logout(){
    this.authService.logoutAdmin();
    // this.isLoggedIn = false;
    this.isUserLoggedIn();
    this.toastr.success('You Have Been Logged Out Successfully !!!');
    this.router.navigateByUrl('/admin');
  }

}
