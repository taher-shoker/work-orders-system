import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SourcesComponent } from "./components/sources/sources.component";
import { SourcesDashComponent } from "./sources.component";

const routes: Routes = [
  {
    path: "",
    component: SourcesDashComponent,
    data: { breadcrumb: "breadCrumb.sources" },
    children: [
      {
        path: "",
        component: SourcesComponent,
        data: { breadcrumb: "" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SourcesRoutingModule {}
