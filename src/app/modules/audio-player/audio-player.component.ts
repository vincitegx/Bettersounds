import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Beat } from 'src/app/models/beat';
import { environment } from 'src/environments/environment';
import { faPauseCircle } from '@fortawesome/free-solid-svg-icons';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { faStop } from '@fortawesome/free-solid-svg-icons';
import { AudioService } from 'src/app/service/audio.service';
import { StreamState } from 'src/app/dtos/streamstate';
import { BeatType } from 'src/app/enum/beattype.enum';
import { CartItem } from 'src/app/models/cart-item';
import { CartServiceService } from 'src/app/shared/service/cart-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AudioPlayera } from 'src/app/dtos/audio-player';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {

  @Input() beat: Beat;
  adminApiUrl = environment.apiBaseUrl.admin;
  fileurl:string = this.adminApiUrl+"/api/beat/download"
  audio: AudioBuffer;
  cartItem: CartItem;
  beatType: BeatType;
  private ctx: AudioContext;
  currentTime: number;
  duration: number;
  currentTimeText: string;
  durationText: string;
  secs: number;
  mins: number;
  state: StreamState;
  musicPlayPauseIcon: any;
  musicStopIcon: any;
  private streamState: BehaviorSubject<StreamState>;
  streamState$: Observable<StreamState>;
  playSound: AudioBufferSourceNode;
  isPlaying: boolean;
  audioPlayer : AudioPlayera;
  cartItems: CartItem[];
  constructor(private audioService: AudioService, private router: Router,
    private cartService: CartServiceService,
    private toastrService: ToastrService) {
    AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContext();
    this.currentTime = 0;
    this.currentTimeText = "0:00";
    this.audioService.getState().subscribe(state => { this.state = state;});
    this.streamState = new BehaviorSubject(this.state);
    this.streamState$ = this.streamState.asObservable();
    this.cartItem = new CartItem();
    this.isPlaying = false;
    this.musicPlayPauseIcon = faPlayCircle;
    this.musicStopIcon = faStop;
  }

  ngOnInit() {
    this.initializeBeatAudio();
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
    this.streamState.next(this.state);
  }

  ifMusicIsNotPlaying(){
    this.audioService.getState().subscribe((state)=>{
      this.streamState.next(state);
      this.isPlaying = state.playing;
    });
    if(this.isPlaying){
      this.audioService.pause();
    }else if(!this.isPlaying && this.currentTime !== 0){
      this.audioService.play(); 
      this.streamState.next(this.state);
    }else{}
  }

  setClass(beat:Beat){
    let myClass={
      active: this.state.playing,
      disabled: !this.state.playing
    }
    return myClass;
  }

  initializeBeatAudio() {
    fetch(this.fileurl+"/"+this.beat.uri)
      .then(data => data.arrayBuffer())
      .then(arrayBuffer => this.ctx.decodeAudioData(arrayBuffer))
      .then(decodedAudio => {
        this.audio = decodedAudio;
        this.duration = this.audio.duration;
        this.secs = parseInt(`${(this.duration % 60)}`, 10);
        this.mins = parseInt(`${(this.duration / 60) % 60}`, 10);
        this.durationText = `${this.mins}:${this.secs}`;
        this.musicPlayPauseIcon = faPlayCircle;
        this.playSound = this.ctx.createBufferSource();
        this.playSound.buffer = this.audio;
        this.playSound.connect(this.ctx.destination);
      });
  }

  playBeat(beat: Beat) {
    
    this.audioService.getState().subscribe((state)=>{
      this.streamState.next(state);
      this.isPlaying = state.playing;
    });
    if(this.isPlaying){
      this.audioService.pause();
      this.streamState.next(this.state);
    }else if(!this.isPlaying && this.currentTime !== 0){
      this.audioService.play(); 
      this.streamState.next(this.state);
    }else{
      this.audioService.playStream(beat.uri).subscribe(
        () => {
          this.currentTime = this.state.currentTime;
          this.duration = this.state.duration;
          this.currentTimeText = this.audioService.formatTimes(this.state.currentTime);
          this.musicPlayPauseIcon = faPauseCircle;
          this.streamState.next(this.state);
          if (this.currentTime == this.duration) {
            this.audioService.stop();
            this.currentTime = this.state.currentTime;
            this.duration = this.state.duration;
            this.currentTimeText = this.audioService.formatTimes(this.state.currentTime);
            this.musicPlayPauseIcon = faPlayCircle;
          }
        }
      );
    }    
  }

  stopBeat(beat: Beat){
    this.audioService.stop();
    this.musicPlayPauseIcon = faPlayCircle;
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.audioService.getState().subscribe((state)=>{
      this.state.playing = this.isPlaying;
      this.state.currentTime =0;
      this.streamState.next(this.state);
    });
    // let bn: AudioBufferSourceNode = this.playSound;
    // bn.stop();
    this.playSound.stop();
  }

  addToCart(beat: Beat, beatType: string): void {
    let addedToCart = false;
    if (beatType == BeatType.mp3) {
      this.beatType = beatType;
    }
    if (beatType == BeatType.wav) {
      this.beatType = beatType;
    }
    this.cartItem.beatType = this.beatType;
    this.cartItem.beatId = beat.id;
    // this.cartItem.beat = beat;
    if(this.cartItem.beatType == BeatType.mp3){
      this.cartItem.price = beat.priceMp3;
    }else{
      this.cartItem.price = beat.priceWav;
    }
    
    addedToCart = this.cartService.addToCart(this.cartItem);
    if (addedToCart == true) {
      this.cartItems = this.cartService.cartItems;
      this.toastrService.success('Item has Been Added To Cart');
      this.router.navigateByUrl('/cart');
    } else {
      this.toastrService.info('Item has Already Been Added To Cart');
    }
  }

}
