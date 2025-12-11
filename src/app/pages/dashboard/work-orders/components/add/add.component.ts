import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormControl,
  FormGroup,
  Validators,
  NonNullableFormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";

import { NgxSpinnerService } from "ngx-spinner";
import {
  WorkOrdersService,
  LookupsService,
  HelperService,
  DevicesService,
} from "../../../../../shared/services";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { WorkOrderFormComponent } from "../work-order-form/work-order-form.component";

// Lookup interfaces
interface LookupItem {
  id: number;
  name: string;
}

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
  imports: [SharedUiModule, WorkOrderFormComponent],
})
export class AddComponent implements OnInit {
  // flags
  isUpdatePage = false;

  // Route params
  orderId: string | null = null;
  deviceId: string | null = null;

  // data
  currentOrder: any = null;
  deviceData: any = null;

  // lookups
  workTypes: LookupItem[] = [];
  buildings: LookupItem[] = [];
  equipments: LookupItem[] = [];
  sources: LookupItem[] = [];
  reports: LookupItem[] = [];
  departments: LookupItem[] = [];
  engineers: LookupItem[] = [];
  technicians: LookupItem[] = [];

  // devices
  devices: any[] = [];
  pageSize = 5;
  page = 1;
  hideRequiredMarker = true;

  uploadedFiles: any[] = [];
  orderForm: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workOrdersService: WorkOrdersService,
    private lookupsService: LookupsService,
    private toastr: ToastrService,
    private helperService: HelperService,
    private devicesService: DevicesService,
    private spinner: NgxSpinnerService,
    private fb: NonNullableFormBuilder
  ) {
    this.deviceId = this.route.snapshot.paramMap.get("deviceId");
    this.orderId = this.route.snapshot.paramMap.get("id");
    this.isUpdatePage = !!this.orderId || !!this.deviceId;
  }

  // ----------------------------
  // FORM
  // ----------------------------

  // ----------------------------------------------------
  // INIT
  // ----------------------------------------------------
  ngOnInit(): void {
    if (this.orderId) this.getOrderById(this.orderId);
    if (this.deviceId) this.getDeviceById(this.deviceId);

    // this.loadLookups();
    // this.loadDevices();
    const orderForm = this.fb.group({
      start_date: new FormControl<Date | null>(null),
      start_time: this.fb.control(
        new Date().toTimeString().split(" ")[0],
        Validators.required
      ),

      department_id: this.fb.control<number | null>(null, Validators.required),
      engineer_id: this.fb.control<number | null>(null, Validators.required),
      technician_id: this.fb.control<number | null>(null, Validators.required),

      work_type_id: this.fb.control<number | null>(null, Validators.required),
      building_id: this.fb.control<number | null>(null, Validators.required),

      floor_no: this.fb.control<string | null>(null, Validators.required),
      room_no: this.fb.control<string | null>(null, Validators.required),

      source_id: this.fb.control<number | null>(null, Validators.required),
      customer_name: this.fb.control<string | null>(null, Validators.required),
      customer_phone: this.fb.control<string | null>(null, Validators.required),

      equipment_id: this.fb.control<number | null>(null, Validators.required),
      description: this.fb.control<string | null>(null, Validators.required),

      priority: this.fb.control("high", Validators.required),
      type: this.fb.control("maintenance", Validators.required),

      attachment: this.fb.control<any[]>([]),
    });
    // auto-load engineers & technicians when department changes
    // this.orderForm.get("department_id")?.valueChanges.subscribe((id) => {
    //   if (id) {
    //     this.loadEngineers(id);
    //     this.loadTechnicians(id);
    //   }
    // });
  }

  // ----------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------
  onSubmit(form: FormGroup): void {
    if (form.invalid) {
      this.toastr.warning("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    const values = form.value;

    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "start_date" && value instanceof Date) {
          formData.append(key, value.toISOString().slice(0, 10));
        } else if (key !== "attachment") {
          formData.append(key, value.toString());
        }
      }
    });

    // files
    this.uploadedFiles.forEach((x) => formData.append("attachment", x.file));

    if (this.isUpdatePage && this.orderId) {
      this.updateOrder(formData);
    } else {
      this.addNewOrder(formData);
    }
  }

  // ----------------------------------------------------
  // CREATE
  // ----------------------------------------------------
  private addNewOrder(formData: FormData): void {
    this.workOrdersService.addNewOrder(formData).subscribe({
      next: () => {
        this.toastr.success("Work order added successfully");
        this.router.navigate(["/dashboard/work-orders"]);
      },
      error: (err) => this.toastr.error(err.error?.message || "Error"),
    });
  }

  // ----------------------------------------------------
  // UPDATE
  // ----------------------------------------------------
  private updateOrder(formData: FormData): void {
    this.workOrdersService.editOrder(formData, +this.orderId!).subscribe({
      next: () => {
        this.toastr.success("Work order updated successfully");
        this.router.navigate(["/dashboard/work-orders"]);
      },
      error: (err) => this.toastr.error(err.error?.message || "Error"),
    });
  }

  // ----------------------------------------------------
  // LOAD ORDER
  // ----------------------------------------------------
  private getOrderById(id: string): void {
    this.workOrdersService.getOrder(+id).subscribe({
      next: (res) => {
        const o = res.data;
        this.currentOrder = o;

        this.orderForm.patchValue({
          start_date: o?.start_date ? new Date(o.start_date) : null,
          department_id: o?.department?.id,
          work_type_id: o?.work_type?.id,
          building_id: o?.building?.id,
          floor_no: o?.floor_no,
          room_no: o?.room_no,
          customer_name: o?.customer_name,
          customer_phone: o?.customer_phone,
          equipment_id: o?.equipment?.id,
          source_id: o?.source?.id,
          description: o?.description,
        });
      },
      error: () => this.toastr.error("Failed to load order details"),
    });
  }

  // ----------------------------------------------------
  // LOAD DEVICE
  // ----------------------------------------------------
  private getDeviceById(id: string): void {
    this.devicesService.getDevice(+id).subscribe({
      next: (res) => {
        const o = res.data;
        this.deviceData = o;

        this.orderForm.patchValue({
          department_id: o?.department?.id,
        });
      },
      error: () => this.toastr.error("Failed to load device"),
    });
  }

  // ----------------------------------------------------
  // LOOKUPS
  // ----------------------------------------------------
  private loadLookups(): void {
    this.lookupsService
      .getWork_type()
      .subscribe((res) => (this.workTypes = res.data));
    this.lookupsService
      .getbuilding()
      .subscribe((res) => (this.buildings = res.data));
    this.lookupsService
      .getEquipment()
      .subscribe((res) => (this.equipments = res.data));
    this.lookupsService
      .getSource()
      .subscribe((res) => (this.sources = res.data));
    this.lookupsService
      .getReport()
      .subscribe((res) => (this.reports = res.data));
    this.lookupsService
      .getDepartment()
      .subscribe((res) => (this.departments = res.data));
  }

  private loadEngineers(id: number): void {
    this.helperService
      .getEngineers(id)
      .subscribe((res) => (this.engineers = res.data));
  }

  private loadTechnicians(id: number): void {
    this.helperService
      .getTechnicians(id)
      .subscribe((res) => (this.technicians = res.data));
  }

  // ----------------------------------------------------
  // DEVICES
  // ----------------------------------------------------
  private loadDevices(): void {
    const params = { page_size: this.pageSize, page: this.page };
    this.devicesService.getAllDevices(params).subscribe({
      next: (res) => (this.devices = res.data),
      error: () => this.toastr.error("Failed to load devices"),
    });
  }

  // ----------------------------------------------------
  // FILE UPLOAD
  // ----------------------------------------------------
  onUploadFile(files: any[]) {
    this.uploadedFiles = files;
    this.orderForm.get("attachment")?.setValue(this.uploadedFiles);
  }

  onDeleteFile(id: number) {
    this.uploadedFiles = this.uploadedFiles.filter((x) => x.id !== id);
    this.orderForm.get("attachment")?.setValue(this.uploadedFiles);
  }
}
