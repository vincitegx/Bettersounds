import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeatComponent } from './beat.component';

describe('BeatComponent', () => {
  let component: BeatComponent;
  let fixture: ComponentFixture<BeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
