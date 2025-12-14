import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { debounceTime, Subject } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AddBuildingComponent } from "../add-building/add-building.component";
import { AuthService, BuildingService } from "../../../../../shared/services";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { BasicTableThreeComponent } from "../../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-building",
  templateUrl: "./building.component.html",
  styleUrls: ["./building.component.scss"],
  imports: [SharedUiModule, BasicTableThreeComponent],
})
export class BuildingComponent {
  tableResponse: any | undefined;
  tableData: any[] = [];
  pageSize: number | undefined = 5;
  page: number | undefined = 1;
  pageIndex: number = 0;
  buildingData: any;
  columns: any = [];
  originalTableData: any[] = [];

  private subject = new Subject<any>();
  constructor(
    private _BuildingService: BuildingService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private _ToastrService: ToastrService,
    public _AuthService: AuthService,
    public router: Router,
    public route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.columns = [
      { header: "building.name_en", field: "name_en", type: "text" },
      {
        header: "building.name_ar",
        field: "name_ar",
        type: "text",
      },
      { header: "building.no_of_floors", field: "no_of_floors", type: "text" },

      { header: "", field: "action", type: "action" },
    ];

    this.getAllBuildings();
    this.subject.pipe(debounceTime(800)).subscribe({
      next: (res) => {
        this.getAllBuildings();
      },
    });
  }
  // all buildings
  getAllBuildings() {
    this.spinner.show();
    this._BuildingService.getBuildings(1).subscribe({
      next: (res) => {
        this.tableResponse = res.data.total;
        this.tableData = res?.data.data;
        this.originalTableData = [...this.tableData];
        this.spinner.hide();
      },
    });
  }

  /** ✅ Handle pagination change */
  onPageChange(event: number): void {
    this._BuildingService.getBuildings(event).subscribe({
      next: (res) => {
        this.tableResponse = res.data.total;
        this.tableData = res?.data.data;
        this.originalTableData = [...this.tableData];
        this.spinner.hide();
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
  // add building
  openAddBuilding() {
    const dialogRef = this.dialog.open(AddBuildingComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addBuilding(result);
      }
    });
  }

  addBuilding(data: FormGroup) {
    this._BuildingService.addBuilding(data.value).subscribe({
      next: (res) => {
        this._ToastrService.success(
          res.message,
          this.translate.instant("building.add_success")
        );
      },
      error: (err) => {
        this._ToastrService.error(
          err.message,
          this.translate.instant("building.add_error")
        );
      },
      complete: () => {
        this.getAllBuildings();
      },
    });
  }

  // edit building
  openEditBuilding(item: any) {
    const dialogRef = this.dialog.open(AddBuildingComponent, {
      data: item,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editBuilding(result, item.id);
      }
    });
  }

  editBuilding(data: FormGroup, id: number) {
    this._BuildingService.editBuilding(data.value, id).subscribe({
      next: (res) => {
        this._ToastrService.success(
          res.message,
          this.translate.instant("building.edit_success")
        );
      },
      error: (err) => {
        this._ToastrService.error(
          err.message,
          this.translate.instant("building.edit_error")
        );
      },
      complete: () => {
        this.getAllBuildings();
      },
    });
  }

  // pagination
  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.page = e.pageIndex + 1;
    this.getAllBuildings();
  }

  // delete building

  deleteItem(id: number) {
    this._BuildingService.deleteBuilding(id).subscribe({
      next: (res) => {
        this._ToastrService.success(
          this.translate.instant("building.delete_success")
        );
      },
      error: (err) => {
        this._ToastrService.error(
          this.translate.instant("building.delete_error")
        );
      },
      complete: () => {
        this.getAllBuildings();
      },
    });
  }
  tableAction(event: { value: string; dataRow?: any }) {
    if (event.value === "edit") {
      this.openEditBuilding(event.dataRow);
    } else if (event.value === "delete") {
      this.deleteItem(event.dataRow.id);
    } else if (event.value === "view") {
      this.router.navigate(["./view", event.dataRow.id], {
        relativeTo: this.route,
      });
    }
  }
}
