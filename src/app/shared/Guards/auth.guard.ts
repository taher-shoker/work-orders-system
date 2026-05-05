import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from "@angular/router";
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
    if (this.authService.isAuthorizedUser()) {
      return true; // user is authorized
    }

    // redirect to signin and preserve only internal attempted URL
    const safeRedirectUrl = state.url.startsWith("/") ? state.url : "/";
    return this.router.createUrlTree(["/signin"], {
      queryParams: { redirectUrl: safeRedirectUrl },
    });
  }
}
