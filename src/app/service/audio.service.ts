import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StreamState } from '../dtos/streamstate';
import { Beat } from '../models/beat';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private date: Date;
  private stop$ = new Subject();
  private audioObj = new Audio();
  beat: Beat;
  private readonly adminApiServerUrl = environment.apiBaseUrl.admin;
  clientApiServerUrl = environment.apiBaseUrl.client;
  private state: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
  };

  stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(this.state);

  private resetState() {
    this.state = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false
    };
  }

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case "canplay":
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case "playing":
        this.state.playing = true;
        break;
      case "pause":
        this.state.playing = false;
        break;
      case "timeupdate":
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(
          this.state.currentTime
        );
        break;
      case "error":
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  constructor() { }

  audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];

  initializeState(beats: Beat[]) {
    let newbeat = Array<Beat>();
    // let evt: HTMLMediaElement;

    for (this.beat of beats) {
      // evt = new HTMLMediaElement();
      // evt.src = this.clientApiServerUrl+"/"+this.beat.uri;
      this.audioObj.src = this.clientApiServerUrl + "/" + this.beat.uri;
      this.audioObj.load();
      this.beat.streamState.canplay = true;
      this.beat.streamState.playing = false;
      this.beat.streamState.duration = this.audioObj.duration;
      this.beat.streamState.currentTime = this.audioObj.currentTime;
      this.beat.streamState.readableDuration = this.formatTime(this.state.duration);
    }
    newbeat.push(this.beat);
    // return new Observable(observer => {
    //   this.audioObj.src = this.clientApiServerUrl+"/"+this.beat.uri;
    //   this.audioObj.load();
    //   this.audioObj.play();
    //   console.log()
    //   const handler = (event: Event) => {
    //     this.updateStateEvents(event);
    //     observer.next(event);
    //   };

    //   this.addEvents(this.audioObj, this.audioEvents, handler);
    // });
    // let newbeat = Array<Beat>();
    // for(this.beat of beats){
    //   this.audioObj = new Audio();
    //   this.audioObj.src = this.clientApiServerUrl+"/"+this.beat.uri;
    //   this.beat.streamState = {
    //     playing: false,
    //     readableCurrentTime: this.audioObj.currentTime.toString(),
    //     readableDuration: this.audioObj.duration.toString(),
    //     duration: this.audioObj.duration,
    //     currentTime: this.audioObj.currentTime,
    //     canplay: true,
    //     error: false
    //   }; 
    //   newbeat.push(this.beat);
    // }
    return newbeat;
  }

  private streamObservable(url: string) {
    return new Observable(observer => {
      // Play audio
      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        // reset state
        this.resetState();
      };
    });
  }

  private addEvents(obj, events, handler) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj, events, handler) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }

  playStream(url) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play() {
    this.audioObj.play();
  }

  pause() {
    this.audioObj.pause();
  }

  stop() {
    this.stop$.next();
  }

  seekTo(seconds) {
    this.audioObj.currentTime = seconds;
  }

  formatTime(time: number, format: string = "HH:mm:ss") {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }


  formatTimes = (time) => {
    let min: any = Math.floor(time / 60);
    if (min < 10) {
      min = `0${min}`;
    }
    let sec: any = Math.floor(time % 60);
    if (sec < 10) {
      sec = `0${sec}`;
    }
    return `${min} : ${sec}`;
  }
}
