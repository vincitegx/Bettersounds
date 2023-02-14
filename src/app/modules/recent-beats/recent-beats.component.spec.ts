import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentBeatsComponent } from './recent-beats.component';

describe('RecentBeatsComponent', () => {
  let component: RecentBeatsComponent;
  let fixture: ComponentFixture<RecentBeatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentBeatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentBeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
