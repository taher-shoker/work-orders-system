import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportsRoutingModule } from "./reports-routing.module";
import { ReportsComponent } from "./components/reports/reports.component";
import { NgxPrintModule } from "ngx-print";
import { TranslateModule } from "@ngx-translate/core";
import { ReportsDashComponent } from "./reports.component";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NgxPrintModule,
    TranslateModule,
  ],
})
export class ReportsModule {}
