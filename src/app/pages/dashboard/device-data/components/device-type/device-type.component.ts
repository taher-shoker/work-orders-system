import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { AddDeviceTypeComponent } from "./components/add-device-type/add-device-type.component";
import { FormGroup } from "@angular/forms";
import { DeviceTypeService } from "../../../../../shared/services";
import { BasicTableThreeComponent } from "../../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";

@Component({
  selector: "app-device-type",
  templateUrl: "./device-type.component.html",
  styleUrls: ["./device-type.component.scss"],
  imports: [SharedUiModule, BasicTableThreeComponent],
})
export class DeviceTypeComponent implements OnInit {
  deviceTypes: any[] = [];
  filteredList: any[] = [];
  deviceTypesId: any;
  selectedType: string | null = null;
  searchValue: string = "";
  originalTableData: any[] = [];

  columns: any = [];
  tableData: any[] = [];
  constructor(
    private deviceTypeService: DeviceTypeService,
    private toastrService: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.columns = [
      { header: "equipments.name_en", field: "name_en", type: "text" },
      {
        header: "equipments.name_ar",
        field: "name_ar",
        type: "text",
      },

      { header: "", field: "action", type: "action" },
    ];
    this.allDeviceTypes();
  }

  allDeviceTypes(): void {
    this.deviceTypeService.getAllDeviceType().subscribe({
      next: (res) => {
        this.tableData = res.data;
        this.originalTableData = [...this.tableData];
      },
    });
  }
    // search
  handleSearch(value: string) {
    this.tableData = this.originalTableData.filter(
      (item) =>
        item.name_ar.toLowerCase().includes(value.toLowerCase()) ||
        item.name_en.toLowerCase().includes(value.toLowerCase())
    );
  }
  // add device Type
  openAddDeviceType() {
    const dialogRef = this.dialog.open(AddDeviceTypeComponent, {
      width: "40%",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addDeviceType(result);
      }
    });
  }

  addDeviceType(data: FormGroup) {
    this.deviceTypeService.addDeviceType(data.value).subscribe({
      next: (res) => {
        this.toastrService.success(res.message, "Device Type Added Succesfuly");
      },
      error: (err) => {
        this.toastrService.error(err.message, "Error in Added Device Type");
      },
      complete: () => {
        this.allDeviceTypes();
      },
    });
  }

  // edit device Type
  openEditDeviceType(item: any) {
    const dialogRef = this.dialog.open(AddDeviceTypeComponent, {
      width: "40%",
      data: item,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editDeviceType(result, item.id);
      }
    });
  }

  editDeviceType(data: FormGroup, id: string) {
    this.deviceTypeService.updateDeviceType(data.value, id).subscribe({
      next: (res) => {
        this.toastrService.success(
          res.message,
          "Device Type Update Succesfuly"
        );
      },
      error: (err) => {
        this.toastrService.error(err.message, "Error in Update Device Type");
      },
      complete: () => {
        this.allDeviceTypes();
      },
    });
  }

  //  delete device Type

  deleteType(id: any) {
    this.deviceTypeService.deleteDeviceType(id).subscribe({
      next: (res) => {
        this.toastrService.success(res.message);
        this.allDeviceTypes();
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
      },
    });
  }

  tableAction(event: { value: string; dataRow?: any }) {
    if (event.value === "edit") {
      this.openEditDeviceType(event?.dataRow);
    } else if (event.value === "delete") {
      this.deleteType(event?.dataRow.id);
    } else if (event.value === "add") {
      this.openAddDeviceType();
    }
  }
}
