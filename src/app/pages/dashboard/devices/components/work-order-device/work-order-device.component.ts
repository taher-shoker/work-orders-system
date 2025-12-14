import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { forkJoin, tap } from "rxjs";
import {
  LookupsService,
  WorkOrdersService,
  HelperService,
  DevicesService,
  AuthService,
} from "../../../../../shared/services";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";

@Component({
  selector: "app-work-order-device",
  templateUrl: "./work-order-device.component.html",
  imports: [SharedUiModule],
})
export class WorkOrderDeviceComponent implements OnInit {
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
  deviceId: any;
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
    private toastr: ToastrService,
    private _devicesService: DevicesService,
    private translate: TranslateService
  ) {
    this.deviceId = this.route.snapshot.paramMap.get("deviceId");
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
      description: data?.description ?? "",
      priority: this.departments?.priority ?? "high",
      type: data?.type_id ?? "maintenance",
      device_id: data.id,
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
    this.orderForm.get("department_id")?.disable();
    this.orderForm.get("description")?.disable();
    this.orderForm.get("device_id")?.disable();

    if (this.deviceId) {
      this.getDeviceById(this.deviceId);
    }
    this.loadLookupsAndThenPatch();
    this.loadDevices();
  }

  getDeviceById(id: number) {
    this._devicesService.getDevice(id).subscribe({
      next: (res) => {
        this.data = res.data;
      },
      error: (err) => {
        this.toastr.error(err.message, this.translate.instant("devices.work_error1"));
      },
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

    this.addNewOrder(formData);
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
        this.toastr.success(this.translate.instant("devices.work_add"));
        this.router.navigate(["/dashboard/work-orders"]);
      },
      error: (err) => this.toastr.error(err.error?.message || this.translate.instant("devices.work_error2")),
    });
  }

  // ----------------------------------------------------
  // UPDATE
  // ----------------------------------------------------

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
        this.workTypeList = res.workTypes?.data ?? [];
        this.buildingsList = res.buildings?.data ?? [];
        this.equipments = res.equipments?.data ?? [];
        this.sources = res.sources?.data ?? [];
        this.departments = res.departments?.data ?? [];
        this.devices = res.devices?.data ?? [];

        if (this.data) {
          const departmentID = this.data?.department?.id;
          if (departmentID) {
            // Wait for both engineers and technicians to load
            forkJoin({
              engineers: this.loadEngineers(departmentID),
              technicians: this.loadTechnicians(departmentID),
            }).subscribe({
              next: () => this.restFormWithValue(this.data),
              error: () =>
                this.toastr.error(this.translate.instant("devices.work_error3")),
            });
          } else {
            this.restFormWithValue(this.data);
          }
        }
      },
      error: () => this.toastr.error(this.translate.instant("devices.work_error4")),
    });
  }

  private loadEngineers(id: number) {
    this.disableFields();
    return this.helperService.getEngineers(id).pipe(
      tap((res) => {
        this.engineers = res.data ?? [];
        this.enableFields();
      })
    );
  }

  private loadTechnicians(id: number) {
    this.disableFields();
    return this.helperService.getTechnicians(id).pipe(
      tap((res) => {
        this.technicians = res.data ?? [];
        this.enableFields();
      })
    );
  }

  // ----------------------------------------------------
  // DEVICES
  // ----------------------------------------------------
  private loadDevices(): void {
    this.devicesService.getAllDevices().subscribe({
      next: (res) => (this.devices = res.data),
      error: () => this.toastr.error(this.translate.instant("devices.work_error5")),
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
