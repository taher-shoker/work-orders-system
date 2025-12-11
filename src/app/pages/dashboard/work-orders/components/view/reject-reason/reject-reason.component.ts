import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedUiModule } from "../../../../../../shared/components/shared-ui.module";
@Component({
  selector: "app-reject-reason",
  templateUrl: "./reject-reason.component.html",
  styleUrls: ["./reject-reason.component.scss"],
  imports: [SharedUiModule],
})
export class RejectReasonComponent implements OnInit {
  orderForm: FormGroup;
  uploadedFiles: any[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RejectReasonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orderForm = this.fb.group({
      rejection_reason: ["", Validators.required],
      rejection_attachment: [null], // FIXED
    });
  }

  ngOnInit(): void {
    // If parent sends data → fill the form
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
    this.orderForm.get("rejection_attachment")?.setValue(this.uploadedFiles);
  }

  onDeleteFile(id: any) {
    this.uploadedFiles = this.uploadedFiles.filter((x: any) => x.id !== id);
    this.orderForm.get("rejection_attachment")?.setValue(this.uploadedFiles);
  }
}
