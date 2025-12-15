import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { LabelComponent } from "../../form/label/label.component";
import { CheckboxComponent } from "../../form/input/checkbox.component";
import { InputFieldComponent } from "../../form/input/input-field.component";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { SharedUiModule } from "../../shared-ui.module";
import { ToastrService } from "ngx-toastr";
import { AuthService, LookupsService, UsersService } from "../../../services";

@Component({
  selector: "app-signup-form",
  imports: [
    CommonModule,
    LabelComponent,
    RouterModule,
    FormsModule,
    TranslateModule,
    SharedUiModule,
  ],
  templateUrl: "./signup-form.component.html",
  styles: ``,
})
export class SignupFormComponent implements OnInit {
  registerForm: FormGroup;
  titles: any;
  departments: any;
  isRegister = false;

  constructor(
    private fb: FormBuilder,
    private _AuthService: AuthService,
    private _UsersService: UsersService,
    private _LookupsService: LookupsService,
    private _ToastrService: ToastrService,
    private _Route: Router,
    private _ActivatedRoute: ActivatedRoute
  ) {
    this.registerForm = this.fb.group(
      {
        name: ["", Validators.required],
        user_name: ["", Validators.required],
        title_id: ["", Validators.required],
        department_id: ["", Validators.required],
        mobile: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,}$/)],
        ],
        password_confirmation: [
          "",
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,}$/)],
        ],
        accept: [true, Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }
  showPassword = false;
  isChecked = false;
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get("password")?.value;
    const confirmPassword = form.get("password_confirmation")?.value;

    if (password !== confirmPassword) {
      form.get("password_confirmation")?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  ngOnInit(): void {
    this.loadTitles();
    this.loadDepartment();
  }
  onSignIn() {
    this.isRegister = true;
    this._AuthService.onRegister(this.registerForm.value).subscribe({
      next: (res) => {},
      error: (err) => {
        this.isRegister = false;
      },
      complete: () => {
        this.isRegister = false;
        this._Route.navigate(["/signin"]);
      },
    });
  }

  private loadDepartment(): void {
    this._LookupsService.getDepartment().subscribe({
      next: (res) => (this.departments = res.data),
      error: () => {},
    });
  }
  private loadTitles(): void {
    this._UsersService.onGetAccountType().subscribe({
      next: (res) =>
        (this.titles = res.data.filter((x: any) => x.id === 2 || x.id === 3)),
      error: () => {},
    });
  }
}
