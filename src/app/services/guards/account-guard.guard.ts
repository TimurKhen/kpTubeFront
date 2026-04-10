import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../user-service/user-service.service';

export const accountGuard: CanActivateFn = (route, state) => {
  const isLogged = inject(UserService).isAuth

  if (isLogged) {
    return true
  }

  return inject(Router).createUrlTree(['/login'])
}
