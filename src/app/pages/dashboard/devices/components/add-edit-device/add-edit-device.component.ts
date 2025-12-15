import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { DevicesService } from "../../../../../shared/services";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-add-edit-device",
  templateUrl: "./add-edit-device.component.html",
  styleUrls: ["./add-edit-device.component.scss"],
  imports: [SharedUiModule],
})
export class AddEditDeviceComponent implements OnInit {
  currentLang = localStorage.getItem("lang");
  deviceId!: string | null;
  isUpdatePage = false;
  hideRequiredMarker: boolean = true;

  currentDevice: any;
  uploadedFiles: any[] = [];

  // Lookup data
  departments: any;
  devicesModel: any;
  manufacturers: any;
  deviceTypes: any;
  deviceStatus: any;
  custodiansList: any;
  isRtl: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private devicesService: DevicesService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.deviceId = this.route.snapshot.paramMap.get("id");
    this.isUpdatePage = !!this.deviceId;
  }

  ngOnInit(): void {
    const language = localStorage.getItem("lang");
    if (language === "en") {
      this.isRtl = false;
    } else {
      this.isRtl = true;
    }

    if (this.isUpdatePage && this.deviceId) {
      this.getDeviceById(+this.deviceId);
    }

    this.loadLookups();
    this.getCustodians();
  }

  // Form
  deviceForm = new FormGroup({
    name_en: new FormControl(null, Validators.required),
    name_ar: new FormControl(null, Validators.required),
    description_en: new FormControl(null),
    description_ar: new FormControl(null),
    department_id: new FormControl(null, Validators.required),
    serial_number: new FormControl(null, Validators.required),
    custodians: new FormControl(null, Validators.required),
    buy_date: new FormControl(null, Validators.required),
    type_id: new FormControl(null, Validators.required),
    company_id: new FormControl(null, Validators.required),
    warranty_period: new FormControl(null, Validators.required),
    model_code: new FormControl(null, Validators.required),
    model_id: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required),
    image: new FormControl<any[]>([]),
  });
  // ---------------------------------------------
  // SUBMIT FORM
  // ---------------------------------------------
  onSubmit(): void {
    if (this.deviceForm.invalid) {
      this.toastr.warning(this.translate.instant("devices.warning"));
      return;
    }

    const formData = new FormData();

    // Append form values (skip image!)
    Object.entries(this.deviceForm.value).forEach(([key, value]) => {
      if (key === "image") return; // prevent duplication

      if (value instanceof Date) {
        formData.append(key, value.toISOString().slice(0, 10));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });

    // Append uploaded images properly
    this.uploadedFiles.forEach((fileObj) => {
      if (fileObj.file) {
        formData.append("image", fileObj.file);
      }
    });

    // Update
    if (this.isUpdatePage && this.deviceId) {
      this.devicesService.onEditDevice(formData, +this.deviceId).subscribe({
        next: () =>
          this.toastr.success(this.translate.instant("devices.edit_success")),
        error: (err) =>
          this.toastr.error(
            err.message,
            this.translate.instant("devices.edit_error")
          ),
        complete: () => this.router.navigate(["/dashboard/devices"]),
      });
      return;
    }

    // Add
    this.devicesService.addNewDevice(formData).subscribe({
      next: () =>
        this.toastr.success(this.translate.instant("devices.add_success")),
      error: (err) =>
        this.toastr.error(
          err.message,
          this.translate.instant("devices.add_error")
        ),
      complete: () => this.router.navigate(["/dashboard/devices"]),
    });
  }

  goback() {
    if (this.isUpdatePage) {
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }
  // ---------------------------------------------
  // LOAD DEVICE DATA
  // ---------------------------------------------
  private getDeviceById(id: number): void {
    this.devicesService.getDevice(id).subscribe((res) => {
      this.currentDevice = res.data;

      this.deviceForm.patchValue({
        name_en: res.data?.name,
        name_ar: res.data?.name,
        description_en: res.data?.description,
        description_ar: res.data?.description,
        department_id: res.data?.department_id,
        serial_number: res.data?.serial_number,
        buy_date: res.data?.buy_date,
        type_id: res.data?.type_id,
        company_id: res.data?.company_id,
        warranty_period: res.data?.warranty_period,
        model_code: res.data?.model_code,
        model_id: res.data?.model_id,
        status: res.data?.status,
      });

      if (typeof res.data?.image === "string") {
        const url = res.data?.image;
        const fileName = url.split("devices/")[1];

        this.uploadedFiles = [
          {
            id: fileName, // constant based on filename

            file: {
              name: fileName,
            },
          },
        ];
        this.deviceForm.get("image")?.setValue(this.uploadedFiles);
      }
    });
  }

  // ---------------------------------------------
  // LOOKUPS
  // ---------------------------------------------
  private loadLookups(): void {
    this.getDepartment();
    this.getDeviceModel();
    this.getDeviceManufacturers();
    this.getDeviceTypes();
    this.getDeviceStatus();
  }

  private getDepartment(): void {
    this.devicesService.onGetDepartment().subscribe((res) => {
      this.departments = res.data.data;
    });
  }

  private getDeviceModel(): void {
    this.devicesService.onGetDeviceModel().subscribe((res) => {
      this.devicesModel = res.data.data;
    });
  }

  private getDeviceManufacturers(): void {
    this.devicesService.onGetDeviceManufacturers().subscribe((res) => {
      this.manufacturers = res.data.data;
    });
  }

  private getDeviceTypes(): void {
    this.devicesService.onGetDeviceType().subscribe((res) => {
      this.deviceTypes = res.data.data;
    });
  }

  private getDeviceStatus(): void {
    this.devicesService.onGetDeviceStatus().subscribe((res) => {
      this.deviceStatus = res.data;
    });
  }

  private getCustodians(): void {
    this.devicesService.onGetCustodians().subscribe((res) => {
      this.custodiansList = res.data;
    });
  }

  // ---------------------------------------------
  // FILE UPLOAD HANDLERS
  // ---------------------------------------------
  onUploadFile(files: any[]): void {
    this.uploadedFiles = files;
    this.deviceForm.get("image")?.setValue(files);
  }

  onDeleteFile(id: number): void {
    this.uploadedFiles = this.uploadedFiles.filter((f) => f.id !== id);
    this.deviceForm.get("image")?.setValue(this.uploadedFiles);
  }

  // ---------------------------------------------
  // CONFIRM DIALOG
  // ---------------------------------------------
  openConfirm(): void {
    // this.dialog.open(ConfirmDialogComponent, { width: "40%" });
  }
}
