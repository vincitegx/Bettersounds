import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AppState } from 'src/app/dtos/app-state';
import { CustomResponse } from 'src/app/dtos/custom-response';
import { DataState } from 'src/app/enum/datastate.enum';
import { Beat } from 'src/app/models/beat';
import { BeatServiceService } from 'src/app/shared/service/beat-service.service';

@Component({
  selector: 'app-free-beats',
  templateUrl: './free-beats.component.html',
  styleUrls: ['./free-beats.component.css']
})
export class FreeBeatsComponent implements OnInit {

  readonly DataState = DataState;
  page: number;
  sortBy: string;
  search: string;
  freeBeatState$: Observable<AppState<CustomResponse>>;

  constructor(private beatService: BeatServiceService) { 
    this.search = '';
    this.sortBy = "id";
    this.page = 0;
    this.freeBeatState$ = this.beatService.getAllFreeBeatsClient$(this.search, this.page, this.sortBy)
      .pipe(
        map(response => { return { dataState: DataState.LOADED_STATE, appData: response } }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => { return of({ dataState: DataState.ERROR_STATE, error }) })
      );
  }

  ngOnInit(): void {
  }

}
