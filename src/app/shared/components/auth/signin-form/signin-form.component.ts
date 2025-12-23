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
  redirectUrl: any;

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
      this.redirectUrl = params["redirectUrl"] || "/";
      console.log("Redirect URL:", this.redirectUrl);
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
      next: (res) => {
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
}
