import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeatInfoComponent } from './beat-info.component';

describe('BeatInfoComponent', () => {
  let component: BeatInfoComponent;
  let fixture: ComponentFixture<BeatInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeatInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeatInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
