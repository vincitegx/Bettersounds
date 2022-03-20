import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { Loginrequestpayload } from 'src/app/dtos/loginrequestpayload';
import { AuthServiceService } from 'src/app/shared/service/auth-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginRequestPayload: Loginrequestpayload;
  login:boolean;
  loginForm: FormGroup;
  returnUrl: string;
  isError: Boolean;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthServiceService,
    private toastr: ToastrService) {
      this.loginRequestPayload={
        email:'',
        password:''
      }}

  ngOnInit() {

    this.login = window.location.href.endsWith("admin");
    this.loginForm = new FormGroup({
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', Validators.required),
    })

  }

  onSubmit(){
    this.loginRequestPayload.email = this.loginForm.get('email').value;
    this.loginRequestPayload.password = this.loginForm.get('password').value;
    this.authService.loginAdmin(this.loginRequestPayload).subscribe(data => {
      if(data){
        this.loginForm.reset();
        this.isError = false;
        this.router.navigateByUrl('admindashboard');
      this.toastr.success('Login Successful');
      }
    }, error => {
      this.isError = true;
      this.loginForm.reset();
      this.toastr.error('Login Failed, Try Again !!!');
      throwError(error);
    });
  }

}
