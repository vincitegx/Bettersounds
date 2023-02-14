import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomResponse } from '../dtos/custom-response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly adminApiServerUrl = environment.apiBaseUrl.admin;

  constructor(private httpClient: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occured - Error code: ${error.status}`);
  }

  getAllOrders$ = (page:number, sortBy:string) =>
    <Observable<CustomResponse>>
    this.httpClient.get<CustomResponse>(`${this.adminApiServerUrl}/api/orders/all?page=${page}&sortBy=${sortBy}`)
      .pipe(
        tap(),
        catchError(this.handleError)
      );

}
