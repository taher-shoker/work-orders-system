import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { SharedUiModule } from "../../../../../../../shared/components/shared-ui.module";

@Component({
  selector: "app-add-company",
  templateUrl: "./add-company.component.html",
  styleUrls: ["./add-company.component.scss"],
  imports: [SharedUiModule, TranslateModule],
})
export class AddCompanyComponent {
  isEditing: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    this.dialogRef.close(this.manufacturersForm);
  }
  ngOnInit(): void {
    if (this.data) {
      this.isEditing = true;
      this.manufacturersForm.patchValue({
        name_en: this.data?.name_en,
        name_ar: this.data?.name_ar,
      });
    }
  }
  manufacturersForm = new FormGroup({
    name_en: new FormControl(null),
    name_ar: new FormControl(null),
    status: new FormControl(0),
  });
}
