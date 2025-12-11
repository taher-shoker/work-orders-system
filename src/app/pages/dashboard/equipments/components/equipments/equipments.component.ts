import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Subject, debounceTime } from "rxjs";
import { AddEquipmentComponent } from "../add-equipment/add-equipment.component";
import { AuthService, EquipmentsService } from "../../../../../shared/services";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { BasicTableThreeComponent } from "../../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-equipments",
  templateUrl: "./equipments.component.html",
  styleUrls: ["./equipments.component.scss"],
  imports: [SharedUiModule, BasicTableThreeComponent],
})
export class EquipmentsComponent implements OnInit {
  tableResponse: any | undefined;
  tableData: any[] = [];
  pageSize: number | undefined = 5;
  page: number | undefined = 1;
  pageIndex: number = 0;
  columns: any = [];

  private subject = new Subject<any>();
  constructor(
    private _EquipmentsService: EquipmentsService,
    private spinner: NgxSpinnerService,
    private _ToastrService: ToastrService,
    public dialog: MatDialog,
    public _AuthService: AuthService,
    public router: Router,
    public route: ActivatedRoute
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
    this.getAllEquipments();
    this.subject.pipe(debounceTime(800)).subscribe({
      next: (res) => {
        this.getAllEquipments();
      },
    });
  }

  // all equipment
  getAllEquipments() {
    this.spinner.show();
    this._EquipmentsService.getEquipments().subscribe({
      next: (res) => {
        this.tableResponse = res;
        this.tableData = res?.data;
        this.spinner.hide();
      },
    });
  }

  // add equipment
  openAddEquipment() {
    const dialogRef = this.dialog.open(AddEquipmentComponent, {
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addEquipment(result);
      }
    });
  }

  addEquipment(data: FormGroup) {
    this._EquipmentsService.addEquipment(data.value).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, "Equipment Added Succesfuly");
      },
      error: (err) => {
        this._ToastrService.error(err.message, "Error in Added Equipment");
      },
      complete: () => {
        this.getAllEquipments();
      },
    });
  }

  // edit equipment
  openEditEquipment(item: any) {
    const dialogRef = this.dialog.open(AddEquipmentComponent, {
      data: item,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editEquipment(result, item.id);
      }
    });
  }

  editEquipment(data: FormGroup, id: number) {
    this._EquipmentsService.editEquipment(data.value, id).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, "Equipment Update Succesfuly");
      },
      error: (err) => {
        this._ToastrService.error(err.message, "Error in Update Equipment");
      },
      complete: () => {
        this.getAllEquipments();
      },
    });
  }

  // pagination
  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.page = e.pageIndex + 1;
    this.getAllEquipments();
  }

  // delete equipment
  deleteItem(id: number) {
    this._EquipmentsService.deleteEquipment(id).subscribe({
      next: (res) => {
        this._ToastrService.success("Equipment Deleted");
      },
      error: (err) => {
        this._ToastrService.error("Delete Equipment Failed");
      },
      complete: () => {
        this.getAllEquipments();
      },
    });
  }

  tableAction(event: { value: string; dataRow?: any }) {
    if (event.value === "edit") {
      this.openEditEquipment(event?.dataRow);
    } else if (event.value === "delete") {
      this.deleteItem(event?.dataRow.id);
    } else if (event.value === "view") {
      this.router.navigate(["./view", event?.dataRow.id], {
        relativeTo: this.route,
      });
    }
  }
}
