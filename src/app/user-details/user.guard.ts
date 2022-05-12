import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { GitHupService } from '../shared/git-hup.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private router: Router, private service: GitHupService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const id = +route.paramMap.get('id');

    const data = this.service.getWithExpiry('contributors');
    if (isNaN(id) || id < 1) {
      alert('Invalid route parameter');
      this.router.navigate(['/contributors']);
      return false;
    }
    if (!data) {
      console.log('data ', data);
      alert('An error occured');
      this.router.navigate(['/contributors']);
      return false;
    }
    return true;
  }
}
