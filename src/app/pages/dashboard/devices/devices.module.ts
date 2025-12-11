import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";

import { DevicesRoutingModule } from "./devices-routing.module";
import { AddEditDeviceComponent } from "./components/add-edit-device/add-edit-device.component";
import { ViewDeviceComponent } from "./components/view-device/view-device.component";
import { AllDevicesComponent } from "./components/all-devices/all-devices.component";
import { A11yModule } from "@angular/cdk/a11y";
import { TranslateModule } from "@ngx-translate/core";
import { SharedUiModule } from "../../../shared/components/shared-ui.module";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxPrintModule } from "ngx-print";
import { WorkOrderDeviceComponent } from "./components/work-order-device/work-order-device.component";

@NgModule({
  declarations: [
    // AddEditDeviceComponent,
    // ViewDeviceComponent,
    // AllDevicesComponent,
    // WorkOrderDeviceComponent,
  ],
  imports: [
    CommonModule,
    DevicesRoutingModule,
    TranslateModule,
    A11yModule,
    DatePipe,
    SharedUiModule,
    ReactiveFormsModule,
    NgxPrintModule,
  ],
})
export class DevicesModule {}
