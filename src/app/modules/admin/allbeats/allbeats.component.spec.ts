import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllbeatsComponent } from './allbeats.component';

describe('AllbeatsComponent', () => {
  let component: AllbeatsComponent;
  let fixture: ComponentFixture<AllbeatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllbeatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllbeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
