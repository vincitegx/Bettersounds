import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AppState } from 'src/app/dtos/app-state';
import { CustomResponse } from 'src/app/dtos/custom-response';
import { OrderDto } from 'src/app/dtos/order-dto';
import { DataState } from 'src/app/enum/datastate.enum';
import { Beat } from 'src/app/models/beat';
import { CartItem } from 'src/app/models/cart-item';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/service/order.service';
import { BeatServiceService } from 'src/app/shared/service/beat-service.service';
import { environment } from 'src/environments/environment';
// declare var $;

@Component({
  selector: 'app-allbeats',
  templateUrl: './allbeats.component.html',
  styleUrls: ['./allbeats.component.css']
})
export class AllbeatsComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  adminApiUrl = environment.apiBaseUrl.admin;
  // @ViewChild('dataTable', {static: false}) table: any;
  // dataTable: any;
  public beat$: Array<Beat>=new Array<Beat>();
  public freebeat$: Array<Beat>=new Array<Beat>();
  orders: Array<Order> =new Array<Order>();
  readonly DataState = DataState;
  public deleteBeat: Beat;
  pages: Array<number>;
  freebeatpages: Array<number>;
  page:number=0;
  sortBy:string;
  cartItem: CartItem ;
  display: Number=0;
  name:string;
  search:string;
  searchForm: FormGroup;
  sortForm: FormGroup;
  property :BehaviorSubject<String>= new BehaviorSubject('Most Recent');
  appState$:Observable<AppState<CustomResponse>>;
  appState1$:Observable<AppState<CustomResponse>>;
  constructor(private beatService: BeatServiceService,
    private orderService: OrderService,
    private toastr: ToastrService) {
    this.search = '';
    this.sortBy = "id";
   }
  ngOnInit(): void {
    this.orderService.getAllOrders$(0,this.sortBy).subscribe(
      (response)=>{
        this.orders  = response.data.orders['content'];
      }
    );
    this.searchForm = new FormGroup({
      search : new FormControl('', [Validators.required]),
    })
    this.sortForm = new FormGroup({
      sort : new FormControl('', [Validators.required]),
    })
    
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

  public onDeleteBeat(employeeId: number): void {
    this.beatService.deleteBeat(employeeId).subscribe(
      (response: void) => {
        this.toastr.success('Beat Deleted Successfully !!!');
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
