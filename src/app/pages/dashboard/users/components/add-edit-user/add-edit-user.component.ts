import { Component } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../../../../shared/services/auth.service";
import { UsersService } from "../../../../../shared/services/users.service";
import { MatDialog } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonComponent } from "../../../../../shared/components/ui/button/button.component";
import { LabelComponent } from "../../../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../../../shared/components/form/input/input-field.component";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-add-edit-user",
  templateUrl: "./add-edit-user.component.html",
  styleUrls: ["./add-edit-user.component.scss"],
  imports: [SharedUiModule, CommonModule],
})
export class AddEditUserComponent {
  userId: any;
  titles: any;
  currentUser: any;
  departments: any;
  departmentId: any;
  hide: boolean = true;
  hideConfirm: boolean = true;
  isUpdatePage: boolean = false;
  data: any;
  showPassword1: any;
  showPassword2: any;

  constructor(
    private _activateRoute: ActivatedRoute,
    private _AuthService: AuthService,
    private _UsersService: UsersService,
    private _ToastrService: ToastrService,
    public router: Router,
    public route: ActivatedRoute,
    public _MatDialog: MatDialog
  ) {
    this.userId = this._activateRoute.snapshot.paramMap.get("id");
    if (this.userId) {
      this.isUpdatePage = true;
    } else {
      this.isUpdatePage = false;
    }
  }

  ngOnInit() {
    this.getTitles();
    this.getDepartments();

    if (this.userId) {
      this.getCurrentUserById(this.userId);
    }
  }
  userForm = new FormGroup(
    {
      name: new FormControl(null, [Validators.required]),
      title_id: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
      ]),
      mobile: new FormControl(null, [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(13),
      ]),
      // account_type: new FormControl(null),
      department_id: new FormControl(null),
      // profileImage: new FormControl(null),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      password_confirmation: new FormControl(null, [Validators.required]),
    },
    {
      validators: this.matchPasswords,
    }
  );

  matchPasswords(form: any) {
    let password = form.get("password");
    let confirmPassword = form.get("password_confirmation");
    if (password.value == confirmPassword.value) {
      return null;
    } else {
      confirmPassword.setErrors({
        invalid: "Password And Confirm Password Not Match",
      });
      return { invalid: "Password And Confirm Password Not Match" };
    }
  }

  onSubmit() {
    const data = this.userForm;
    if (this.userId) {
      // Edit Exist User
      // let myData = new FormData();
      // let myMap = new Map(Object.entries(data.value));
      // for (const [key, value] of myMap) {
      //   myData.append(key, data.value[key]);
      // }
      this._UsersService.onEditUser(data.value, this.userId).subscribe({
        next: (res) => {
          this._ToastrService.success("User Updated Succesfuly");
        },
        error: (err) => {
          this._ToastrService.error(err.message, "Error in Update User");
        },
        complete: () => {
          this.router.navigate(["/dashboard/users"]);
        },
      });
    } else {
      // Add new User
      // let myData = new FormData();
      // let myMap = new Map(Object.entries(data.value));
      // for (const [key, value] of myMap) {
      //   myData.append(key, data.value[key]);
      // }
      this._AuthService.onRegister(data.value).subscribe({
        next: (res) => {
          this.data = res;
          this._ToastrService.success(
            res.data.email,
            "Check yor Email to Verify"
          );
        },
        error: (err) => {
          this._ToastrService.error(
            err.message,
            "Error in Adding a new user to the system"
          );
        },
        complete: () => {
          this.router.navigate(["/dashboard/users"]);
        },
      });
    }
  }
  goback() {
    if (this.isUpdatePage) {
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }
  getCurrentUserById(id: number) {
    this._UsersService.getUser(id).subscribe((res) => {
      this.currentUser = res.data;
      // this.userType = this.currentUser.account_type
      // this.titles = this.currentUser.title
      this.departmentId = this.currentUser.department.id;

      this.userForm.patchValue({
        name: this.currentUser?.name,
        title_id: this.currentUser?.title?.id,
        email: this.currentUser?.email,
        // account_type: this.currentUser.account_type,
        mobile: this.currentUser?.mobile,
        password: this.currentUser?.password,
        password_confirmation: this.currentUser?.password_confirmation,
        department_id: this.currentUser.department?.id,
      });
    });
  }
  togglePasswordVisibility1() {
    this.showPassword1 = !this.showPassword1;
  }
  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
  }
  getTitles() {
    this._UsersService.onGetAccountType().subscribe((res) => {
      this.titles = res.data;
    });
  }
  getDepartments() {
    this._UsersService.onGetDepartment().subscribe((res) => {
      this.departments = res.data;
    });
  }
}
