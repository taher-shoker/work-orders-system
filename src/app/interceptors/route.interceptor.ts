import { Injectable } from "@angular/core";
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Event,
} from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class RouteInterceptorService {
  private lastAttemptedUrl: string | null = null;

  constructor(private router: Router) {
    this.trackRoutes();
  }

  private trackRoutes(): void {}
}
