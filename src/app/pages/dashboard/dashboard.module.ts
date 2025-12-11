import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    DashboardRoutingModule,
    PageBreadcrumbComponent,
    NgxSpinnerModule,
  ],
  exports: [],
})
export class DashboardModule {}
