import { Component, TemplateRef, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  ReportsService,
  LookupsService,
  HelperService,
  AuthService,
  WorkOrdersService,
} from "../../../../../shared/services";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { CommonModule } from "@angular/common";
import { BasicTableThreeComponent } from "../../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
  imports: [SharedUiModule, BasicTableThreeComponent],
})
export class ReportsComponent {
  status: any;
  departments: any;
  departmentId: any;
  supervisor: any;
  engineers: any;
  technicians: any;
  start_date: any;
  tableData: any[] = [];
  columns: any = [];
  isRtl = false;
  pageSize: number | undefined = 5;
  page: number | undefined = 1;
  isEmptyData: boolean = false;
  currentLang = localStorage.getItem("lang");
  hide: boolean = true;
  confirmHide: boolean = true;
  dataToPrint: any = [];

  @ViewChild("statusTemplate", { static: true })
  statusTemplate!: TemplateRef<any>;
  tableResponse: any;
  originalTableData: any;

  constructor(
    private _ReportsService: ReportsService,
    private _LookupsService: LookupsService,
    private _ToastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getDepartment();
    this.getAllStatus();
    this.getEngineers();
    this.getTechnicians();

    this.columns = [
      { header: "#", field: "id", type: "text" },
      { header: "reports.building", field: "building.name", type: "text" },
      { header: "reports.work_type", field: "work_type.name", type: "text" },
      { header: "reports.source", field: "source.name", type: "text" },
      { header: "reports.department", field: "department.name", type: "text" },
      { header: "reports.engineer", field: "engineer.name", type: "text" },
      { header: "reports.technician", field: "technician.name", type: "text" },
      { header: "reports.added_by", field: "added_by.name", type: "text" },
      { header: "reports.status", field: "status.name", type: "text" },
    ];
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

    this._ReportsService.addReports(data.value, params).subscribe({
      next: (res) => {
        this.tableResponse = res.data.total;
        this.tableData = res?.data.data;
        this.originalTableData = [...this.tableData];
      },
      error: (err) => {
        this._ToastrService.error(err.message, "Error in filter report");
      },
    });
    this.handlePrint();
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
  handlePrint() {
    let params = {
      page_size: 200,
      page: this.page,
    };

    this._ReportsService.addReports(this.reportForm.value, params).subscribe({
      next: (res) => {
        this.dataToPrint = res.data;
      },
      error: (err) => {
        this._ToastrService.error(err.message, "Error in filter report");
      },
    });
  }

  /** ✅ Handle pagination change */
  onPageChange(event: number): void {
    this._ReportsService.addReports(this.reportForm.value, event).subscribe({
      next: (res) => {
        this.tableResponse = res.data.total;
        this.tableData = res?.data.data;
      },
      error: (err) => {
        this._ToastrService.error(err.message, "Error in filter report");
      },
    });
  }
}
