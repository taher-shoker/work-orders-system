import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { HomeComponent } from "./home/home.component";
import { ProfileComponent } from "../profile/profile.component";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },

  {
    path: "",
    component: DashboardComponent,
    data: { breadcrumb: "" },

    children: [
      {
        path: "home",
        component: HomeComponent,
        data: { breadcrumb: "" },
      },
      {
        path: "profile",
        component: ProfileComponent,
        data: { breadcrumb: "" },
      },
      {
        path: "users",
        loadChildren: () =>
          import("./users/users.module").then((m) => m.UsersModule),
      },
      {
        path: "building",
        loadChildren: () =>
          import("./building/building.module").then((m) => m.BuildingModule),
      },
      {
        path: "departments",
        loadChildren: () =>
          import("./departments/departments.module").then(
            (m) => m.DepartmentsModule
          ),
      },

      {
        path: "sources",
        loadChildren: () =>
          import("./sources/sources.module").then((m) => m.SourcesModule),
      },
      {
        path: "equipments",
        loadChildren: () =>
          import("./equipments/equipments.module").then(
            (m) => m.EquipmentsModule
          ),
      },
      {
        path: "work-orders",
        loadChildren: () =>
          import("./work-orders/work-orders.module").then(
            (m) => m.WorkOrdersModule
          ),
      },
      {
        path: "reports",
        loadChildren: () =>
          import("./reports/reports.module").then((m) => m.ReportsModule),
      },
      {
        path: "devices",
        loadChildren: () =>
          import("./devices/devices.module").then((m) => m.DevicesModule),
      },
      {
        path: "device-data",
        loadChildren: () =>
          import("./device-data/device-data.module").then(
            (m) => m.DeviceDataModule
          ),
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
