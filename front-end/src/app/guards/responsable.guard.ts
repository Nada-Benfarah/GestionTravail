import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalService } from '../global.service';

@Injectable({
  providedIn: 'root',
})
export class ResponsableGuard implements CanActivate {
  constructor(public gs: GlobalService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.gs.getUser().pipe(
      map((user) => {
        if (user && (user.role === 'responsable' || user.role === 'admin')) {
          return true;
        } else {
          this.gs.router.navigate(['']);
          return false;
        }
      })
    );
  }
}
