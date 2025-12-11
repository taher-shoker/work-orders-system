import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";

@Component({
  selector: "app-add-building",
  templateUrl: "./add-building.component.html",
  styleUrls: ["./add-building.component.scss"],
  imports: [SharedUiModule],
})
export class AddBuildingComponent implements OnInit {
  isEditing: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddBuildingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    if (this.data) {
      this.isEditing = true;
      this.buildingForm.patchValue({
        name_en: this.data?.name_en,
        name_ar: this.data?.name_ar,
        no_of_floors: this.data?.no_of_floors,
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    this.dialogRef.close(this.buildingForm);
  }

  buildingForm = new FormGroup({
    name_en: new FormControl(null, [Validators.required]),
    name_ar: new FormControl(null, [Validators.required]),
    no_of_floors: new FormControl(null, [Validators.required]),
  });
}
