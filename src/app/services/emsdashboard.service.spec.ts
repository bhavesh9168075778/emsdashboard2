import { TestBed } from '@angular/core/testing';

import { EmsdashboardService } from './emsdashboard.service';

describe('EmsdashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmsdashboardService = TestBed.get(EmsdashboardService);
    expect(service).toBeTruthy();
  });
});
