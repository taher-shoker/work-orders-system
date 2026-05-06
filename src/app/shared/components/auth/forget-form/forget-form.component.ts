import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SharedUiModule } from "../../shared-ui.module";
import { CommonModule } from "@angular/common";
import { InputFieldComponent } from "../../form/input/input-field.component";
import { Router, RouterModule } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { HelperService } from "../../../services/helper.service";
import { ButtonComponent } from "../../ui/button/button.component";
import { TranslateModule } from "@ngx-translate/core";
@Component({
  selector: "app-forget-form",
  templateUrl: "./forget-form.component.html",
  imports: [
    SharedUiModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
  ],
})
export class ForgetFormComponent implements OnInit {
  resetForm: FormGroup;
  isLoggingIn = false;

  constructor(
    private fb: FormBuilder,
    private _HelperService: HelperService,
    private _ToastrService: ToastrService,
    private _Route: Router,
  ) {
    this.resetForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }
  ngOnInit(): void {}

  onSendResetLink() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoggingIn = true;
    const body = this.resetForm.value;

    this._HelperService.forgotPassword(body).subscribe({
      next: (res) => {
        this._ToastrService.success(
          res?.message || "Password reset link sent",
          "Success"
        );
        this._Route.navigateByUrl("/signin");
      },
      error: (err) => {
        this._ToastrService.error(
          err.error?.message || "Failed to send reset link",
          "Error"
        );
        this.isLoggingIn = false;
      },
      complete: () => {
        this.isLoggingIn = false;
      },
    });
  }
}
