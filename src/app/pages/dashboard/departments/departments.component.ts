import { Component } from "@angular/core";
import { SharedUiModule } from "../../../shared/components/shared-ui.module";

@Component({
  selector: "app-departments",
  templateUrl: "./departments.component.html",
  styleUrl: "./departments.component.css",
  imports: [SharedUiModule],
})
export class DepartmentsDashComponent {}
