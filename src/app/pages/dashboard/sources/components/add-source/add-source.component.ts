import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";

@Component({
  selector: "app-add-source",
  templateUrl: "./add-source.component.html",
  styleUrls: ["./add-source.component.scss"],
  imports: [SharedUiModule],
})
export class AddSourceComponent implements OnInit {
  isEditing: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddSourceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    if (this.data) {
      this.isEditing = true;
      this.sourcesForm.patchValue({
        name_en: this.data?.name_en,
        name_ar: this.data?.name_ar,
      });
    }
  }
  onSubmit() {
    this.dialogRef.close(this.sourcesForm);
  }
  sourcesForm = new FormGroup({
    name_en: new FormControl(null, [Validators.required]),
    name_ar: new FormControl(null, [Validators.required]),
  });
}
