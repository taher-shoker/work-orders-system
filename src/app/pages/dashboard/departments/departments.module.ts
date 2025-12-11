import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DepartmentsRoutingModule } from "./departments-routing.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [],
  imports: [CommonModule, DepartmentsRoutingModule, TranslateModule],
})
export class DepartmentsModule {}
