import { Component } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  ReportsService,
  LookupsService,
  HelperService,
  AuthService,
} from "../../../../../shared/services";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { CommonModule } from "@angular/common";
import { BasicTableThreeComponent } from "../../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
  imports: [SharedUiModule, BasicTableThreeComponent],
})
export class ReportsComponent {
  data: any;
  status: any;
  reports: any;
  departmentId: any;
  supervisor: any;
  engineers: any;
  technicians: any;
  start_date: any;
  date: any;
  tableResponse: any | undefined;
  tableData: any[] = [];
  pageSize: number | undefined = 5;
  page: number | undefined = 1;
  isEmptyData: boolean = false;
  currentLang = localStorage.getItem("lang");

  hide: boolean = true;
  confirmHide: boolean = true;
  hideRequiredMarker: boolean = true;
  columns: any = [];

  constructor(
    private _ReportsService: ReportsService,
    private _LookupsService: LookupsService,
    private _ToastrService: ToastrService,
    private _Router: Router,
    private _HelperService: HelperService,
    public _AuthService: AuthService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    // // for get all work orders first
    // Object.entries(this.reportForm.value).forEach(([key, value]) => {
    //   if (!value) {
    //     this.isEmptyData = true
    //   }
    // })

    // if (this.isEmptyData == true) {
    //   this.onSubmit(this.reportForm)
    // }

    this.columns = [
      { header: "reports.name", field: "name", type: "text" },
      {
        header: "reports.date",
        field: "date",
        type: "text",
      },
      { header: "reports.file", field: "file", type: "text" },

      { header: "", field: "action", type: "action" },
    ];
    this.getReports();
    this.getAllStatus();
    this.getEngineers();
    this.getTechnicians();
  }

  reportForm = new FormGroup({
    status: new FormControl(0),
    department_id: new FormControl(null),
    engineer_id: new FormControl(null),
    technician_id: new FormControl(null),
    from_date: new FormControl(null),
    to_date: new FormControl(null),
  });

  onSubmit(data: FormGroup) {
    let params = {
      page_size: this.pageSize,
      page: this.page,
    };
    // this.spinner.show()

    this._ReportsService.addReports(data.value, params).subscribe({
      next: (res) => {
        this.data = res.data;

        this._ToastrService.success("Report Added Succesfuly");
      },
      error: (err) => {
        this._ToastrService.error(err.message, "Error in Add  Report");
      },
      complete: () => {},
    });
  }
  // Status
  getAllStatus() {
    this._ReportsService.getStatus().subscribe((res) => {
      this.status = res.data;
    });
  }
  // Department
  getReports() {
    this._LookupsService.getReport().subscribe((res) => {
      this.reports = res.data;
      this.tableData = res.data;
    });
  }
  // Engineers
  getEngineers() {
    this._ReportsService.getEngineers().subscribe((res) => {
      this.engineers = res.data;
    });
  }
  // Technicians
  getTechnicians() {
    this._ReportsService.getTechnicians().subscribe((res) => {
      this.technicians = res.data;
    });
  }
  tableAction(event: { value: string; dataRow?: any }) {
    if (event.value === "edit") {
      // this.router.navigate(["./edit", event?.dataRow.id], {
      //   relativeTo: this.route,
      // });
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
