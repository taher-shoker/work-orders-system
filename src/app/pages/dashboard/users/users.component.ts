import { Component } from "@angular/core";
import { SharedUiModule } from "../../../shared/components/shared-ui.module";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.css",
  imports: [RouterModule],
})
export class UsersDashComponent {}
