import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { debounceTime, Subject } from "rxjs";
import { BlockUsersComponent } from "./block-users/block-users.component";
import { ViewUserComponent } from "../view-user/view-user.component";
import { UsersService } from "../../../../../shared/services/users.service";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { AuthService, LookupsService } from "../../../../../shared/services";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { BasicTableThreeComponent } from "../../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
  imports: [
    SharedUiModule,
    CommonModule,
    TranslateModule,
    BasicTableThreeComponent,
  ],
})
export class UsersComponent implements OnInit {
  tableData: any[] = [];
  tableResponse: any;
  pageSize = 5;
  pageIndex = 0;
  columns: any = [];
  originalTableData: any[] = []; // keep the original full data
  @ViewChild("statusTemplate", { static: true })
  statusTemplate!: TemplateRef<any>;
  @ViewChild("actionTemplate", { static: true })
  actionTemplate!: TemplateRef<any>;

  private reloadSubject = new Subject<void>();
  statisticData: any;

  constructor(
    private usersService: UsersService,
    public _AuthService: AuthService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    private _LookupsService: LookupsService
  ) {}

  ngOnInit(): void {
    this.columns = [
      { header: "users.user", field: "name", type: "text" },
      {
        header: "users.email",
        field: "email",
        type: "text",
      },
      { header: "users.mobile", field: "mobile", type: "text" },
      {
        header: "users.department",
        field: "department.name",
        type: "text",
      },
      { header: "users.title", field: "title.name", type: "text" },
      {
        header: "users.status",
        field: "is_active",
        type: "custom",
        template: this.statusTemplate,
      },

      {
        header: "",
        field: "action",
        type: "action",
        template: this.actionTemplate,
      },
    ];

    this.loadUsers();
    this._LookupsService.getDashboard().subscribe(); // Fetch the first time

    this._LookupsService.dashboard$.subscribe((data) => {
      this.statisticData = data;
    });
  }

  addUser() {
    this.router.navigate(["./add"], { relativeTo: this.route });
  }

  /** ✅ Fetch all users with pagination */
  loadUsers(pageNumber?: number): void {
    this.usersService.getAllUsers(pageNumber).subscribe({
      next: (res) => {
        this.tableResponse = res.total;
        this.tableData = res?.data || [];
        this.originalTableData = [...this.tableData]; // store original data
      },
      error: () => {
        this.toastr.error("Failed to load users", "Error");
      },
    });
  }
  // search
  handleSearch(value: string) {
    this.tableData = this.originalTableData.filter((item) =>
      item.email.toLowerCase().includes(value)
    );
  }

  /** ✅ Handle pagination change */
  onPageChange(event: number): void {
    this.pageIndex = event;
    this.loadUsers(event);
  }

  /** ✅ Open block/unblock user dialog */
  openBlockDialog(user: any): void {
    const dialogRef = this.dialog.open(BlockUsersComponent, { data: user });

    dialogRef.afterClosed().subscribe((userId: number | undefined) => {
      if (userId) {
        this.toggleUserBlock(userId);
      }
    });
  }

  /** ✅ Block or unblock a user */
  private toggleUserBlock(userId: number): void {
    this.usersService.onBlockOrUnblockUser({ user_id: userId }).subscribe({
      next: (res) => {
        const message = res.isActivated
          ? "User unblocked successfully"
          : "User blocked successfully";
        this.toastr.success(message, "Success");
      },
      error: () => {
        this.toastr.error("Failed to block or unblock user", "Error");
      },
      complete: () => this.loadUsers(),
    });
  }

  tableAction(event: { value: string; dataRow?: any }) {
    if (event.value === "edit") {
      this.router.navigate(["./edit", event?.dataRow.id], {
        relativeTo: this.route,
      });
    } else if (event.value === "delete") {
      this.usersService.onDeleteUser(event.dataRow.id).subscribe({
        next: (res) => {},
        complete: () => {
          this.loadUsers();
        },
      });
    } else if (event.value === "confirm") {
      this.openBlockDialog(event?.dataRow);
    }
  }
}
