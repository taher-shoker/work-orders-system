import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { SharedUiModule } from "../../../../../../../shared/components/shared-ui.module";

@Component({
  selector: "app-add-device-model",
  templateUrl: "./add-device-model.component.html",
  styleUrls: ["./add-device-model.component.scss"],
  imports: [SharedUiModule, TranslateModule],
})
export class AddDeviceModelComponent {
  constructor(
    public dialogRef: MatDialogRef<AddDeviceModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  isEditing: boolean = false;

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(this.deviceModalForm);
  }
  ngOnInit(): void {
    if (this.data) {
      this.isEditing = true;
      this.deviceModalForm.patchValue({
        name_en: this.data?.name_en,
        name_ar: this.data?.name_ar,
      });
    } else {
      this.isEditing = false;
    }
  }
  deviceModalForm = new FormGroup({
    name_en: new FormControl(null),
    name_ar: new FormControl(null),
    status: new FormControl(null),
  });
}
