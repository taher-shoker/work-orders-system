import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EquipmentsComponent } from "./components/equipments/equipments.component";
import { EquipmentsDashComponent } from "./equipments.component";

const routes: Routes = [
  {
    path: "",
    component: EquipmentsDashComponent,
    data: { breadcrumb: "breadCrumb.equipments" },

    children: [
      { path: "", component: EquipmentsComponent, data: { breadcrumb: "" } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentsRoutingModule {}
