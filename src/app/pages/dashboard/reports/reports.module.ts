import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportsRoutingModule } from "./reports-routing.module";
import { NgxPrintModule } from "ngx-print";
import { TranslateModule } from "@ngx-translate/core";


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
