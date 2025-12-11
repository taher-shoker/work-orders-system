import { Component } from "@angular/core";
import { BuildingRoutingModule } from "../building/building-routing.module";

@Component({
  selector: "app-devices",
  imports: [BuildingRoutingModule],
  templateUrl: "./devices.component.html",
  styleUrl: "./devices.component.css",
})
export class DevicesComponent {}
