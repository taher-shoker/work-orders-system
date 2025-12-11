import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";

@Component({
  selector: "app-add-equipment",
  templateUrl: "./add-equipment.component.html",
  styleUrls: ["./add-equipment.component.scss"],
  imports: [SharedUiModule],
})
export class AddEquipmentComponent implements OnInit {
  isEditing: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddEquipmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    this.dialogRef.close(this.equipmentForm);
  }
  ngOnInit(): void {
    if (this.data) {
      this.isEditing = true;
      this.equipmentForm.patchValue({
        name_en: this.data?.name_en,
        name_ar: this.data?.name_ar,
      });
    }
  }

  equipmentForm = new FormGroup({
    name_en: new FormControl(null, [Validators.required]),
    name_ar: new FormControl(null, [Validators.required]),
  });
}
