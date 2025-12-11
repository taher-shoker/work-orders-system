import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { WorkOrdersRoutingModule } from "./work-orders-routing.module";
import { AddComponent } from "./components/add/add.component";
import { EditComponent } from "./components/edit/edit.component";
import { ViewComponent } from "./components/view/view.component";
import { AllComponent } from "./components/all/all.component";
import { TranslateModule } from "@ngx-translate/core";
import { VerifyCodeComponent } from "./components/view/verify-code/verify-code.component";
import { NgOtpInputComponent } from "ng-otp-input";
import { RejectReasonComponent } from "./components/view/reject-reason/reject-reason.component";
import { HoldReasonComponent } from "./components/view/hold-reason/hold-reason.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedUiModule } from "../../../shared/components/shared-ui.module";
import { StatCardComponent } from "../../../shared/components/common/StatCard/StatCard.component";
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { WorkOrdersComponent } from "./work-orders.component";
import { WorkOrderFormComponent } from "./components/work-order-form/work-order-form.component";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    WorkOrdersRoutingModule,
    NgOtpInputComponent,
    ReactiveFormsModule,
    SharedUiModule,
    StatCardComponent,
    PageBreadcrumbComponent,
  ],
})
export class WorkOrdersModule {}
