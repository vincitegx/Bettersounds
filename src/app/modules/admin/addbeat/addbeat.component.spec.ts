import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbeatComponent } from './addbeat.component';

describe('AddbeatComponent', () => {
  let component: AddbeatComponent;
  let fixture: ComponentFixture<AddbeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddbeatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
