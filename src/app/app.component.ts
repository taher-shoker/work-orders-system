import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { RouteInterceptorService } from "./interceptors/route.interceptor";
import { DirectionService } from "./shared/services/direction.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "";

  constructor(
    private translate: TranslateService,
    private router: Router,
    private routeInterceptor: RouteInterceptorService,
    public directionService: DirectionService
  ) {
    this.directionService.initDirection();
  }
}
