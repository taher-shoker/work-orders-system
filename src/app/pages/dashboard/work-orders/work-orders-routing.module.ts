import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllComponent } from "./components/all/all.component";
import { ViewComponent } from "./components/view/view.component";
import { AddComponent } from "./components/add/add.component";
import { EditComponent } from "./components/edit/edit.component";
import { WorkOrdersComponent } from "./work-orders.component";

const routes: Routes = [
  {
    path: "",
    component: WorkOrdersComponent,
    data: { breadcrumb: "breadCrumb.work_orders" },
    children: [
      {
        path: "",
        component: AllComponent,
        data: { breadcrumb: "" },
      },
      {
        path: "view/:id",
        component: ViewComponent,
        data: { breadcrumb: "breadCrumb.view_work_orders" },
      },
      {
        path: "add",
        component: AddComponent,
        data: { breadcrumb: "breadCrumb.add_work_orders" },
      },
      // {path:'edit-order/:id' , component:EditOrderComponent},
      {
        path: "edit/:id",
        component: EditComponent,
        data: { breadcrumb: "breadCrumb.work_orders_edit" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkOrdersRoutingModule {}
