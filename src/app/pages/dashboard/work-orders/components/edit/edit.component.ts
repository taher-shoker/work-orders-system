import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { WorkOrdersService } from "../../../../../shared/services/work-orders.service";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { WorkOrderFormComponent } from "../work-order-form/work-order-form.component";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
  imports: [SharedUiModule, WorkOrderFormComponent],
})
export class EditComponent implements OnInit {
  orderId: string | null = null;
  currentOrder: any = null;

  constructor(
    private route: ActivatedRoute,
    private workOrdersService: WorkOrdersService,
    private toastr: ToastrService
  ) {
    this.orderId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    if (this.orderId) {
      this.loadOrderById(this.orderId);
    }
  }

  // -------------------------
  // Load existing order
  // -------------------------
  private loadOrderById(id: string): void {
    this.workOrdersService.getOrder(+id).subscribe({
      next: (res) => {
        this.currentOrder = res.data;
      },
      error: (err) => {
        this.toastr.error(err?.message || "Error loading order.");
      },
    });
  }
}
