import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllDevicesComponent } from "./components/all-devices/all-devices.component";
import { AddEditDeviceComponent } from "./components/add-edit-device/add-edit-device.component";
import { ViewDeviceComponent } from "./components/view-device/view-device.component";
import { AddComponent } from "../work-orders/components/add/add.component";
import { DevicesComponent } from "./devices.component";
import { WorkOrderDeviceComponent } from "./components/work-order-device/work-order-device.component";

const routes: Routes = [
  {
    path: "",
    component: DevicesComponent,
    data: { breadcrumb: "breadCrumb.devices" },

    children: [
      {
        path: "",
        component: AllDevicesComponent,
        data: { breadcrumb: "" },
      },
      {
        path: "add",
        component: AddEditDeviceComponent,
        data: { breadcrumb: "breadCrumb.add_new_device" },
      },
      {
        path: "edit/:id",
        component: AddEditDeviceComponent,
        data: { breadcrumb: "breadCrumb.edit_device" },
      },
      {
        path: "view/:deviceId",
        component: ViewDeviceComponent,
        data: { breadcrumb: "breadCrumb.view_device" },
      },
      {
        path: "view/:deviceId/add-work-order",
        component: WorkOrderDeviceComponent,
        data: { breadcrumb: "breadCrumb.add_work_orders" },
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevicesRoutingModule {}
