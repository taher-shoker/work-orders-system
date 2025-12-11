import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { SharedUiModule } from "../../../../../../../shared/components/shared-ui.module";

@Component({
  selector: "app-add-device-type",
  templateUrl: "./add-device-type.component.html",
  styleUrls: ["./add-device-type.component.scss"],
  imports: [SharedUiModule, TranslateModule],
})
export class AddDeviceTypeComponent {
  isEditing: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddDeviceTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    this.dialogRef.close(this.deviceTypeForm);
  }
  ngOnInit(): void {
    if (this.data) {
      this.isEditing = true;
      this.deviceTypeForm.patchValue({
        name_en: this.data?.name_en,
        name_ar: this.data?.name_ar,
      });
    } else {
      this.isEditing = false;
    }
  }
  deviceTypeForm = new FormGroup({
    name_en: new FormControl(null),
    name_ar: new FormControl(null),
    status: new FormControl(null),
  });
}
