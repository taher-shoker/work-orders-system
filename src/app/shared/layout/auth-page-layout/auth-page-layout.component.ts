import { Component } from "@angular/core";
import { GridShapeComponent } from "../../components/common/grid-shape/grid-shape.component";
import { RouterModule } from "@angular/router";
import { ThemeToggleTwoComponent } from "../../components/common/theme-toggle-two/theme-toggle-two.component";
import { SharedUiModule } from "../../components/shared-ui.module";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-auth-page-layout",
  imports: [RouterModule, ThemeToggleTwoComponent, TranslateModule],
  templateUrl: "./auth-page-layout.component.html",
  styles: ``,
})
export class AuthPageLayoutComponent {}
