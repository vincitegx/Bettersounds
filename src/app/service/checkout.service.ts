import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomResponse } from '../dtos/custom-response';
import { OrderDto } from '../dtos/order-dto';
import { Order } from '../models/order';
import { AuthServiceService } from '../shared/service/auth-service.service';
import { CartServiceService } from '../shared/service/cart-service.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private apiServerUrl = environment.apiBaseUrl;
  

  constructor(private httpClient: HttpClient,
    private authService: AuthServiceService,
    private cartService: CartServiceService) { }

  public placeOrder(order: OrderDto): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(this.apiServerUrl.client + '/api/checkout/purchase', order)
      .pipe(
        map(response => {
          return response;
        })
      )
  }
}
