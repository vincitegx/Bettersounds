import { HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, pipe, throwError } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AppState } from 'src/app/dtos/app-state';
import { BeatDto } from 'src/app/dtos/beat-dto';
import { CustomResponse } from 'src/app/dtos/custom-response';
import { DataState } from 'src/app/enum/datastate.enum';
import { Beat } from 'src/app/models/beat';
import { BeatKey } from 'src/app/models/beat-key';
import { Genre } from 'src/app/models/genre';
import { Mood } from 'src/app/models/mood';
import { AuthServiceService } from 'src/app/shared/service/auth-service.service';
import { BeatServiceService } from 'src/app/shared/service/beat-service.service';

@Component({
  selector: 'app-addbeat',
  templateUrl: './addbeat.component.html',
  styleUrls: ['./addbeat.component.css']
})
export class AddbeatComponent implements OnInit {

  beat: Beat;
  addBeatForm: FormGroup;
  public moods: Array<Mood>;
  public beatKeys: Array<BeatKey>;
  public genres: Array<Genre>;
  public artWork: any = File;
  public taggedmp3: any = File;
  public untaggedmp3: any = File;
  public untaggedwav: any = File;
  public id: number;
  public defaultSelectedGenre: number;
  public defaultSelectedBeatKey: number;
  public defaultSelectedMood: number;
  genreState$:Observable<AppState<CustomResponse>>;
  beatKeyState$:Observable<AppState<CustomResponse>>;
  beatMoodState$:Observable<AppState<CustomResponse>>;

  constructor(private authService : AuthServiceService, 
    private router : Router, private toastr: ToastrService,
    private beatService: BeatServiceService) {
    this.beat = {
      name : '',
      priceMp3 : 0,
      priceWav : 0,
      tempo : 0,
      description: '',
      beatKey: {
        id: null,
        name: ''
      },
      mood: {
        id: null,
        name: ''
      },
      genre: {
        id: null,
        name: ''
      }
    };
   }

  ngOnInit(){
    this.getGenre();
    this.getBeatKey();
    this.getMood();
    this.defaultSelectedGenre = 1;
    this.defaultSelectedBeatKey = 1;
    this.defaultSelectedMood = 1;
    this.genreState$ = this.beatService.getAllBeatsGenre$
    .pipe(
      map(response=>{
        return {dataState:DataState.LOADED_STATE, appData:response}
      }),
      startWith({dataState:DataState.LOADING_STATE}),
      catchError((error:string)=>{
        return of({dataState:DataState.ERROR_STATE, error})
      })
    );
    this.beatKeyState$ = this.beatService.getAllBeatsKey$
    .pipe(
      map(response=>{
        return {dataState:DataState.LOADED_STATE, appData:response}
      }),
      startWith({dataState:DataState.LOADING_STATE}),
      catchError((error:string)=>{
        return of({dataState:DataState.ERROR_STATE, error})
      })
    );
    this.beatMoodState$ = this.beatService.getAllBeatsMood$
    .pipe(
      map(response=>{
        return {dataState:DataState.LOADED_STATE, appData:response}
      }),
      startWith({dataState:DataState.LOADING_STATE}),
      catchError((error:string)=>{
        return of({dataState:DataState.ERROR_STATE, error})
      })
    );
    this.addBeatForm = new FormGroup({
      name : new FormControl('', Validators.required),
      priceMp3 : new FormControl('', [Validators.required]),
      priceWav : new FormControl('', [Validators.required]),
      tempo : new FormControl('', [Validators.required]),
      description : new FormControl('', [Validators.required]),
      beatKey : new FormControl('', [Validators.required]),
      mood : new FormControl('', [Validators.required]),
      genre : new FormControl('', [Validators.required]),
      file : new FormControl('', [Validators.required]),
      artWork : new FormControl('', [Validators.required]),
      taggedmp3 : new FormControl('', [Validators.required]),
      untaggedmp3 : new FormControl('', [Validators.required]),
      untaggedwav : new FormControl('', [Validators.required]),
    });
    
  }

  onSelectArtWork(e){
    const artWork = e.target.files[0];
    this.artWork = artWork;
  }

  onSelectTaggedMp3(e){
    const taggedmp3 = e.target.files[0];
    this.taggedmp3 = taggedmp3;
  }

  onSelectUntaggedMp3(e){
    const untaggedmp3 = e.target.files[0];
    this.untaggedmp3 = untaggedmp3;
  }

  onSelectUntaggedWav(e){
    const untaggedwav = e.target.files[0];
    this.untaggedwav = untaggedwav;
  }

  public saveForm(){
    this.beat.name = this.addBeatForm.get('name').value;
    this.beat.priceMp3 = this.addBeatForm.get('priceMp3').value;
    this.beat.priceWav = this.addBeatForm.get('priceWav').value;
    this.beat.tempo = this.addBeatForm.get('tempo').value;
    this.beat.description = this.addBeatForm.get('description').value;
    this.beat.beatKey = {id:this.addBeatForm.get('beatKey').value};
    this.beat.mood = {id:this.addBeatForm.get('mood').value};
    this.beat.genre ={id:this.addBeatForm.get('genre').value};
    this.beat.mainCreator='David Tega';
      const formData = new FormData();
      formData.append('beatDto', JSON.stringify(this.beat));
      formData.append('artWork', this.artWork);
      formData.append('taggedmp3', this.taggedmp3);
      formData.append('untaggedmp3', this.untaggedmp3);
      formData.append('untaggedwav', this.untaggedwav);
      this.beatService.uploadBeat(formData)
      .subscribe(
        (response)=>{
          this.toastr.success('Upload Successful !!!');
          this.router.navigateByUrl('admindashboard/allbeats');
        }
      );
  }

  public getGenre():void{
    this.beatService.getAllBeatsGenre().subscribe(
      (data)=>{
        if(data){
          this.genres = data.data.genres;
        }
      },(error: HttpErrorResponse)=>{
        alert("Unable To Connect To Server, Please Try Again !!!");
      }
    );
  }

  public getBeatKey(): void{
    this.beatService.getAllBeatsKey().subscribe((data)=>{
      if(data){
        this.beatKeys = data.data.beatKeys;
      }
    },(error: HttpErrorResponse)=>{
      alert("Unable To Connect To Server, Please Try Again !!!");
    }
    );
  }
  public getMood(): void{
    this.beatService.getAllBeatsMood().subscribe((data)=>{
      if(data){
        this.moods = data.data.moods;
      }
    },(error: HttpErrorResponse)=>{
      alert("Unable To Connect To Server, Please Try Again !!!");
    }
      );
  }
  
}
