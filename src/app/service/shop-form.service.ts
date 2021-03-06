import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesUrl = "http://localhost:8080/api/country/all";
  private statesUrl = "http://localhost:8080/api/states";


  private apiServerUrl= environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) { }

   getCreditCardMonths(startMonth: number): Observable<number[]>{

    let data: number[] = [];
    // build an array for "Month" dropdown list
    // start at start month and loop until
    for(let theMonth=startMonth; theMonth <=12; theMonth++){
      data.push(theMonth);
    }
    return of(data);
   }

   getCreditCardYears(): Observable<number[]>{
    let data: number[] = [];
    // build an array for "Month" dropdown list
    // start at start month and loop for next 10 years
    let startYear: number = new Date().getFullYear();
    let endYear: number = startYear + 10;
    for(let theYear=startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }
    return of(data);
   }


  
   
}
