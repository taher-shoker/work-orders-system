import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReportsComponent } from "./components/reports/reports.component";
import { ReportsDashComponent } from "./reports.component";

const routes: Routes = [
  {
    path: "",
    component: ReportsDashComponent,
    data: { breadcrumb: "breadCrumb.reports" },

    children: [
      {
        path: "",
        component: ReportsComponent,
        data: { breadcrumb: "" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
