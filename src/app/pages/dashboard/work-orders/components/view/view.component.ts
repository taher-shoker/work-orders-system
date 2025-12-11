import { Component, Inject, ViewChild, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { VerifyCodeComponent } from "./verify-code/verify-code.component";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { NgOtpInputComponent } from "ng-otp-input";
import { HoldReasonComponent } from "./hold-reason/hold-reason.component";
import { RejectReasonComponent } from "./reject-reason/reject-reason.component";
import { AuthService } from "../../../../../shared/services/auth.service";
import { WorkOrdersService } from "../../../../../shared/services/work-orders.service";
import { SidebarService } from "../../../../../shared/services/sidebar.service";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
  imports: [SharedUiModule, CommonModule],
})
export class ViewComponent implements OnInit {
  @ViewChild(NgOtpInputComponent, { static: false })
  ngOtpInput!: NgOtpInputComponent;

  orderData: any;
  materialTableData: any[] = [];
  spareTableData: any[] = [];
  orderId: string | null;
  btnsToShow: number[] = [];
  isMobileOpen$: any;

  constructor(
    private workOrdersService: WorkOrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private dialog: MatDialog,
    public sidebarService: SidebarService
  ) {
    this.orderId = this.route.snapshot.paramMap.get("id");
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  ngOnInit(): void {
    if (this.orderId) {
      this.getOrderById(+this.orderId);
      this.getOrderMaterial(+this.orderId);
      this.getOrderParts(+this.orderId);
    }
    this.route.paramMap.subscribe((params) => {
      const newOrderId = params.get("id");

      // If newOrderId exists and is different from the current orderId
      if (newOrderId && newOrderId !== String(this.orderId)) {
        this.orderId = newOrderId;
        this.getOrderById(+this.orderId); // Fetch the order when the URL parameter changes
      }
    });
  }

  /** 🔹 Fetch order by ID */
  private getOrderById(id: number): void {
    this.workOrdersService.getOrder(id).subscribe({
      next: (res) => {
        this.orderData = res.data;
        this.canShowButton();
      },
      error: (err) => this.toastr.error(err.message, "Error fetching order"),
    });
  }

  /** 🔹 Fetch materials */
  private getOrderMaterial(id: number): void {
    this.workOrdersService.getMaterialByOrderId(id).subscribe({
      next: (res) => (this.materialTableData = res.data),
      error: (err) =>
        this.toastr.error(err.message, "Error fetching materials"),
    });
  }

  /** 🔹 Fetch parts */
  private getOrderParts(id: number): void {
    this.workOrdersService.getPartsByOrderId(id).subscribe({
      next: (res) => (this.spareTableData = res.data),
      error: (err) => this.toastr.error(err.message, "Error fetching parts"),
    });
  }

  /** 🔹 Determine which buttons to show */
  private canShowButton(): void {
    const status = this.orderData?.status?.id;
    const isAdmin = this.authService.isAdmin();

    switch (status) {
      case 1:
      case 2:
        this.btnsToShow = isAdmin ? [8] : [3];
        break;
      case 3:
        this.btnsToShow = isAdmin ? [] : [4, 5];
        break;
      case 4:
        this.btnsToShow = isAdmin ? [] : [3];
        break;
      case 5:
        this.btnsToShow = isAdmin ? [13, 7] : [];
        break;
      case 13:
        this.btnsToShow = isAdmin ? [] : [6];
        break;
      case 7:
        this.btnsToShow = isAdmin ? [] : [3];
        break;
      default:
        this.btnsToShow = [];
        break;
    }
  }

  /** 🔹 Handle button actions */
  onAction(actionId: number): void {
    if (!this.orderId) return;
    const orderId = +this.orderId;
    const status = this.orderData?.status?.id;
    const isAdmin = this.authService.isAdmin();
    switch (status) {
      case 1:
      case 2:
      case 3:
      case 7:
        if (isAdmin && actionId === 8) {
          this.updateWorkOrderStatus(orderId, actionId);
        } else if (!isAdmin) {
          actionId === 4
            ? this.openHoldReasonDialog(orderId, actionId)
            : this.updateWorkOrderStatus(orderId, actionId);
        }
        break;

      case 4:
        if (!isAdmin) this.updateWorkOrderStatus(orderId, actionId);
        break;

      case 5:
        if (isAdmin) {
          actionId === 7
            ? this.openRejectReasonDialog(orderId, actionId)
            : this.updateWorkOrderStatus(orderId, actionId);
        } else {
          this.updateWorkOrderStatus(orderId, actionId);
        }
        break;

      case 13:
        this.openVerifyDialog(orderId, actionId);
        break;

      default:
        break;
    }
  }

  /** 🔹 Get translated label key by status ID */
  getLabel(statusId: number): string {
    const statusLabels: Record<number, string> = {
      3: "status.in_progress",
      4: "status.on_hold",
      5: "status.completed",
      6: "status.closed",
      7: "status.rejected",
      8: "status.cancelled",
      13: "status.close_confirmed",
    };

    return statusLabels[statusId] || "status.unknown";
  }
  /** 🔹 Generate dynamic success message based on actionId */
  private getActionMessage(actionId: number): string {
    const messages: Record<number, string> = {
      3: "Order started successfully",
      4: "Order placed on hold successfully",
      5: "Order completed successfully",
      6: "Order closed successfully",
      7: "Order rejected successfully",
      8: "Order assigned successfully",
      13: "Order close confirmed successfully",
    };

    return messages[actionId] || "Order updated successfully";
  }
  /** 🔹 Service calls */
  private updateWorkOrderStatus(orderId: number, statusId: number): void {
    const formData = new FormData();
    formData.append("status", statusId.toString());

    this.workOrdersService.updateStatusOrder(orderId, formData).subscribe({
      next: () => {
        this.toastr.success(this.getActionMessage(statusId));
        this.router.navigate(["/dashboard/work-orders"]);
      },
      error: () => this.toastr.error("Failed to update order"),
    });
  }

  private openVerifyDialog(orderId: number, statusId: number): void {
    const dialogRef = this.dialog.open(VerifyCodeComponent, {
      width: this.isMobileOpen$ ? "95%" : "40%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result?.otp) return;

      const formData = new FormData();
      formData.append("status", statusId.toString());
      formData.append("confirm_code", result.otp);

      this.workOrdersService.updateStatusOrder(orderId, formData).subscribe({
        next: () => {
          this.toastr.success(this.getActionMessage(statusId));
          this.router.navigate(["/dashboard/work-orders"]);
        },
        error: () => this.toastr.error("Failed to verify order"),
      });
    });
  }

  private openHoldReasonDialog(orderId: number, statusId: number): void {
    const dialogRef = this.dialog.open(HoldReasonComponent, {
      width: this.isMobileOpen$ ? "95%" : "50%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const formData = new FormData();
      formData.append("holding_reason", result.holding_reason);
      formData.append(
        "used_items_descriptions",
        result.used_items_descriptions
      );
      formData.append("technician_report", result.technician_report);
      formData.append("status", statusId.toString());

      // Append files (with id if needed)
      const files: { id: number; file: File }[] =
        result.pendding_attachment || [];
      files.forEach((f) => formData.append("pendding_attachment", f.file));
      this.workOrdersService.updateStatusOrder(orderId, formData).subscribe({
        next: () => {
          this.toastr.success(this.getActionMessage(statusId));
          this.router.navigate(["/dashboard/work-orders"]);
        },
        error: () => this.toastr.error("Failed to hold order"),
      });
    });
  }

  private openRejectReasonDialog(orderId: number, statusId: number): void {
    const dialogRef = this.dialog.open(RejectReasonComponent, {
      width: this.isMobileOpen$ ? "95%" : "50%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const formData = new FormData();
      formData.append("rejection_reason", result.rejection_reason);
      formData.append("status", statusId.toString());

      // Append files (with id if needed)
      const files: { id: number; file: File }[] =
        result.rejection_attachment || [];
      files.forEach((f) => formData.append("rejection_attachment", f.file));
      this.workOrdersService.updateStatusOrder(orderId, formData).subscribe({
        next: () => {
          this.toastr.success(this.getActionMessage(statusId));
          this.router.navigate(["/dashboard/work-orders"]);
        },
        error: () => this.toastr.error("Failed to hold order"),
      });
    });
  }
}
