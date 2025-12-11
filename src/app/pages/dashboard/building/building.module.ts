import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BuildingRoutingModule } from "./building-routing.module";
import { AddBuildingComponent } from "./components/add-building/add-building.component";
import { BuildingComponent } from "./components/building/building.component";
import { TranslateModule } from "@ngx-translate/core";
import { BuildingDashComponent } from "./building.component";

@NgModule({
  declarations: [],
  imports: [CommonModule, TranslateModule, BuildingRoutingModule],
})
export class BuildingModule {}
