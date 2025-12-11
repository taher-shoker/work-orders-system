import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BuildingComponent } from "./components/building/building.component";
import { BuildingDashComponent } from "./building.component";

const routes: Routes = [
  {
    path: "",
    component: BuildingDashComponent,
    data: { breadcrumb: "breadCrumb.buildings" },

    children: [
      {
        path: "",
        component: BuildingComponent,
        data: { breadcrumb: "" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuildingRoutingModule {}
