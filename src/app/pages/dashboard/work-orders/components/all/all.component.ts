import { Component, TemplateRef, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from "@angular/material/dialog";
import { FormControl, FormGroup } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { ViewComponent } from "../view/view.component";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../../shared/services/auth.service";
import { LookupsService } from "../../../../../shared/services/lookups.service";
import { ReportsService } from "../../../../../shared/services/reports.service";
import { WorkOrdersService } from "../../../../../shared/services/work-orders.service";
import { relativeToValue } from "@amcharts/amcharts5/.internal/core/util/Utils";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { CommonModule } from "@angular/common";
import { BasicTableThreeComponent } from "../../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";

@Component({
  selector: "app-all",
  templateUrl: "./all.component.html",
  styleUrls: ["./all.component.scss"],
  imports: [SharedUiModule, BasicTableThreeComponent],
})
export class AllComponent {
  @ViewChild("statusTemplate", { static: true })
  statusTemplate!: TemplateRef<any>;

  status: any;
  departments: any;
  engineers: any;
  technicians: any;
  workTypeList: any;
  buildingsList: any;
  isEmptyData: boolean = false;

  tableResponse: any | undefined;
  tableData: any[] = [];
  pageSize: number | undefined = 5;
  page: number | undefined = 1;
  pageIndex: number = 0;
  currentLang = localStorage.getItem("lang");
  isRtl = false;
  columns: any = [];
  statisticData: any;
  constructor(
    private _ReportsService: ReportsService,
    private _LookupsService: LookupsService,
    private _WorkOrdersService: WorkOrdersService,
    private _ToastrService: ToastrService,
    public dialog: MatDialog,
    public router: Router,
    public _AuthService: AuthService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    const language = localStorage.getItem("lang");
    if (language === "en") {
      this.isRtl = false;
    } else {
      this.isRtl = true;
    }
    this.columns = [
      { header: "table.order_number", field: "number", type: "text" },
      { header: "table.work_type", field: "source.name", type: "text" },
      { header: "table.deparment", field: "department.name", type: "text" },
      {
        header: "table.problem_description",
        field: "description",
        type: "text",
      },
      { header: "table.floor", field: "floor_no", type: "text" },
      { header: "table.room", field: "room_no", type: "text" },
      { header: "table.requestor", field: "customer_name", type: "text" },
      { header: "table.date_created", field: "start_date", type: "date" },
      {
        header: "table.status",
        field: "status.name",
        type: "custom",
        template: this.statusTemplate, // NOW it's defined
      },
      // { header: "table.category", field: "category" },
      // { header: "table.status", field: "status" },
      { header: "", field: "action", type: "action" },
    ];
    this._LookupsService.getDashboard().subscribe(); // Fetch the first time

    this._LookupsService.dashboard$.subscribe((data) => {
      console.log("Dashboard Data Updated: ", data);
      this.statisticData = data;
    });

    this.getWorkOrders();
    this.getDepartment();
    this.getAllStatus();
    this.getEngineers();
    this.getTechnicians();
    this.getBuildings();
    this.getWorkType();
  }

  orderForm = new FormGroup({
    status: new FormControl(0),
    department_id: new FormControl(null),
    engineer_id: new FormControl(null),
    technician_id: new FormControl(null),
    building_id: new FormControl(null),
    work_type_id: new FormControl(null),
    from_date: new FormControl(null),
    to_date: new FormControl(null),
  });

  onSubmit(data: FormGroup) {
    let params = {
      page_size: this.pageSize,
      page: this.page,
    };
  }
  addOrder() {
    this.router.navigate(["./add"], { relativeTo: this.route });
  }
  getWorkOrders() {
    this._WorkOrdersService.getAllOrders().subscribe({
      next: (res) => {
        this.tableResponse = res;
        this.tableData = this.tableResponse.data;
      },
    });
  }
  // Status
  getAllStatus() {
    this._ReportsService.getStatus().subscribe((res) => {
      this.status = res.data;
    });
  }
  // Department
  getDepartment() {
    this._LookupsService.getDepartment().subscribe((res) => {
      this.departments = res.data;
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
  // buildings
  getBuildings() {
    this._ReportsService.getBuildings().subscribe({
      next: (res) => {
        this.buildingsList = res.data;
      },
    });
  }
  // WorkType
  getWorkType() {
    this._ReportsService.getWorkType().subscribe({
      next: (res) => {
        this.workTypeList = res.data;
      },
    });
  }
  tableAction(event: { value: string; dataRow?: any }) {
    if (event.value === "edit") {
      this.router.navigate(["./edit", event?.dataRow.id], {
        relativeTo: this.route,
      });
    } else if (event.value === "delete") {
      this._WorkOrdersService.deleteOrder(event?.dataRow.id).subscribe({
        next: (res) => {},
        error: (err) => {
          this._ToastrService.error("delete order failed");
        },
        complete: () => {
          this.onSubmit(this.orderForm);
          this._ToastrService.success("Order Deleted");
        },
      });
    } else if (event.value === "view") {
      this.router.navigate(["./view", event.dataRow.id], {
        relativeTo: this.route,
      });
    }
  }

  getOrderNumberById(id: number): number {
    const items = [
      { id: 2, name: "مسند" },
      { id: 3, name: "قيد التنفيذ" },
      { id: 4, name: "معلق" },
      { id: 5, name: "مكتمل" },
      { id: 7, name: "مرفوض" },
      { id: 8, name: "ملغي" },
      { id: 6, name: "مغلق" },
      { id: 13, name: "تاكيد الغلق" },
    ];
    const index = items.findIndex((item) => item.id === id);
    return index; // +1 for 1-based order
  }
  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.page = e.pageIndex + 1;
    this.onSubmit(this.orderForm);
  }
}
