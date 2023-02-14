import { Injectable, Output, EventEmitter } from '@angular/core';
import { throwError, Observable, pipe, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { LocalStorageService } from 'ngx-webstorage';
import { Userinfo } from 'src/app/dtos/userinfo';
import { Signuprequestpayload } from 'src/app/dtos/signuprequestpayload';
import { Loginrequestpayload } from 'src/app/dtos/loginrequestpayload';
import { Loginresponsepayload } from 'src/app/dtos/loginresponsepayload';
import { CustomResponse } from 'src/app/dtos/custom-response';
import { environment } from 'src/environments/environment';
import { RoleType } from 'src/app/enum/roletype.enum';
import { RefreshtokenrequestPayload } from 'src/app/dtos/refreshtokenrequest-payload';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() user: EventEmitter<Userinfo> = new EventEmitter();
  refreshTokenSubject$ = new BehaviorSubject<Loginresponsepayload>(null);
  private readonly adminApiServerUrl = environment.apiBaseUrl.admin;
  private readonly clientApiServerUrl = environment.apiBaseUrl.client;
  refreshTokenRequest: RefreshtokenrequestPayload = new RefreshtokenrequestPayload();
  userInfo: Userinfo;
  constructor(private httpClient: HttpClient, private localStorage: LocalStorageService) {}

  signUp(signUpRequestPayload: Signuprequestpayload): Observable<any> {
    return this.httpClient.post(`${this.adminApiServerUrl}/api/auth/signup`, signUpRequestPayload, { responseType: 'text' });
  }

  get adminServerUrl(){
    return this.adminApiServerUrl;
  }

  get clientServerUrl(){
    return this.clientApiServerUrl;
  }

  login(loginRequestPayload: Loginrequestpayload): Observable<boolean> {
    return this.httpClient.post<CustomResponse>(`${this.adminApiServerUrl}/api/auth/login`, loginRequestPayload)
      .pipe(
        tap(console.log),
        map(response => {
        this.localStorage.store('authtoken', response.data.JwtResponse.authenticationToken);
        this.localStorage.store('user', response.data.JwtResponse.user);
        this.localStorage.store('refreshtoken', response.data.JwtResponse.refreshToken);
        this.localStorage.store('expiresat', response.data.JwtResponse.expiresAt);
        this.refreshTokenSubject$.next(response.data.JwtResponse);
        this.loggedIn.emit(true);
        this.user.emit(response.data.JwtResponse.user);
        return true;
      }));
  }

  loginAdmin(loginRequestPayload: Loginrequestpayload): Observable<boolean> {
    return this.httpClient.post<Loginresponsepayload>(`${this.adminApiServerUrl}/api/auth/login`, loginRequestPayload)
      .pipe(map(data => {
        this.localStorage.store('authtoken', data.authenticationToken);
        this.localStorage.store('user', data.user);
        this.localStorage.store('refreshtoken', data.refreshToken);
        this.localStorage.store('expiresat', data.expiresAt);
        this.loggedIn.emit(true);
        this.user.emit(data.user);
        return true;
      }));
  }

  getJwtToken():string {
    return this.localStorage.retrieve('authtoken');
  }

  refreshToken() {
    this.refreshTokenRequest.refreshToken = this.getRefreshToken();
    this.refreshTokenRequest.user = this.getUser();
    if (this.getUser().userRoles[0].name == "ROLE_ADMIN") {
      return this.httpClient.post<Loginresponsepayload>(`${this.adminApiServerUrl}/api/auth/refresh/token`, this.refreshTokenRequest)
        .pipe(tap(response => {
          this.localStorage.store('authtoken', response.authenticationToken);
          this.localStorage.store('expiresat', response.expiresAt);
        }))
    }
    if (this.getUser().userRoles[0].name == "ROLE_USER") { }
    return this.httpClient.post<Loginresponsepayload>(`${this.adminApiServerUrl}/api/auth/refresh/token`, this.refreshTokenRequest)
      .pipe(tap(response => {
        this.localStorage.store('authtoken', response.authenticationToken);
        this.localStorage.store('expiresat', response.expiresAt);
      }))
  }

  getRefreshToken(): string {
    return this.localStorage.retrieve('refreshtoken');
  }

  getUser(): Userinfo {
    return this.localStorage.retrieve('user');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occured - Error code: ${error.status}`);
  }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }
  isLoggedInClient$ = of(this.getJwtToken() != null && this.getUser().userRoles[0].name == RoleType.user);
  isLoggedInAdmin$ = of(this.getJwtToken() != null && this.getUser().userRoles[0].name == RoleType.admin);

  // isLoggedInClient$ = of(this.getJwtToken() != null);
  // isLoggedInAdmin$ = of(this.getJwtToken() != null);
  logOutUser$(): Observable<CustomResponse> {
    this.refreshTokenRequest.refreshToken = this.getRefreshToken();
    this.refreshTokenRequest.user = this.getUser();
    let logoutResponse = this.httpClient.post<CustomResponse>(`${this.adminApiServerUrl}/api/auth/logout`, this.refreshTokenRequest);
    this.loggedIn.next(false);
    this.user.next(null);
    return logoutResponse;
  }

  logoutAdmin() {
    this.refreshTokenRequest.refreshToken = this.getRefreshToken();
    this.refreshTokenRequest.user = this.getUser();
    this.httpClient.post(`${this.adminApiServerUrl}/api/auth/logout`, this.refreshTokenRequest)
    this.localStorage.clear('authtoken');
    this.localStorage.clear('user');
    this.localStorage.clear('refreshtoken');
    this.localStorage.clear('expiresat');
  }
}
