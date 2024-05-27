import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { activateWhenCompletedGuard } from './activate-when-completed.guard';

describe('activateWhenCompletedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      activateWhenCompletedGuard(...guardParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
