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
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../../services/auth.service";
import { ButtonComponent } from "../../ui/button/button.component";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-signin-form",
  templateUrl: "./signin-form.component.html",
  imports: [
    SharedUiModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
  ],
})
export class SigninFormComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoggingIn = false;
  redirectUrl = "/";

  constructor(
    private fb: FormBuilder,
    private _AuthService: AuthService,
    private _ToastrService: ToastrService,
    private _Route: Router,
    private _ActivatedRoute: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      keepLoggedIn: [false],
    });
  }
  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe((params) => {
      this.redirectUrl = this.getSafeRedirectUrl(params["redirectUrl"]);
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoggingIn = true;
    const body = this.loginForm.value;

    this._AuthService.onLogin(body).subscribe({
      next: () => {
        this._Route.navigateByUrl(this.redirectUrl);
      },
      error: (err) => {
        this._ToastrService.error(
          err.error?.message || "Login failed",
          "Error"
        );
        this.isLoggingIn = false;
      },
      complete: () => {
        this.isLoggingIn = false;
      },
    });
  }

  private getSafeRedirectUrl(redirectUrl: string | undefined): string {
    if (!redirectUrl || typeof redirectUrl !== "string") {
      return "/";
    }

    if (
      redirectUrl.startsWith("http://") ||
      redirectUrl.startsWith("https://") ||
      redirectUrl.startsWith("//")
    ) {
      return "/";
    }

    return redirectUrl.startsWith("/") ? redirectUrl : "/";
  }
}
