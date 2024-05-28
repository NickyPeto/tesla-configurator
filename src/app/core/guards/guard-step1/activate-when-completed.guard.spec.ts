import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guardStep1 } from './guard-step1.guard';

describe('activateWhenCompletedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => guardStep1(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
