import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { DeviceModelComponent } from "../device-model/device-model.component";
import { DeviceTypeComponent } from "../device-type/device-type.component";
import { ManufacturersComponent } from "../manufacturers/manufacturers.component";
import { AccordionItemComponent } from "../../../../../shared/components/FaqItemOneComponent/FaqItemOneComponent.component";

@Component({
  selector: "app-device-data",
  templateUrl: "./device-data.component.html",
  styleUrls: ["./device-data.component.scss"],
  imports: [
    SharedUiModule,
    TranslateModule,
    DeviceModelComponent,
    DeviceTypeComponent,
    ManufacturersComponent,
    AccordionItemComponent,
  ],
})
export class DeviceDataComponent {}
