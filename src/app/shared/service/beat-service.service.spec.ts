import { TestBed } from '@angular/core/testing';

import { BeatServiceService } from './beat-service.service';

describe('BeatServiceService', () => {
  let service: BeatServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeatServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
