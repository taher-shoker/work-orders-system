import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DepartmentsComponent } from "./components/departments/departments.component";
import { DepartmentsDashComponent } from "./departments.component";

const routes: Routes = [
  {
    path: "",
    component: DepartmentsDashComponent,
    data: { breadcrumb: "breadCrumb.departments" },

    children: [
      {
        path: "",
        component: DepartmentsComponent,
        data: { breadcrumb: "" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentsRoutingModule {}
