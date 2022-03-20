import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { Loginrequestpayload } from 'src/app/dtos/loginrequestpayload';
import { AuthServiceService } from 'src/app/shared/service/auth-service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  ngOnInit(): void {
  }
  isLoggedIn:Boolean;
  constructor(private authService: AuthServiceService, private router: Router){

  }
  logout(){
    this.authService.logoutAdmin();
    this.isLoggedIn = false;
    this.router.navigateByUrl('/admin');
  }

}
