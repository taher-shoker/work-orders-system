import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UsersComponent } from "./components/users/users.component";
import { ViewUserComponent } from "./components/view-user/view-user.component";
import { AddEditUserComponent } from "./components/add-edit-user/add-edit-user.component";
import { UsersDashComponent } from "./users.component";

const routes: Routes = [
  {
    path: "",
    component: UsersDashComponent,
    data: { breadcrumb: "breadCrumb.users" },
    children: [
      {
        path: "",
        component: UsersComponent,
        data: { breadcrumb: "" },
      },
      {
        path: "add",
        component: AddEditUserComponent,
        data: { breadcrumb: "breadCrumb.add_user_title" },
      },
      {
        path: "edit/:id",
        component: AddEditUserComponent,
        data: { breadcrumb: "breadCrumb.edit_user_title" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
