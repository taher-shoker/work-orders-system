import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { debounceTime, Subject } from "rxjs";
import { BlockUsersComponent } from "./block-users/block-users.component";
import { ViewUserComponent } from "../view-user/view-user.component";
import { UsersService } from "../../../../../shared/services/users.service";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "../../../../../shared/services";
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
  @ViewChild("statusTemplate", { static: true })
  statusTemplate!: TemplateRef<any>;
  @ViewChild("actionTemplate", { static: true })
  actionTemplate!: TemplateRef<any>;

  private reloadSubject = new Subject<void>();

  constructor(
    private usersService: UsersService,
    public _AuthService: AuthService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
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

    // this.reloadSubject.pipe(debounceTime(800)).subscribe(() => {
    //   this.loadUsers();
    // });
  }

  addUser() {
    this.router.navigate(["./add"], { relativeTo: this.route });
  }

  /** ✅ Fetch all users with pagination */
  loadUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (res) => {
        this.tableResponse = res;
        this.tableData = res?.data || [];
      },
      error: () => {
        this.toastr.error("Failed to load users", "Error");
      },
    });
  }

  /** ✅ Handle pagination change */
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadUsers();
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
      // this._WorkOrdersService.deleteOrder(event.dataRow.id).subscribe({
      //   next: (res) => {},
      //   error: (err) => {
      //     this._ToastrService.error("delete order failed");
      //   },
      //   complete: () => {
      //     this.onSubmit(this.orderForm);
      //     this._ToastrService.success("Order Deleted");
      //   },
      // });
    } else if (event.value === "confirm") {
      this.openBlockDialog(event?.dataRow);
    }
  }
}
