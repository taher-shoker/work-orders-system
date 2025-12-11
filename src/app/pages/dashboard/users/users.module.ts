import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedUiModule } from "../../../shared/components/shared-ui.module";
import { AddEditUserComponent } from "./components/add-edit-user/add-edit-user.component";
import { BlockUsersComponent } from "./components/users/block-users/block-users.component";
import { UsersComponent } from "./components/users/users.component";
import { ViewUserComponent } from "./components/view-user/view-user.component";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UsersDashComponent } from "./users.component";
import { StatCardComponent } from "../../../shared/components/common/StatCard/StatCard.component";
import { UsersRoutingModule } from "./users-routing.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiModule,
    UsersRoutingModule,
  ],
})
export class UsersModule {}
