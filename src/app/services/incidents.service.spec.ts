import { TestBed } from '@angular/core/testing';

import { IncidentsService } from './services/incidents.service';

describe('IncidentsService', () => {
  let service: IncidentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
