import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeBeatsComponent } from './free-beats.component';

describe('FreeBeatsComponent', () => {
  let component: FreeBeatsComponent;
  let fixture: ComponentFixture<FreeBeatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeBeatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeBeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
