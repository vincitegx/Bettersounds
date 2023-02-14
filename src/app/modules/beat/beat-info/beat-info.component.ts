import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AppState } from 'src/app/dtos/app-state';
import { CustomResponse } from 'src/app/dtos/custom-response';
import { BeatType } from 'src/app/enum/beattype.enum';
import { DataState } from 'src/app/enum/datastate.enum';
import { Beat } from 'src/app/models/beat';
import { CartItem } from 'src/app/models/cart-item';
import { AuthServiceService } from 'src/app/shared/service/auth-service.service';
import { BeatServiceService } from 'src/app/shared/service/beat-service.service';
import { CartServiceService } from 'src/app/shared/service/cart-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-beat-info',
  templateUrl: './beat-info.component.html',
  styleUrls: ['./beat-info.component.css']
})
export class BeatInfoComponent implements OnInit {

  cartItems: CartItem[];
  cartItem: CartItem;
  readonly DataState = DataState;
  totalItems:number;
  totalPrice:number;
  appState$:Observable<AppState<CustomResponse>>;
  permalink:Number;
  beatType: BeatType;
  beat: Beat;
  postedDate: Date;
  date:number;
  clientApiUrl = environment.apiBaseUrl.client;
  
  constructor(private beatService: BeatServiceService, 
    private authService: AuthServiceService,
    private cartService: CartServiceService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute:ActivatedRoute) { 
      this.permalink = this.activatedRoute.snapshot.params.id;
      this.cartItem = new CartItem();
    }

  ngOnInit(): void {
    this.appState$ = this.beatService.getBeatClient$(this.permalink)
    .pipe(
      map(response=>{
        this.beat = response.data.beat;
        this.postedDate= new Date(this.beat.postedDate);
        this.date = this.postedDate.getDate();
        return {dataState:DataState.LOADED_STATE, appData:response}
      }),
      startWith({dataState:DataState.LOADING_STATE}),
      catchError((error:string)=>{
        return of({dataState:DataState.ERROR_STATE, error})
      })
    );

  }

  public addToCart(beat: Beat, beatType:string): void{
    let addedToCart = false;
    if(beatType == BeatType.mp3){
      this.beatType = beatType;
    }
    if(beatType == BeatType.wav){
      this.beatType = beatType;
    }
    this.cartItem.beatType = this.beatType;
    this.cartItem.beatId = beat.id;
    if(this.cartItem.beatType == BeatType.mp3){
      this.cartItem.price = beat.priceMp3;
    }else{
      this.cartItem.price = beat.priceWav;
    }
    addedToCart = this.cartService.addToCart(this.cartItem);
    if(addedToCart == true){
      this.toastrService.success('Item has Been Added To Cart');
      this.router.navigateByUrl('/cart');
    }else{
      this.toastrService.info('Item has Already Been Added To Cart');
    }    
  }
}
