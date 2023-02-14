import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AppState } from 'src/app/dtos/app-state';
import { CustomResponse } from 'src/app/dtos/custom-response';
import { BeatType } from 'src/app/enum/beattype.enum';
import { DataState } from 'src/app/enum/datastate.enum';
import { Beat } from 'src/app/models/beat';
import { BeatServiceService } from 'src/app/shared/service/beat-service.service';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

@Component({
  selector: 'app-recent-beats',
  templateUrl: './recent-beats.component.html',
  styleUrls: ['./recent-beats.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({opacity:0, transform: 'translateY(-50px)'}),
          stagger('50ms', animate('500ms ease-in',
          style({opacity:1, transform: 'translateY(0px)'})))
        ],{optional:true},),
        query(':leave',[
          animate('500ms',  style({opacity:0, transform: 'rotate(90deg)'}))
        ],{optional:true,})
      ])
    ])
  ]
})
export class RecentBeatsComponent implements OnInit {

  beat$: Array<Beat> = new Array(2);
  readonly DataState = DataState;
  page: number;
  sortBy: string;
  search: string;
  recentBeatState$: Observable<AppState<CustomResponse>>;
  beatType: BeatType;

  constructor(private beatService: BeatServiceService) { 
    this.search = '';
    this.sortBy = "id";
    this.page = 0;
    this.recentBeatState$ = this.beatService.getAllBeats$(this.search, this.page, this.sortBy)
      .pipe(
        map(response => { return { dataState: DataState.LOADED_STATE, appData: response } }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => { return of({ dataState: DataState.ERROR_STATE, error }) })
      );
  }

  ngOnInit(): void {
  }

}
