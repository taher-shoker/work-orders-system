import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedUiModule } from "../../../../../../shared/components/shared-ui.module";

@Component({
  selector: "app-hold-reason",
  templateUrl: "./hold-reason.component.html",
  styleUrls: ["./hold-reason.component.scss"],
  imports: [SharedUiModule],
})
export class HoldReasonComponent implements OnInit {
  orderForm: FormGroup;
  uploadedFiles: any[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HoldReasonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orderForm = this.fb.group({
      holding_reason: ["", Validators.required],
      used_items_descriptions: ["", Validators.required],
      technician_report: [""],
      pendding_attachment: [null], // FIXED
    });
  }

  ngOnInit(): void {
    // If parent sends data → fill the form
    if (this.data) {
      this.orderForm.patchValue({
        holding_reason: this.data.holding_reason || "",
        used_items_descriptions: this.data.used_items_descriptions || "",
        technician_report: this.data.technician_report || "",
        pendding_attachment: this.data.pendding_attachment || null,
      });

      if (this.data.pendding_attachment) {
        this.uploadedFiles = this.data.pendding_attachment;
      }
    }
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      this.dialogRef.close(this.orderForm.value);
    } else {
      this.orderForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onUploadFile(files: any) {
    this.uploadedFiles = files;
    this.orderForm.get("pendding_attachment")?.setValue(this.uploadedFiles);
  }

  onDeleteFile(id: any) {
    this.uploadedFiles = this.uploadedFiles.filter((x: any) => x.id !== id);
    this.orderForm.get("pendding_attachment")?.setValue(this.uploadedFiles);
  }
}
