import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith, take } from 'rxjs/operators';
import { AppState } from 'src/app/dtos/app-state';
import { CustomResponse } from 'src/app/dtos/custom-response';
import { BeatType } from 'src/app/enum/beattype.enum';
import { DataState } from 'src/app/enum/datastate.enum';
import { Beat } from 'src/app/models/beat';
import { CartItem } from 'src/app/models/cart-item';
import { StreamState } from 'src/app/models/stream-state';
import { AudioService } from 'src/app/service/audio.service';
import { BeatServiceService } from 'src/app/shared/service/beat-service.service';
import { CartServiceService } from 'src/app/shared/service/cart-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home2',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public beat$: Array<Beat>;
  public freebeat$: Array<Beat>;
  readonly DataState = DataState;
  clientApiUrl = environment.apiBaseUrl.client;
  page: number;
  sortBy: string;
  cartItem: CartItem;
  name: string;
  search: string;
  property: BehaviorSubject<String> = new BehaviorSubject('Most Recent');
  appState$: Observable<AppState<CustomResponse>>;
  appState1$: Observable<AppState<CustomResponse>>;
  beatType: BeatType;
  playing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  playing$ = this.playing.asObservable();
  files: Array<any> = [];
  state :StreamState;
  state$ = this.audioService.getState();
  currentFile: any = {};
  currentTime: BehaviorSubject<string> = new BehaviorSubject<string>('00.00');
  currentTime$ = this.currentTime.asObservable();
  playingBeat: Beat;

  constructor(private beatService: BeatServiceService,
    private cartService: CartServiceService,
    private toastrService: ToastrService,
    private router: Router, private audioService: AudioService) {
    this.cartItem = new CartItem();
    this.search = '';
    this.sortBy = "id";
    this.page = 0;
    this.audioService.getState().subscribe(state => {
      this.state = state;
    });
  }

  ngOnInit(): void {
    this.appState$ = this.beatService.getAllBeatsClient$(this.search, this.page, this.sortBy)
      .pipe(
        map(response => {
          // console.log(this.audioService.initializeState(response.data.beats['content']));
          return { dataState: DataState.LOADED_STATE, appData: response }
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
    this.appState1$ = this.beatService.getAllFreeBeatsClient$(this.search, this.page, this.sortBy)
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED_STATE, appData: response }
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
        
      this.audioService.getState().subscribe(state => {
        this.state = state;
      }); 
  }

  playStream(url) {
    this.audioService.playStream(url).subscribe(events => {
      this.playing.next(true);
    });
  }
  pause() {
    this.audioService.pause();
  }
  play() {
    this.audioService.play();
  }
  stop() {
    this.audioService.stop();
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }

  public addToCart(beat: Beat, beatType: string): void {
    let addedToCart = false;
    if (beatType == BeatType.mp3) {
      this.beatType = beatType;
    }
    if (beatType == BeatType.wav) {
      this.beatType = beatType;
    }
    this.cartItem.beatType = this.beatType;
    this.cartItem.beat = beat;
    addedToCart = this.cartService.addToCart(this.cartItem);
    if (addedToCart == true) {
      this.toastrService.success('Item has Been Added To Cart');
      this.router.navigateByUrl('/cart');
    } else {
      this.toastrService.info('Item has Already Been Added To Cart');
    }
  }
}
