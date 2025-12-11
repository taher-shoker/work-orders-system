import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UsersService } from "../../../../../shared/services/users.service";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";

@Component({
  selector: "app-add-department",
  templateUrl: "./add-department.component.html",
  styleUrls: ["./add-department.component.scss"],
  imports: [SharedUiModule],
})
export class AddDepartmentComponent implements OnInit {
  currentLang = localStorage.getItem("lang");
  hideRequiredMarker: boolean = true;
  tableResponse: any | undefined;
  tableData: any[] = [];
  pageSize: number | undefined = 100;
  page: number | undefined = 1;
  pageIndex: number = 0;
  isEditing: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _UsersService: UsersService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    this.dialogRef.close(this.departmentForm);
  }
  departmentForm = new FormGroup({
    // id: new FormControl(this.data),
    name_en: new FormControl(null, [Validators.required]),
    name_ar: new FormControl(null, [Validators.required]),
    maintenance_supervisor_id: new FormControl(null, [Validators.required]),
  });

  getAllUsers() {
    let params = {
      pageSize: this.pageSize,
      page: this.page,
    };
    this._UsersService.getAllUsers(params).subscribe({
      next: (res) => {
        this.tableResponse = res;
        this.tableData = this.tableResponse?.data;
        if (this.data) {
          this.isEditing = true;
          this.departmentForm.patchValue({
            name_en: this.data?.name_en,
            name_ar: this.data?.name_ar,
            maintenance_supervisor_id: this.data?.maintenance_supervisor.id,
          });
        }
      },
    });
  }
}
