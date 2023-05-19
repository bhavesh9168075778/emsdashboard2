import { TestBed } from '@angular/core/testing';

import { SiteManagerService } from './site-manager.service';

describe('SiteManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SiteManagerService = TestBed.get(SiteManagerService);
    expect(service).toBeTruthy();
  });
});
