import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (this.authService.isAuthorizedUser() === true) {
      return true; // user is authorized
    } else {
      // redirect to signin and preserve the attempted URL
      return this.router.createUrlTree(["/signin"], {
        queryParams: { redirectUrl: state.url },
      });
    }
  }
}
