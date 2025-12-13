import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AddDeviceModelComponent } from "./components/add-device-model/add-device-model.component";
import { FormGroup } from "@angular/forms";
import { DeviceModelService } from "../../../../../shared/services";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { BasicTableThreeComponent } from "../../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";

@Component({
  selector: "app-device-model",
  templateUrl: "./device-model.component.html",
  styleUrls: ["./device-model.component.scss"],
  imports: [SharedUiModule, BasicTableThreeComponent],
})
export class DeviceModelComponent implements OnInit {
  currentLang = localStorage.getItem("lang");

  deviceModels: any[] = [];
  filteredList: any[] = [];
  deviceModelsId: any;
  selectedModel: string | null = null;
  searchValue: string = "";
  originalTableData: any[] = [];

  columns: any = [];
  tableData: any[] = [];

  constructor(
    private deviceModelService: DeviceModelService,
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
    this.allDeviceModels();
  }

  allDeviceModels(): void {
    this.deviceModelService.getAllDeviceModel().subscribe({
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

  // add device model
  openAddDeviceModel() {
    const dialogRef = this.dialog.open(AddDeviceModelComponent, {
      width: "40%",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addDeviceModels(result);
      }
    });
  }

  addDeviceModels(data: FormGroup) {
    this.deviceModelService.addDeviceModel(data.value).subscribe({
      next: (res) => {
        this.toastrService.success(res.message, "Model Added Succesfuly");
      },
      error: (err) => {
        this.toastrService.error(err.message, "Error in Added Model");
      },
      complete: () => {
        this.allDeviceModels();
      },
    });
  }

  // edit device model
  openEditDeviceModel(item: any) {
    const dialogRef = this.dialog.open(AddDeviceModelComponent, {
      width: "40%",
      data: item,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editDeviceModel(result, item.id);
      }
    });
  }

  editDeviceModel(data: FormGroup, id: string) {
    this.deviceModelService.updateDeviceModel(data.value, id).subscribe({
      next: (res) => {
        this.toastrService.success(res.message, "Model Update Succesfuly");
      },
      error: (err) => {
        this.toastrService.error(err.message, "Error in Update Model");
      },
      complete: () => {
        this.allDeviceModels();
      },
    });
  }

  //  delete device model

  deleteModel(id: any) {
    this.deviceModelService.deleteDeviceModel(id).subscribe({
      next: (res) => {
        this.toastrService.success(res.message);
        this.allDeviceModels();
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
      },
    });
  }
  tableAction(event: { value: string; dataRow?: any }) {
    if (event.value === "edit") {
      this.openEditDeviceModel(event?.dataRow);
    } else if (event.value === "delete") {
      this.deleteModel(event?.dataRow.id);
    } else if (event.value === "add") {
      this.openAddDeviceModel();
    }
  }
}
