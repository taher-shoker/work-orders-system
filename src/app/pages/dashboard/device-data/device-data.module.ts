import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DeviceDataRoutingModule } from "./device-data-routing.module";
import { DeviceModelComponent } from "./components/device-model/device-model.component";

@NgModule({
  declarations: [],
  imports: [CommonModule, DeviceDataRoutingModule],
})
export class DeviceDataModule {}
