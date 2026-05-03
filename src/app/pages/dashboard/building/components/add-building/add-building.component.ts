import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
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

  buildingForm = new FormGroup({
    name_en: new FormControl(null, [Validators.required]),
    name_ar: new FormControl(null, [Validators.required]),
    no_of_floors: new FormArray([]), // FormArray instead of single FormControl
  });

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
      });

      // populate FormArray
      const floors = this.data?.no_of_floors || [];
      floors.forEach((floor: any) => this.addFloor(floor));
    } else {
      // initialize with one floor input
      this.addFloor();
    }
  }

  get noOfFloors(): FormArray {
    return this.buildingForm.get("no_of_floors") as FormArray;
  }

  addFloor(value: number | null = null) {
    this.noOfFloors.push(
      new FormControl(value, [Validators.required, Validators.min(1)])
    );
  }

  removeFloor(index: number) {
    this.noOfFloors.removeAt(index);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.buildingForm.valid) {
      this.dialogRef.close(this.buildingForm.value);
    }
  }
}
