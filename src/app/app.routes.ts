import { Routes } from "@angular/router";

import { NotFoundComponent } from "./pages/other-page/not-found/not-found.component";
import { AppLayoutComponent } from "./shared/layout/app-layout/app-layout.component";

import { SignInComponent } from "./pages/auth-pages/sign-in/sign-in.component";
import { SignUpComponent } from "./pages/auth-pages/sign-up/sign-up.component";
import { AuthGuard } from "./shared/Guards/auth.guard";
import { ResetPasswordComponent } from "./pages/auth-pages/reset-password/reset-password.component";

export const routes: Routes = [
  { path: "", redirectTo: "dashboard/home", pathMatch: "full" },

  {
    path: "",
    component: AppLayoutComponent,
    data: { breadcrumb: "breadCrumb.home" },

    children: [
      {
        path: "dashboard",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./pages/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },

      // {
      //   path: "calendar",
      //   component: CalenderComponent,
      //   title:
      //     "Angular Calender | TailAdmin - Angular Admin Dashboard Template",
      // },
      // {
      //   path: "profile",
      //   component: ProfileComponent,
      //   title:
      //     "Angular Profile Dashboard | TailAdmin - Angular Admin Dashboard Template",
      // },
      // {
      //   path: "form-elements",
      //   component: FormElementsComponent,
      //   title:
      //     "Angular Form Elements Dashboard | TailAdmin - Angular Admin Dashboard Template",
      // },
      // {
      //   path: "basic-tables",
      //   component: BasicTablesComponent,
      //   title:
      //     "Angular Basic Tables Dashboard | TailAdmin - Angular Admin Dashboard Template",
      // },
      // {
      //   path: "blank",
      //   component: BlankComponent,
      //   title:
      //     "Angular Blank Dashboard | TailAdmin - Angular Admin Dashboard Template",
      // },
      // // support tickets
      // {
      //   path: "invoice",
      //   component: InvoicesComponent,
      //   title:
      //     "Angular Invoice Details Dashboard | TailAdmin - Angular Admin Dashboard Template",
      // },
      // {
      //   path: "line-chart",
      //   component: LineChartComponent,
      //   title:
      //     "Angular Line Chart Dashboard | TailAdmin - Angular Admin Dashboard Template",
      // },
      // {
      //   path: "bar-chart",
      //   component: BarChartComponent,
      //   title:
      //     "Angular Bar Chart Dashboard | TailAdmin - Angular Admin Dashboard Template",
      // },
      // {
      //   path: "alerts",
      //   component: AlertsComponent,
      //   title:
      //     "Angular Alerts Dashboard | TailAdmin - Angular Admin Dashboard Template",
      // },
      // {
      //   path: "avatars",
      //   component: AvatarElementComponent,
      //   title:
      //     "Angular Avatars Dashboard | TailAdmin - Angular Admin Dashboard Template",
      // },
      // {
      //   path: "badge",
      //   component: BadgesComponent,
      //   title:
      //     "Angular Badges Dashboard | TailAdmin - Angular Admin Dashboard Template",
      // },
      // {
      //   path: "buttons",
      //   component: ButtonsComponent,
      //   title:
      //     "Angular Buttons Dashboard | TailAdmin - Angular Admin Dashboard Template",
      // },
      // {
      //   path: "images",
      //   component: ImagesComponent,
      //   title:
      //     "Angular Images Dashboard | TailAdmin - Angular Admin Dashboard Template",
      // },
      // {
      //   path: "videos",
      //   component: VideosComponent,
      //   title:
      //     "Angular Videos Dashboard | TailAdmin - Angular Admin Dashboard Template",
      // },
    ],
  },

  // auth pages
  {
    path: "signin",
    component: SignInComponent,
    title: "",
  },
  {
    path: "forget-password",
    component: ResetPasswordComponent,
  },
  {
    path: "signup",
    component: SignUpComponent,
  },
  // error pages
  {
    path: "**",
    component: NotFoundComponent,
  },
];
