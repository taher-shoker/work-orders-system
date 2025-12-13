import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AddCompanyComponent } from "./components/add-company/add-company.component";
import { MatDialog } from "@angular/material/dialog";
import { FormGroup } from "@angular/forms";
import { ManufacturersService } from "../../../../../shared/services";
import { BasicTableThreeComponent } from "../../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";

@Component({
  selector: "app-manufacturers",
  templateUrl: "./manufacturers.component.html",
  styleUrls: ["./manufacturers.component.scss"],
  imports: [SharedUiModule, BasicTableThreeComponent],
})
export class ManufacturersComponent implements OnInit {
  companies: any[] = [];
  filteredList: any[] = [];
  ManufacturersId: any;
  selectedCompany: string | null = null;
  searchValue: string = "";
  columns: any = [];
  tableData: any[] = [];
  originalTableData: any[] = [];
  constructor(
    private manufacturersService: ManufacturersService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    public dialog: MatDialog
  ) {
    this.ManufacturersId = activatedRoute.snapshot.paramMap.get("id");
    console.log(this.ManufacturersId);
  }

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
    this.allManufacturers();
  }

  allManufacturers(): void {
    this.manufacturersService.getAllManufacturers().subscribe({
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

  // add manufacturer
  openAddManufacturer() {
    const dialogRef = this.dialog.open(AddCompanyComponent, {
      width: "40%",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addManufacturers(result);
      }
    });
  }

  addManufacturers(data: FormGroup) {
    this.manufacturersService.addManufacturers(data.value).subscribe({
      next: (res) => {
        this.toastrService.success(res.message, "Company Added Succesfuly");
      },
      error: (err) => {
        this.toastrService.error(err.message, "Error in Added Company");
      },
      complete: () => {
        this.allManufacturers();
      },
    });
  }

  // edit manufacturer
  openEditManufacturer(item: any) {
    const dialogRef = this.dialog.open(AddCompanyComponent, {
      width: "40%",
      data: item,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editManufacturers(result, item.id);
      }
    });
  }

  editManufacturers(data: FormGroup, id: string) {
    this.manufacturersService.updateManufacturers(data.value, id).subscribe({
      next: (res) => {
        this.toastrService.success(res.message, "Company Update Succesfuly");
      },
      error: (err) => {
        this.toastrService.error(err.message, "Error in Update Company");
      },
      complete: () => {
        this.allManufacturers();
      },
    });
  }

  //  delete manufacturer
  deleteCompany(id: any) {
    this.manufacturersService.deleteManufacturers(id).subscribe({
      next: (res) => {
        this.toastrService.success(res.message);
        this.allManufacturers();
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
      },
    });
  }

  tableAction(event: { value: string; dataRow?: any }) {
    if (event.value === "edit") {
      this.openEditManufacturer(event?.dataRow);
    } else if (event.value === "delete") {
      this.deleteCompany(event?.dataRow.id);
    } else if (event.value === "add") {
      this.openAddManufacturer();
    }
  }
}
