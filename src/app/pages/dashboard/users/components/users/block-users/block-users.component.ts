import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SharedUiModule } from "../../../../../../shared/components/shared-ui.module";

@Component({
  selector: "app-block-users",
  templateUrl: "./block-users.component.html",
  styleUrls: ["./block-users.component.scss"],
  imports: [SharedUiModule],
})
export class BlockUsersComponent implements OnInit {
  isRtl: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<BlockUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  submitDialog(id: number) {
    this.dialogRef.close(id);
  }
  ngOnInit() {
    const language = localStorage.getItem("lang");
    if (language === "en") {
      this.isRtl = false;
    } else {
      this.isRtl = true;
    }
  }
}
