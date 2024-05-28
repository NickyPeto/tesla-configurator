import { CanActivateFn, Router } from '@angular/router';
import { CarConfigService } from '../../car-config.service';
import { inject } from '@angular/core';

export const guardStep2Guard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const carService = inject(CarConfigService);

  console.log(state.url, router.routerState.snapshot.url);

  if (carService.selectedCar().config.description === '') {
    router.navigate(['/step/2']);
    return false;
  } else if (
    router.routerState.snapshot.url === '/step/1' &&
    state.url === '/step/3'
  ) {
    router.navigate(['/step/1']);
    return false;
  }

  // Allow navigation if conditions are not met
  return true;
};
