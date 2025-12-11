import { Component } from "@angular/core";
import { SharedUiModule } from "../../shared/components/shared-ui.module";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  imports: [SharedUiModule],
})
export class DashboardComponent {}
