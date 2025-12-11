import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DeviceDataComponent } from "./components/device-data/device-data.component";

const routes: Routes = [
  {
    path: "",
    component: DeviceDataComponent,
    data: { breadcrumb: "breadCrumb.add_data_devices" },
  },
  { path: "device-data", component: DeviceDataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceDataRoutingModule {}
