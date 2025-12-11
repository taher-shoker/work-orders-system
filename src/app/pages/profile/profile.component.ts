import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { UserMetaCardComponent } from "../../shared/components/user-profile/user-meta-card/user-meta-card.component";
import { UserInfoCardComponent } from "../../shared/components/user-profile/user-info-card/user-info-card.component";
import { UserAddressCardComponent } from "../../shared/components/user-profile/user-address-card/user-address-card.component";
import { SharedUiModule } from "../../shared/components/shared-ui.module";

@Component({
  selector: "app-profile",
  imports: [CommonModule, SharedUiModule, UserMetaCardComponent],
  templateUrl: "./profile.component.html",
  styles: ``,
})
export class ProfileComponent {}
