import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guardStep2Guard } from './guard-step2.guard';

describe('guardStep2Guard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guardStep2Guard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
