import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { CarConfigService } from '../car-config.service';
import { ProtectedRouteConfig } from '../../models/guards.model';

export const activateWhenCompletedGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const carService = inject(CarConfigService);
  const protectedRoutes: ProtectedRouteConfig[] = [
    {
      route: '/step/2',
      canActivateRouteConfig:
        carService.selectedCar().model === '' ||
        !carService.selectedCar().color,
    },
    {
      route: '/step/3',
      canActivateRouteConfig:
        carService.selectedCar().config.description === '',
    },
  ];

  // Iterate over protectedRoutes to find a matching route and check its condition
  for (const protectedRoute of protectedRoutes) {
    if (state.url.startsWith(protectedRoute.route)) {
      if (
        protectedRoute.route === '/step/2' &&
        protectedRoute.canActivateRouteConfig
      ) {
        router.navigate(['/']);
        return false;
      }
      if (
        protectedRoute.route === '/step/3' &&
        protectedRoute.canActivateRouteConfig
      ) {
        router.navigate(['/2']);
        return false;
      }
    }
  }

  // If no conditions match, allow access
  return true;
};
