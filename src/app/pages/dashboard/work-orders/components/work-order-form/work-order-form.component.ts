import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  ReportsService,
  LookupsService,
  WorkOrdersService,
  AuthService,
  HelperService,
  DevicesService,
} from "../../../../../shared/services";
import { forkJoin, Observable, tap } from "rxjs";

@Component({
  selector: "app-work-order-form",
  templateUrl: "./work-order-form.component.html",
  standalone: true,
  imports: [SharedUiModule],
})
export class WorkOrderFormComponent implements OnInit, OnChanges {
  @Input() workOrderData: any = null;

  // -----------------------------
  // STATE
  // -----------------------------
  isRtl = false;
  isEditing = false;
  orderId: number | null = null;
  data: any;
  currentDate = new Date();
  // -----------------------------
  // LOOKUPS (ALWAYS ARRAYS)
  // -----------------------------
  departments: any[] = [];
  engineers: any[] = [];
  technicians: any[] = [];
  workTypeList: any[] = [];
  buildingsList: any[] = [];
  equipments: any[] = [];
  sources: any[] = [];
  devices: any[] = [];

  uploadedFiles: any[] = [];

  // -----------------------------
  // FORM
  // -----------------------------
  orderForm!: FormGroup;

  constructor(
    private lookupsService: LookupsService,
    private workOrdersService: WorkOrdersService,
    private helperService: HelperService,
    private devicesService: DevicesService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public authService: AuthService,
  ) {
    const id = this.route.snapshot.paramMap.get("id");
    this.orderId = id ? +id : null;
  }

  // -----------------------------
  // LIFECYCLE
  // -----------------------------
  ngOnInit(): void {
    this.isRtl = localStorage.getItem("lang") !== "en";
    this.initOrderForm();
    this.orderForm.get("start_date")?.disable();
    this.loadLookupsAndPatch();
    this.loadDevices();
    this.checkIsAdmin();
    this.orderForm.get("department_id")?.valueChanges.subscribe((id) => {
      this.disableFields();
      if (id) {
        forkJoin([
          this.loadEngineers(id),
          this.loadTechnicians(id),
        ]).subscribe();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["workOrderData"]?.currentValue) {
      this.data = changes["workOrderData"].currentValue;
      this.isEditing = true;
    }
  }
  getuserName() {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.orderForm.get("customer_name")?.setValue(user.name);
      }
    });
  }
  checkIsAdmin() {
    this.getuserName();
    if (!this.authService.isAdmin()) {
      this.orderForm.get("customer_name")?.disable();
    }
  }
  // -----------------------------
  // FORM INIT
  // -----------------------------
  private initOrderForm(): void {
    this.orderForm = this.fb.group({
      start_date: this.fb.control<Date>(new Date(), Validators.required),
      start_time: this.fb.control(new Date().toTimeString().split(" ")[0]),
      priority: this.fb.control("high"),
      type: this.fb.control("maintenance"),

      department_id: this.fb.control<number | null>(null, Validators.required),
      engineer_id: this.fb.control<number | null>(
        { value: null, disabled: true },
        Validators.required,
      ),
      technician_id: this.fb.control<number | null>(
        { value: null, disabled: true },
        Validators.required,
      ),

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

  // -----------------------------
  // PATCH FORM
  // -----------------------------
  private patchForm(data: any): void {
    this.orderForm.patchValue({
      start_date: data?.start_date ? new Date(data.start_date) : null,
      start_time: data?.start_time,
      department_id: data?.department?.id ?? null,
      engineer_id: data?.engineer?.id ?? null,
      technician_id: data?.technician?.id ?? null,
      work_type_id: data?.work_type?.id ?? null,
      building_id: data?.building?.id ?? null,
      floor_no: data?.floor_no ?? null,
      room_no: data?.room_no ?? null,
      customer_name: data?.customer_name ?? null,
      customer_phone: data?.customer_phone ?? null,
      equipment_id: data?.equipment?.id ?? null,
      source_id: data?.source?.id ?? null,
      description: data?.description ?? null,
      priority: data?.priority ?? "high",
      type: data?.type ?? "maintenance",
    });

    if (typeof data?.attachment === "string") {
      const name = data.attachment.split("attachment/")[1];
      this.uploadedFiles = [{ id: name, file: { name } }];
      this.orderForm.get("attachment")?.setValue(this.uploadedFiles);
    }
  }

  // -----------------------------
  // LOOKUPS
  // -----------------------------
  private loadLookupsAndPatch(): void {
    forkJoin({
      workTypes: this.lookupsService.getWork_type(),
      buildings: this.lookupsService.getbuilding(),
      equipments: this.lookupsService.getEquipment(),
      sources: this.lookupsService.getSource(),
      departments: this.lookupsService.getDepartment(),
    }).subscribe({
      next: (res) => {
        this.workTypeList = res.workTypes?.data ?? [];
        this.buildingsList = res.buildings?.data ?? [];
        this.equipments = res.equipments?.data ?? [];
        this.sources = res.sources?.data ?? [];
        this.departments = res.departments?.data ?? [];

        if (this.data?.department?.id) {
          forkJoin([
            this.loadEngineers(this.data.department.id),
            this.loadTechnicians(this.data.department.id),
          ]).subscribe(() => this.patchForm(this.data));
        }
      },
      error: () => this.toastr.error("Failed to load lookup data"),
    });
  }

  // -----------------------------
  // ENGINEERS / TECHNICIANS
  // -----------------------------
  private loadEngineers(id: number): Observable<any> {
    return this.helperService.getEngineers(id).pipe(
      tap((res) => {
        this.engineers = res?.data ?? [];
        if (this.engineers.length) this.orderForm.get("engineer_id")?.enable();
      }),
    );
  }

  private loadTechnicians(id: number): Observable<any> {
    return this.helperService.getTechnicians(id).pipe(
      tap((res) => {
        this.technicians = res?.data ?? [];
        if (this.technicians.length)
          this.orderForm.get("technician_id")?.enable();
      }),
    );
  }

  private disableFields(): void {
    this.orderForm.get("engineer_id")?.disable();
    this.orderForm.get("technician_id")?.disable();
  }

  // -----------------------------
  // DEVICES
  // -----------------------------
  private loadDevices(): void {
    this.devicesService.getAllDevices().subscribe({
      next: (res) => (this.devices = res?.data.data ?? []),
      error: () => this.toastr.error("Failed to load devices"),
    });
  }

  // -----------------------------
  // SUBMIT
  // -----------------------------
  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const values = this.orderForm.getRawValue();

    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString().slice(0, 10));
      } else if (key !== "attachment" && value && value !== null) {
        formData.append(key, value.toString());
      }
    });

    this.uploadedFiles.forEach((f) => formData.append("attachment", f.file));

    this.orderId ? this.updateOrder(formData) : this.createOrder(formData);
  }

  private createOrder(formData: FormData): void {
    this.workOrdersService.addNewOrder(formData).subscribe({
      next: () => {
        this.toastr.success("Work order added successfully");
        this.router.navigate(["/dashboard/work-orders"]);
      },
      error: (e) => this.toastr.error(e?.error?.message || "Error"),
    });
  }

  private updateOrder(formData: FormData): void {
    this.workOrdersService.editOrder(formData, this.orderId!).subscribe({
      next: () => {
        this.toastr.success("Work order updated successfully");
        this.router.navigate(["/dashboard/work-orders"]);
      },
      error: (e) => this.toastr.error(e?.error?.message || "Error"),
    });
  }

  goback() {
    if (this.isEditing) {
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }
  // -----------------------------
  // FILES
  // -----------------------------
  onUploadFile(files: any[]): void {
    this.uploadedFiles = files;
    this.orderForm.get("attachment")?.setValue(files);
  }

  onDeleteFile(id: number): void {
    this.uploadedFiles = this.uploadedFiles.filter((f) => f.id !== id);
    this.orderForm.get("attachment")?.setValue(this.uploadedFiles);
  }
}
