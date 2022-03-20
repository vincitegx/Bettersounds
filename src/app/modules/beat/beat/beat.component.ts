import { Component, OnInit } from '@angular/core';
import { BeatServiceService } from 'src/app/shared/service/beat-service.service';
import { CartServiceService } from 'src/app/shared/service/cart-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/models/cart-item';
import { Beat } from 'src/app/models/beat';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AppState } from 'src/app/dtos/app-state';
import { CustomResponse } from 'src/app/dtos/custom-response';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/enum/datastate.enum';
import { BeatType } from 'src/app/enum/beattype.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-beat',
  templateUrl: './beat.component.html',
  styleUrls: ['./beat.component.css']
})
export class BeatComponent implements OnInit {

  public beat$: Array<Beat>;
  readonly DataState = DataState;
  pages: Array<number>;
  page:number=0;
  sortBy:string;
  cartItem: CartItem;
  display: Number=0;
  name:string;
  search:string;
  searchForm: FormGroup;
  sortForm: FormGroup;
  property :BehaviorSubject<String>= new BehaviorSubject('Most Recent');
  appState$:Observable<AppState<CustomResponse>>;
  showDatalist:boolean;
  beatType:BeatType;
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ =  this.filterSubject.asObservable();
  clientApiUrl = environment.apiBaseUrl.client;

  ngOnInit() {
    this.searchForm = new FormGroup({
      search : new FormControl('', [Validators.required]),
    })
    this.sortForm = new FormGroup({
      sort : new FormControl('', [Validators.required]),
    })
    this.appState$ = this.beatService.getAllBeatsClient$(this.search,this.page, this.sortBy)
    .pipe(
      map(response=>{
        this.dataSubject.next(response);
        this.pages = new Array(response.data.beats['totalPages']);
        return {dataState:DataState.LOADED_STATE, appData:response}
      }),
      startWith({dataState:DataState.LOADING_STATE}),
      catchError((error:string)=>{
        return of({dataState:DataState.ERROR_STATE, error})
      })
    );
  }
  constructor(private beatService: BeatServiceService, 
    private cartService: CartServiceService,
    private toastrService: ToastrService,
    private router: Router) {
      this.cartItem = new CartItem();
      this.search = '';
      this.sortBy = "id";
    }

  items$ = this.cartService.items$;

  public addToCart(beat: Beat, beatType:string): void{
    let addedToCart = false;
    if(beatType == BeatType.mp3){
      this.beatType = beatType;
    }
    if(beatType == BeatType.wav){
      this.beatType = beatType;
    }
    this.cartItem.beatType = this.beatType;
    this.cartItem.beat = beat;
    addedToCart = this.cartService.addToCart(this.cartItem);
    if(addedToCart == true){
      this.toastrService.success('Item has Been Added To Cart');
      this.router.navigateByUrl('/cart');
    }else{
      this.toastrService.info('Item has Already Been Added To Cart');
    }    
  }

  setPage(i:number,event:any){
    event.preventDefault();
    this.page = i;
    this.appState$ = this.beatService.getAllBeats$(this.search,this.page, this.sortBy)
    .pipe(
      map(response=>{
        this.pages = new Array(response.data.beats['totalPages']);
        return {dataState:DataState.LOADED_STATE, appData:response}
      }),
      startWith({dataState:DataState.LOADING_STATE}),
      catchError((error:string)=>{
        return of({dataState:DataState.ERROR_STATE, error})
      })
    );
  }
  setSort(event:any){
    event.preventDefault();
    this.search = this.searchForm.get('search').value;
    let sort ="";
    this.sortBy = event.target.value;
    if(this.sortBy == "name"){
      sort = "A - Z";
    }else if(this.sortBy == "priceMp3"){
      sort = "(Price) High - Low";
    }
    else if(this.sortBy == "genre"){
      sort = "Genre";
    }
    else{
      sort = "Most Recent";
    }
    this.property.next(sort);
    this.appState$ = this.beatService.getAllBeats$(this.search,this.page, this.sortBy)
    .pipe(
      map(response=>{
        this.pages = new Array(response.data.beats['totalPages']);
        return {dataState:DataState.LOADED_STATE, appData:response}
      }),
      startWith({dataState:DataState.LOADING_STATE}),
      catchError((error:string)=>{
        return of({dataState:DataState.ERROR_STATE, error})
      })
    );
  }
  setSearch(event:any){
    event.preventDefault();
    this.search = this.searchForm.get('search').value;
    this.appState$ = this.beatService.getAllBeats$(this.search,this.page, this.sortBy)
    .pipe(
      map(response=>{
        this.pages = new Array(response.data.beats['totalPages']);
        return {dataState:DataState.LOADED_STATE, appData:response}
      }),
      startWith({dataState:DataState.LOADING_STATE}),
      catchError((error:string)=>{
        return of({dataState:DataState.ERROR_STATE, error})
      })
    );
  }
}
