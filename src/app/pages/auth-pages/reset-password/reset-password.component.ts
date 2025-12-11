import { Component, OnInit } from "@angular/core";
import { AuthPageLayoutComponent } from "../../../shared/layout/auth-page-layout/auth-page-layout.component";
import { ForgetFormComponent } from "../../../shared/components/auth/forget-form/forget-form.component";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  imports: [AuthPageLayoutComponent, ForgetFormComponent],
})
export class ResetPasswordComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
