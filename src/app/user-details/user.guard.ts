import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const id = +route.paramMap.get('id');
    const data = JSON.parse(localStorage.getItem('contributors'));
    if (isNaN(id) || id < 1) {
      alert('Invalid route parameter');
      this.router.navigate(['/contributors']);
      return false;
    }
    if (!data) {
      console.log('data ', data);

      alert('No data Found');
      this.router.navigate(['/contributors']);
      return false;
    }
    return true;
  }
}
