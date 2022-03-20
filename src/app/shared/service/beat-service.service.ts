import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { CustomResponse } from 'src/app/dtos/custom-response';

@Injectable({
  providedIn: 'root'
})
export class BeatServiceService {

  property: BehaviorSubject<String>;
  private readonly adminApiServerUrl = environment.apiBaseUrl.admin;
  private readonly clientApiServerUrl = environment.apiBaseUrl.client;

  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.property = new BehaviorSubject('Most Recent');
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occured - Error code: ${error.status}`);
  }

  getAllBeats$ = (name:string, page:number, sortBy:string) =>
    <Observable<CustomResponse>>
    this.httpClient.get<CustomResponse>(`${this.adminApiServerUrl}/api/beat/all?search=${name}&page=${page}&sortBy=${sortBy}`)
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  getAllBeatsClient$ = (name:string, page:number, sortBy:string) =>
    <Observable<CustomResponse>>
    this.httpClient.get<CustomResponse>(`${this.clientApiServerUrl}/api/beat/all?search=${name}&page=${page}&sortBy=${sortBy}`)
      .pipe(
        tap(),
        catchError(this.handleError)
      );

      getAllFreeBeats$ = (name:string, page:number, sortBy:string) =>
    <Observable<CustomResponse>>
    this.httpClient.get<CustomResponse>(`${this.adminApiServerUrl}/api/beat/allfree?name=${name}&page=${page}&sortBy=${sortBy}`)
      .pipe(
        tap(),
        catchError(this.handleError)
      );
      getAllFreeBeatsClient$ = (name:string, page:number, sortBy:string) =>
    <Observable<CustomResponse>>
    this.httpClient.get<CustomResponse>(`${this.clientApiServerUrl}/api/beat/allfree?name=${name}&page=${page}&sortBy=${sortBy}`)
      .pipe(
        tap(),
        catchError(this.handleError)
      );

      getAllBeatsGenre$ = <Observable<CustomResponse>>
    this.httpClient.get<CustomResponse>(`${this.adminApiServerUrl}/api/beat/allgenres`)
      .pipe(
        tap(),
        catchError(this.handleError)
      );

      getBeat$ = (id: Number) => <Observable<CustomResponse>> 
        this.httpClient.get<CustomResponse>(`${this.adminApiServerUrl}/api/beat/${id}`)
        .pipe(catchError(this.handleError));
      getBeatClient$ = (id: Number) => <Observable<CustomResponse>> 
        this.httpClient.get<CustomResponse>(`${this.clientApiServerUrl}/api/beat/${id}`)
        .pipe(catchError(this.handleError));

  public getAllBeatsGenre() {
    return this.httpClient.get<CustomResponse>(`${this.adminApiServerUrl}/api/beat/allgenres`);
  }
  getAllBeatsMood$ = <Observable<CustomResponse>>
  this.httpClient.get<CustomResponse>(`${this.adminApiServerUrl}/api/beat/allmoods`)
    .pipe(catchError(this.handleError));
  public getAllBeatsMood() {
    return this.httpClient.get<CustomResponse>(`${this.adminApiServerUrl}/api/beat/allmoods`);
  }
  getAllBeatsKey$ = <Observable<CustomResponse>>
  this.httpClient.get<CustomResponse>(`${this.adminApiServerUrl}/api/beat/allkeys`)
    .pipe(catchError(this.handleError));
  public getAllBeatsKey() {
    return this.httpClient.get<CustomResponse>(`${this.adminApiServerUrl}/api/beat/allkeys`);
  }
  uploadBeat(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.adminApiServerUrl}/api/beat/single/upload`, formData);
  }
  updateBeat(formData: FormData): Observable<any> {
    return this.httpClient.put(`${this.adminApiServerUrl}/api/beat/edit`, formData);
  }
  deleteBeat(beatId:number):Observable<any>{
    return this.httpClient.delete(`${this.adminApiServerUrl}/api/beat/delete/${beatId}`);
  }
  save$ = (formData: FormData) => <Observable<CustomResponse>>
  this.httpClient.post(`${this.adminApiServerUrl}/api/beat/single/upload`, formData)
  .pipe(catchError(this.handleError));
}