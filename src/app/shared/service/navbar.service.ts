import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  isLoggedIn$ : BehaviorSubject<boolean>;
  constructor() { 
    this.isLoggedIn$ = new BehaviorSubject<boolean>(false);
  }
}
