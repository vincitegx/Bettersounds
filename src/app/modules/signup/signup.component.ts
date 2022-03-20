import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/shared/service/auth-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Signuprequestpayload } from 'src/app/dtos/signuprequestpayload';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpRequestPayload: Signuprequestpayload;
  signUpForm: FormGroup;

  constructor(private authService : AuthServiceService, private router : Router, private toastr: ToastrService) { 
    this.signUpRequestPayload = {
      name : '',
      email : '',
      password : '',
      matchingPassword : ''
    }
  }

  ngOnInit(){
    this.signUpForm = new FormGroup({
    fname : new FormControl('', Validators.required),
    email : new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required, Validators.minLength(6)]),
    cpassword : new FormControl('', [Validators.required, Validators.minLength(6)]),
  })
  }

  

  onSubmitRegistrationForm(){
    this.signUpRequestPayload.name = this.signUpForm.get('fname').value;
    this.signUpRequestPayload.email = this.signUpForm.get('email').value;
    this.signUpRequestPayload.password = this.signUpForm.get('password').value;
    this.signUpRequestPayload.matchingPassword = this.signUpForm.get('cpassword').value;
    this.authService.signUp(this.signUpRequestPayload).subscribe(
      ()=>{
        this.router.navigate(['/activateAccount'],{queryParams:{registered:'true'}});
      },
      ()=>{
        this.toastr.error('Registration Failed, Please Try Again')
      }
    );
  }

}
