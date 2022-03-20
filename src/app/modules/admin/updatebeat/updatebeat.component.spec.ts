import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatebeatComponent } from './updatebeat.component';

describe('UpdatebeatComponent', () => {
  let component: UpdatebeatComponent;
  let fixture: ComponentFixture<UpdatebeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatebeatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatebeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
