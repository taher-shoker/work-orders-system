import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { DevicesService } from "../../../../../shared/services";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-view-device",
  templateUrl: "./view-device.component.html",
  styleUrls: ["./view-device.component.scss"],
  imports: [SharedUiModule, CommonModule],
})
export class ViewDeviceComponent {
  currentLang = localStorage.getItem("lang");
  deviceData: any;
  deviceWork: any = [];
  deviceId: any;

  constructor(
    private _devicesService: DevicesService,
    private _ToastrService: ToastrService,
    private _activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.deviceId = _activatedRoute.snapshot.params["deviceId"];
  }

  ngOnInit(): void {
    this.getDeviceById(this.deviceId);
    this.getDeviceWorkOrder(this.deviceId);
  }
  getDeviceById(id: number) {
    this._devicesService.getDevice(id).subscribe({
      next: (res) => {
        //  this._ToastrService.success(res.message, 'Get device Succesfuly');
        this.deviceData = res.data;
      },
      error: (err) => {
        this._ToastrService.error(err.message, "Error in Fetch device");
      },
    });
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
  getDeviceWorkOrder(id: number) {
    this._devicesService.getDeviceWorkOrder(id).subscribe({
      next: (res) => {
        //this._ToastrService.success(res.message, 'Get device Succesfuly');
        this.deviceWork = res.data;
      },
      error: (err) => {
        this._ToastrService.error(err.message, "Error in Fetch device");
      },
      complete: () => {},
    });
  }

  handleNavigate(orderId: number) {
    this.router.navigate(["/dashboard/work-orders/view", orderId]);
  }
}
