import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { Breadcrumb } from "./breadcrumb.model";
import { BreadcrumbService } from "./breadcrumb.sevices";

@Component({
  selector: "app-page-breadcrumb",
  imports: [RouterModule, CommonModule, TranslateModule],
  templateUrl: "./page-breadcrumb.component.html",
  styles: ``,
})
export class PageBreadcrumbComponent {
  @Input() colorText: "white" | "black" = "black";
  @Input() bgColor: "primary" | "danger" | "warn" | "transparent" | "default" =
    "default";

  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private router: Router
  ) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }
}
