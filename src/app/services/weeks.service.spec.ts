import { TestBed, inject } from '@angular/core/testing';

import { WeeksService } from './weeks.service';

describe('WeeksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeeksService]
    });
  });

  it('should be created', inject([WeeksService], (service: WeeksService) => {
    expect(service).toBeTruthy();
  }));
});
