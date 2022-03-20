import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbeatinfoComponent } from './viewbeatinfo.component';

describe('ViewbeatinfoComponent', () => {
  let component: ViewbeatinfoComponent;
  let fixture: ComponentFixture<ViewbeatinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewbeatinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewbeatinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
