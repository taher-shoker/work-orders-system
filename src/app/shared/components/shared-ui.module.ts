import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

import { MatIconModule } from "@angular/material/icon";
import { SafeHtmlPipe } from "../pipe/safe-html.pipe";
import { ComponentCardComponent } from "./common/component-card/component-card.component";
import { PageBreadcrumbComponent } from "./common/page-breadcrumb/page-breadcrumb.component";
import { DatePickerComponent } from "./form/date-picker/date-picker.component";
import { CheckboxComponent } from "./form/input/checkbox.component";
import { FileUploaderComponent } from "./form/input/file-input.component";
import { InputFieldComponent } from "./form/input/input-field.component";
import { TextAreaComponent } from "./form/input/text-area.component";
import { LabelComponent } from "./form/label/label.component";
import { PhoneInputComponent } from "./form/phone-input/phone-input.component";
import { SelectComponent } from "./form/select/select.component";
import { BadgeComponent } from "./ui/badge/badge.component";
import { ButtonComponent } from "./ui/button/button.component";
import { TableComponent } from "./ui/table/table.component";
import { StatCardComponent } from "./common/StatCard/StatCard.component";
import { NgOtpInputModule } from "ng-otp-input";
import { NgxPrintModule } from "ngx-print";
import { NgxSpinnerModule } from "ngx-spinner";

const declarationsAndExports = [
  ButtonComponent,
  TableComponent,
  SafeHtmlPipe,
  CheckboxComponent,
  LabelComponent,
  SelectComponent,
  DatePickerComponent,
  ComponentCardComponent,
  BadgeComponent,
  PageBreadcrumbComponent,
  InputFieldComponent,
  TextAreaComponent,
  PhoneInputComponent,
  FileUploaderComponent,
  StatCardComponent,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule,
  NgOtpInputModule,
  NgxPrintModule,
  RouterModule,
  NgxSpinnerModule,
  CommonModule,
  MatIconModule,
];

@NgModule({
  declarations: [],
  exports: [declarationsAndExports],
  providers: [DatePipe, SafeHtmlPipe],
  imports: [declarationsAndExports],
})
export class SharedUiModule {}
