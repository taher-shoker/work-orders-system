import { Component } from "@angular/core";
import { debounceTime, Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import {
  AuthService,
  DevicesService,
  LookupsService,
} from "../../../../../shared/services";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { CommonModule } from "@angular/common";
import { BasicTableThreeComponent } from "../../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";

@Component({
  selector: "app-all-devices",
  templateUrl: "./all-devices.component.html",
  styleUrls: ["./all-devices.component.scss"],
  imports: [SharedUiModule, CommonModule, BasicTableThreeComponent],
})
export class AllDevicesComponent {
  tableResponse: any;
  tableData: any[] = [];
  pageSize: number | undefined = 5;
  page: number | undefined = 1;
  pageIndex: number = 0;
  user_id: number = 0;
  columns: any = [];
  originalTableData: any[] = []; // keep the original full data
  private subject = new Subject<any>();
  statisticData: any;
  constructor(
    private _DevicesService: DevicesService,
    private _ToastrService: ToastrService,
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
      { header: "devices.name", field: "name", type: "text" },
      {
        header: "devices.type",
        field: "type.name",
        type: "text",
      },
      { header: "devices.company", field: "company.name", type: "text" },
      { header: "devices.department", field: "department.name", type: "text" },
      { header: "devices.buy_date", field: "buy_date", type: "text" },
      {
        header: "devices.last_maintenance",
        field: "description",
        type: "text",
      },
      { header: "devices.status", field: "status.name", type: "text" },

      { header: "", field: "action", type: "action" },
    ];

    this.onGetAllDevices();
    this._LookupsService.getDashboard().subscribe(); // Fetch the first time

    this._LookupsService.dashboard$.subscribe((data) => {
      this.statisticData = data;
    });
  }
  onGetAllDevices() {
    let params = {
      page: this.page,
      // userName: this.searchValue,
    };
    this.spinner.show();
    this._DevicesService.getAllDevices(params).subscribe({
      next: (res) => {
        this.tableResponse = res.data.total;
        this.tableData = res?.data.data;
        this.originalTableData = [...this.tableData]; // store original data
        this.spinner.hide();
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  /** ✅ Handle pagination change */
  onPageChange(event: number): void {
    this._DevicesService.getAllDevices(event).subscribe({
      next: (res) => {
        this.tableResponse = res.data.total;
        this.tableData = res?.data.data;
        this.originalTableData = [...this.tableData]; // store original data
        this.spinner.hide();
      },
      error: (err) => {},
      complete: () => {},
    });
  }
  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.page = e.pageIndex + 1;
    this.onGetAllDevices();
  }
  // search
  handleSearch(value: string) {
    this.tableData = this.originalTableData.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
  }
  addDevices() {
    this.router.navigate(["./add"], { relativeTo: this.route });
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
    } else if (event.value === "view") {
      this.router.navigate(["./view", event?.dataRow.id], {
        relativeTo: this.route,
      });
    }
  }
}
