import { HttpErrorResponse } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { BeatDto } from 'src/app/dtos/beat-dto';
import { Beat } from 'src/app/models/beat';
import { BeatServiceService } from 'src/app/shared/service/beat-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public beat$: Beat[];
  display: Number=0;
  name:string;
  page:number=0;
  sortBy:string;

  // public getAllBeats():void{
  //   this.beatService.getAllBeats(this.name,this.page,this.sortBy).subscribe(
  //     (response: Beat[])=>{
  //       this.beat$ = response;
  //     },
  //     (error: HttpErrorResponse)=>{
  //       alert("Unable To Connect To Server, Please Try Again !!!");
  //     }
  //   );
  // }

  currentMusic:number;
  music:any; 

  seekBar:any;
  songName:any;
  artistName:any;
  disk:any;
  currentTime:any;
  musicDuration:any;
  playBtn:any;
  min:any;
  sec:any;

  constructor(private beatService: BeatServiceService) {
    this.currentMusic =0;
    this.music = document.querySelector('#audio');
    this.seekBar = document.querySelector('.seek-bar');
    this.songName = document.querySelector('.music-name');
    this.artistName = document.querySelector('.artist-name');
    this.disk = document.querySelector('.disk');
    this.currentTime = document.querySelector('.current-time');
    this.musicDuration = document.querySelector('.song-duration');
    this.playBtn = document.querySelector('.play-btn');
   }

  ngOnInit(): void {
    this.setMusic(0);
    // this.getAllBeats();
  }

  setMusic = (i) => {
    this.seekBar.value = 0; // set range slide value to 0;
    let song = {
      path:'../../../assets/img/Rema-Lady.mp3',
      name:'Oh La La',
      artist:'David Tega',
      cover:'../../../assets/img/Music_75px.png',
      duration:'3.34'
    };
    this.currentMusic = i;
    this.music.src = song.path;

    this.songName.innerHTML = song.name;
    this.artistName.innerHTML = song.artist;
    this.disk.style.backgroundImage = `url('${song.cover}')`;

    this.currentTime.innerHTML = '00:00';
    setTimeout(() => {
      this.seekBar.max = this.music.duration;
      this.musicDuration.innerHTML = this.formatTime(this.music.duration);
    }, 300);
}
formatTime = (time) => {
  this.min = Math.floor(time / 60);
  if(this.min < 10){
      this.min = `0${this.min}`;
  }
  this.sec = Math.floor(time % 60);
  if(this.sec < 10){
      this.sec = `0${this.sec}`;
  }
  return `${this.min} : ${this.sec}`;
}

}
