import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { CarConfigService } from '../../car-config.service';

export const guardStep1: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const carService = inject(CarConfigService);

  if (
    !carService.selectedCar().model ||
    carService.selectedCar().model.code === '' ||
    !carService.selectedCar().color
  ) {
    router.navigate(['/step/1']);
    return false;
  } else if (state.url.startsWith('/step/3')) {
    router.navigate(['/step/1']);
    return false;
  }

  // Allow navigation if conditions are not met
  return true;
};
