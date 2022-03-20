import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';
import { AppState } from 'src/app/dtos/app-state';
import { CustomResponse } from 'src/app/dtos/custom-response';
import { DataState } from 'src/app/enum/datastate.enum';
import { Beat } from 'src/app/models/beat';
import { CartItem } from 'src/app/models/cart-item';
import { BeatServiceService } from 'src/app/shared/service/beat-service.service';

@Component({
  selector: 'app-viewbeatinfo',
  templateUrl: './viewbeatinfo.component.html',
  styleUrls: ['./viewbeatinfo.component.css']
})
export class ViewbeatinfoComponent implements OnInit {

  public beat$: Array<Beat>=new Array<Beat>();
  public freebeat$: Array<Beat>=new Array<Beat>();
  readonly DataState = DataState;
  public deleteBeat: Beat;
  pages: Array<number>;
  freebeatpages: Array<number>;
  page:number=0;
  sortBy:string;
  beat: Beat;
  cartItem: CartItem ;
  display: Number=0;
  name:string;
  search:string;
  searchForm: FormGroup;
  sortForm: FormGroup;
  property :BehaviorSubject<String>= new BehaviorSubject('Most Recent');
  appState$:Observable<AppState<CustomResponse>>;
  appState1$:Observable<AppState<CustomResponse>>;
  permalink:Number;
  postedDate: Date;
  date:number;

  constructor(private beatService: BeatServiceService,
    private activatedRoute:ActivatedRoute) {
      this.permalink = this.activatedRoute.snapshot.params.id;
   }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      search : new FormControl('', [Validators.required]),
    })
    this.sortForm = new FormGroup({
      sort : new FormControl('', [Validators.required]),
    })
    this.appState$ = this.beatService.getBeat$(this.permalink)
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

  public onDeleteBeat(employeeId: number): void {
    this.beatService.deleteBeat(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        // this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onOpenModal(beat: Beat, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'delete') {
      this.deleteBeat = beat;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container.appendChild(button);
    button.click();
  }
  setPage(i:number,event:any){
    event.preventDefault();
    this.page = i;
    // this.getAllBeats(this.search,this.page,this.sortBy);
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
    let sort ="";
    this.sortBy = event.target.value;
    if(this.sortBy == "name"){
      sort = "A - Z";
    }else if(this.sortBy == "price"){
      sort = "(Price) Low - High";
    }
    else if(this.sortBy == "genre"){
      sort = "Genre";
    }
    else{
      sort = "Most Recent";
    }
    this.property.next(sort);
    // this.getAllBeats(this.search,this.page,this.sortBy);
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
    // this.getAllBeats(this.search,this.page,this.sortBy);
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
