import { Component, TemplateRef, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../../shared/services/auth.service";
import { LookupsService } from "../../../../../shared/services/lookups.service";
import { ReportsService } from "../../../../../shared/services/reports.service";
import { WorkOrdersService } from "../../../../../shared/services/work-orders.service";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { BasicTableThreeComponent } from "../../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import { forkJoin } from "rxjs";
import { HelperService } from "../../../../../shared/services";
import { TranslateService } from "@ngx-translate/core";

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
  orderForm!: FormGroup;

  tableResponse: any | undefined;
  tableData: any[] = [];
  pageSize: number | undefined = 5;
  page: number | undefined = 1;
  pageIndex: number = 0;
  currentLang = localStorage.getItem("lang");
  isRtl = false;
  columns: any = [];
  statisticData: any;
  originalTableData: any[] = []; // keep the original full data
  filterData: any;

  constructor(
    private _ReportsService: ReportsService,
    private _LookupsService: LookupsService,
    private _WorkOrdersService: WorkOrdersService,
    private _ToastrService: ToastrService,
    public dialog: MatDialog,
    public router: Router,
    public _AuthService: AuthService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private helperService: HelperService,
    private translate: TranslateService
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
      this.statisticData = data;
    });

    this.getWorkOrders(1);
    this.initOrderForm();
    this.getAllStatus();
    this.loadLookupsAndThenPatch();

    this.orderForm.get("department_id")?.valueChanges.subscribe((id) => {
      this.disableFields();
      if (id) {
        this.loadEngineers(id);
        this.loadTechnicians(id);
      }
    });
  }

  initOrderForm(): void {
    this.orderForm = this.fb.group({
      status: this.fb.control<number | null>(null),
      department_id: this.fb.control<number | null>(null),
      engineer_id: this.fb.control<number | null>(null),
      technician_id: this.fb.control<number | null>(null),
      work_type_id: this.fb.control<number | null>(null),
      building_id: this.fb.control<number | null>(null),
      to_date: this.fb.control<string | null>(null),
      from_date: this.fb.control<string | null>(null),
    });
  }

  onSubmit(data: FormGroup) {
    let params = {
      page_size: this.pageSize,
      page: this.page,
    };
    this.filterData = this.removeNullable(data.value);

    this.getWorkOrders({ page: this.page, ...this.filterData });
  }
  addOrder() {
    this.router.navigate(["./add"], { relativeTo: this.route });
  }
  removeNullable<T extends Record<string, any>>(obj: T): any {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    );
  }

  getWorkOrders(filterData: any) {
    this._WorkOrdersService.getAllOrders(filterData).subscribe({
      next: (res) => {
        this.tableResponse = res.data.total;
        this.tableData = res.data.data;
        this.originalTableData = [...this.tableData]; // store original data
      },
    });
  }
  onPageChange(event: number): void {
    this.page = event;
    this.getWorkOrders({ page: event, ...this.filterData });
  }
  // search
  handleSearch(value: string) {
    this.tableData = this.originalTableData.filter((item) =>
      item.number.toLowerCase().includes(value)
    );
  }
  // Status
  getAllStatus() {
    this._ReportsService.getStatus().subscribe((res) => {
      this.status = res.data;
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
          this._ToastrService.error(
            this.translate.instant("orders.delete_error")
          );
        },
        complete: () => {
          this._ToastrService.success(
            this.translate.instant("orders.delete_success")
          );
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

  disableFields() {
    this.orderForm.get("engineer_id")?.disable();
    this.orderForm.get("technician_id")?.disable();
  }
  enableFields() {
    this.orderForm.get("engineer_id")?.enable();
    this.orderForm.get("technician_id")?.enable();
  }

  private loadLookupsAndThenPatch(): void {
    forkJoin({
      workTypes: this._LookupsService.getWork_type(),
      buildings: this._LookupsService.getbuilding(),
      departments: this._LookupsService.getDepartment(),
    }).subscribe({
      next: (res) => {
        // Defensive access — avoid undefined errors
        this.workTypeList = res.workTypes?.data ?? [];
        this.buildingsList = res.buildings?.data ?? [];
        this.departments = res.departments?.data ?? [];
      },
      error: () => {},
    });
  }

  private loadEngineers(id: number): void {
    this.disableFields();
    this.helperService.getEngineers(id).subscribe((res) => {
      if (res.data && res.data.length > 0) {
        this.engineers = res.data;
        this.enableFields();
      } else {
        this.engineers = [];
      }
    });
  }

  private loadTechnicians(id: number): void {
    this.disableFields();

    this.helperService.getTechnicians(id).subscribe((res) => {
      if (res.data && res.data.length > 0) {
        this.technicians = res.data;
        this.enableFields();
      } else {
        this.technicians = [];
      }
    });
  }
}
