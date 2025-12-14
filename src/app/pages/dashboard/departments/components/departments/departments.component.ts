import { Component } from "@angular/core";
import { debounceTime, Subject } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { AddDepartmentComponent } from "../add-department/add-department.component";
import { FormGroup } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { AuthService, DepartmentService } from "../../../../../shared/services";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { BasicTableThreeComponent } from "../../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-departments",
  templateUrl: "./departments.component.html",
  styleUrls: ["./departments.component.scss"],
  imports: [SharedUiModule, BasicTableThreeComponent],
})
export class DepartmentsComponent {
  private subject = new Subject<any>();
  tableResponse: any | undefined;
  tableData: any[] = [];
  pageSize: number | undefined = 100;
  page: number | undefined = 1;
  pageIndex: number = 0;
  columns: any = [];
  originalTableData: any[] = [];
  constructor(
    private _DepartmentService: DepartmentService,
    private spinner: NgxSpinnerService,
    private _ToastrService: ToastrService,
    public dialog: MatDialog,
    public _AuthService: AuthService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.columns = [
      { header: "department.name_en", field: "name_en", type: "text" },
      {
        header: "department.name_ar",
        field: "name_ar",
        type: "text",
      },
      {
        header: "department.maintenance_supervisor.name",
        field: "maintenance_supervisor.name",
        type: "text",
      },

      { header: "", field: "action", type: "action" },
    ];

    this.getAllDepartments();
  }

  // all Departments
  getAllDepartments() {
    this.spinner.show();
    this._DepartmentService.getDepartment(1).subscribe({
      next: (res) => {
        this.tableResponse = res.data.total;
        this.tableData = res?.data.data;
        this.originalTableData = [...this.tableData];
      },
    });
  }
  /** ✅ Handle pagination change */
  onPageChange(event: number): void {
    this.spinner.show();
    this._DepartmentService.getDepartment(event).subscribe({
      next: (res) => {
        this.tableResponse = res.data.total;
        this.tableData = res?.data.data;
        this.originalTableData = [...this.tableData];
      },
    });
  }

  // search
  handleSearch(value: string) {
    this.tableData = this.originalTableData.filter(
      (item) =>
        item.name_ar.toLowerCase().includes(value.toLowerCase()) ||
        item.name_en.toLowerCase().includes(value.toLowerCase())
    );
  }
  // add Department
  openAddDepartment() {
    const dialogRef = this.dialog.open(AddDepartmentComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addDepartment(result);
      }
    });
  }

  addDepartment(data: FormGroup) {
    this._DepartmentService.addDepartment(data.value).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, "Department Added Succesfuly");
      },
      error: (err) => {
        this._ToastrService.error(err.message, "Error in Update Department");
      },
      complete: () => {
        this.getAllDepartments();
      },
    });
  }

  // edit Department
  openEditDepartment(item: any) {
    const dialogRef = this.dialog.open(AddDepartmentComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editDepartment(result, item.id);
      }
    });
  }

  editDepartment(data: FormGroup, id: number) {
    this._DepartmentService.editDepartment(data.value, id).subscribe({
      next: (res) => {
        this._ToastrService.success(
          res.message,
          "Department Update Succesfuly"
        );
      },
      error: (err) => {
        this._ToastrService.error(err.message, "Error in Update Department");
      },
      complete: () => {
        this.getAllDepartments();
      },
    });
  }

  // pagination
  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.page = e.pageIndex + 1;
    this.getAllDepartments();
  }

  deleteItem(id: number) {
    this._DepartmentService.deleteDepartment(id).subscribe({
      next: (res) => {
        this._ToastrService.success("Department Deleted");
      },
      error: (err) => {
        this._ToastrService.error("Delete Department Failed");
      },
      complete: () => {
        this.getAllDepartments();
      },
    });
  }

  tableAction(event: { value: string; dataRow?: any }) {
    if (event.value === "edit") {
      this.openEditDepartment(event?.dataRow);
    } else if (event.value === "delete") {
      this.deleteItem(event?.dataRow.id);
    } else if (event.value === "view") {
      this.router.navigate(["./view", event?.dataRow.id], {
        relativeTo: this.route,
      });
    }
  }
}
