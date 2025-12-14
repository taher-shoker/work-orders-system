import { Component, Inject, Optional } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UsersService } from "../../../../../shared/services/users.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-view-user",
  templateUrl: "./view-user.component.html",
  styleUrls: ["./view-user.component.scss"],
  imports: [TranslateModule],
})
export class ViewUserComponent {
  currentLang = localStorage.getItem("lang");
  // buildingData: any
  userData: any;

  constructor(
    private _UsersService: UsersService,
    private _ToastrService: ToastrService,
    private _router: Router,
    private translate: TranslateService,
    @Optional() public dialogRef?: MatDialogRef<ViewUserComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
  ) {}

  ngOnInit(): void {
    this.getUserById(this.data);
  }
  getUserById(id: number) {
    this._UsersService.getUser(id).subscribe({
      next: (res) => {
        this.userData = res.data;
      },
      error: (err) => {
        this._ToastrService.error(
          err.message,
          this.translate.instant("users.add_error")
        );
      },
      complete: () => {},
    });
  }
  onClose(): void {
    this.dialogRef?.close();
  }
}
