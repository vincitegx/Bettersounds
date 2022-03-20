import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/shared/service/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, throwError } from 'rxjs';
import { Loginrequestpayload } from 'src/app/dtos/loginrequestpayload';
import { NavbarService } from 'src/app/shared/service/navbar.service';
import { CustomResponse } from 'src/app/dtos/custom-response';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  loginRequestPayload: Loginrequestpayload;
  loginForm: FormGroup;
  registerSuccessMessage: String;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(private authService: AuthServiceService,
     private activatedRoute: ActivatedRoute,
     private router: Router,
     private toastr: ToastrService,
     private navbarService:NavbarService) { 
    this.loginRequestPayload={
      email:'',
      password:''
    }
  }

  ngOnInit(){
    this.loginForm = new FormGroup({
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', Validators.required),
    });

    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true') {
          this.toastr.success('Signup Successful');
          this.registerSuccessMessage = 'Please Check your inbox for activation email '
            + 'activate your account before you Login!';
        }
      });      
  }
  login(){
    if(this.loginForm.valid){
      this.isLoading.next(true); 
      this.loginRequestPayload.email = this.loginForm.get('email').value;
      this.loginRequestPayload.password = this.loginForm.get('password').value;
      this.authService.login(this.loginRequestPayload).subscribe(data => {
          this.isLoading.next(false);
          this.router.navigateByUrl('/cart'); 
          this.loginForm.reset();
          this.navbarService.isLoggedIn$.next(data);
          this.toastr.success('Login Successful');
      }, error => {
        this.isLoading.next(false);
      this.toastr.error('Login Failed, Try Again !!!');
      throwError(error);
    });
    }
    
  }

}
