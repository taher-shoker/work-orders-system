import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { TranslateModule } from "@ngx-translate/core";
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import {
  ReportsService,
  LookupsService,
  WorkOrdersService,
  AuthService,
  HelperService,
  DevicesService,
} from "../../../../../shared/services";
import { TextAreaComponent } from "../../../../../shared/components/form/input/text-area.component";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-work-order-form",
  templateUrl: "./work-order-form.component.html",
  imports: [SharedUiModule],
})
export class WorkOrderFormComponent implements OnInit {
  status: any;
  departments: any;
  engineers: any;
  technicians: any;
  workTypeList: any;
  buildingsList: any;
  equipments!: any[];
  sources!: any[];
  devices: any[] = [];

  @Input() workOrderData: boolean = false;
  isRtl = false;
  columns: any = [];
  orderForm!: FormGroup;
  uploadedFiles!: any[];
  orderId: any;
  data: any;
  isEditing = false;

  constructor(
    private _LookupsService: LookupsService,
    private _WorkOrdersService: WorkOrdersService,
    private helperService: HelperService,
    private devicesService: DevicesService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    public router: Router,
    public _AuthService: AuthService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.orderId = this.route.snapshot.paramMap.get("id");
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["workOrderData"]) {
      this.data = changes["workOrderData"].currentValue;
      if (this.data) {
        this.isEditing = true;
        this.restFormWithValue(this.data);
      }
    }
  }
  restFormWithValue(data: any) {
    // patch form safely
    this.orderForm.patchValue({
      start_date: data?.start_date ? new Date(data.start_date) : null,
      start_time: data?.start_time || new Date().toTimeString().split(" ")[0],
      department_id: data?.department?.id ?? null,
      engineer_id: data?.engineer?.id,
      technician_id: data?.technician?.id,
      work_type_id: data?.work_type?.id ?? null,
      building_id: data?.building?.id ?? null,
      floor_no: data?.floor_no ?? null,
      room_no: data?.room_no ?? null,
      customer_name: data?.customer_name ?? null,
      customer_phone: data?.customer_phone ?? null,
      equipment_id: data?.equipment?.id ?? null,
      source_id: data?.source?.id ?? null,
      description: data?.description ?? null,
      priority: this.departments?.priority ?? "high",
      type: data?.type ?? "maintenance",
    });

    if (typeof data.attachment === "string") {
      const url = data.attachment;
      const fileName = url.split("attachment/")[1];

      this.uploadedFiles = [
        {
          id: fileName, // constant based on filename

          file: {
            name: fileName,
          },
        },
      ];

      this.orderForm.get("attachment")?.setValue(this.uploadedFiles);
    }
  }
  ngOnInit() {
    const language = localStorage.getItem("lang");
    if (language === "en") {
      this.isRtl = false;
    } else {
      this.isRtl = true;
    }
    this.initOrderForm();

    this.loadLookupsAndThenPatch();
    this.loadDevices();

    this.orderForm.get("department_id")?.valueChanges.subscribe((id) => {
      this.disableFields();
      if (id) {
        this.loadEngineers(id);
        this.loadTechnicians(id);
      }
    });
  }
  disableFields() {
    this.orderForm.get("engineer_id")?.disable();
    this.orderForm.get("technician_id")?.disable();
  }
  enableFields() {
    this.orderForm.get("engineer_id")?.enable();
    this.orderForm.get("technician_id")?.enable();
  }
  initOrderForm(): void {
    this.orderForm = this.fb.group({
      start_time: this.fb.control(new Date().toTimeString().split(" ")[0]),
      priority: this.fb.control("high"),
      type: this.fb.control("maintenance"),

      start_date: this.fb.control<number | null>(null, Validators.required),
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
      device_id: this.fb.control<number | null>(null, Validators.required),
      description: this.fb.control<string | null>(null, Validators.required),
      attachment: this.fb.control<any[]>([], Validators.required),
    });
  }

  onSubmit() {

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    const values = this.orderForm.value;

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

    if (this.orderId) {
      this.updateOrder(formData);
    } else {

      this.addNewOrder(formData);
    }
  }
  goback() {
    if (this.isEditing) {
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }

  // ----------------------------------------------------
  // CREATE
  // ----------------------------------------------------
  private addNewOrder(formData: FormData): void {
    this._WorkOrdersService.addNewOrder(formData).subscribe({
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
    this._WorkOrdersService.editOrder(formData, +this.orderId!).subscribe({
      next: () => {
        this.toastr.success("Work order updated successfully");
        this.router.navigate(["/dashboard/work-orders"]);
      },
      error: (err) => this.toastr.error(err.error?.message || "Error"),
    });
  }

  private loadLookupsAndThenPatch(): void {
    forkJoin({
      workTypes: this._LookupsService.getWork_type(),
      buildings: this._LookupsService.getbuilding(),
      equipments: this._LookupsService.getEquipment(),
      sources: this._LookupsService.getSource(),
      departments: this._LookupsService.getDepartment(),
      devices: this.devicesService.getAllDevices(),
    }).subscribe({
      next: (res) => {
        // Defensive access — avoid undefined errors
        this.workTypeList = res.workTypes?.data ?? [];
        this.buildingsList = res.buildings?.data ?? [];
        this.equipments = res.equipments?.data ?? [];
        this.sources = res.sources?.data ?? [];
        this.departments = res.departments?.data ?? [];
        this.devices = res.devices?.data ?? [];

        // Patch only after everything is loaded
        if (this.data) {
          const departmentID = this.data?.department?.id;

          if (departmentID) {
            // Load engineers & technicians AFTER lookup data arrives
            forkJoin([
              this.loadEngineers(departmentID),
              this.loadTechnicians(departmentID),
            ]).subscribe({
              next: () => this.restFormWithValue(this.data),
              error: () =>
                this.toastr.error("Failed to load engineers/technicians"),
            });
          } else {
            // No department → just patch
            //  this.restFormWithValue(this.data);
          }
        }
      },
      error: () => this.toastr.error("Failed to load initial lookup lists"),
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

  // ----------------------------------------------------
  // DEVICES
  // ----------------------------------------------------
  private loadDevices(): void {
    this.devicesService.getAllDevices().subscribe({
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
