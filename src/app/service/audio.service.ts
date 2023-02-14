import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Beat } from '../models/beat';
import { StreamState } from '../models/stream-state';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  clientApiUrl = environment.apiBaseUrl.client;
  setState(streamState: StreamState){
    this.state = streamState;
  }

  private stop$ = new Subject();
  private audioObj = new Audio();
  beat: Beat;
  playing: boolean = false;
  paused: boolean = false;
  readableCurrentTime: string = '';
  readableDuration: string = '';
  durationText: string;
  duration: number = 0;
  currentTime: number = 0;
  canplay: boolean = false;
  error: boolean = false;
  audio: AudioBuffer;
  musicPlayPauseIcon: any;
  musicStopIcon: any;
  playSound: AudioBufferSourceNode;
  ctx: AudioContext;
  private readonly adminApiServerUrl = environment.apiBaseUrl.admin;
  private state: StreamState = {
    playing: false,
    paused: false,
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
      paused: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false,
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

  constructor() {
    AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContext();
    // this.state.setAudio(this.beat);
  }

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
    this.resetState();
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
      min = `${min}`;
    }
    let sec: any = Math.floor(time % 60);
    if (sec < 10) {
      sec = `0${sec}`;
    }
    return `${min}:${sec}`;
  }
}
