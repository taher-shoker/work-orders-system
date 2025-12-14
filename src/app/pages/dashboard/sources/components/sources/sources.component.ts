import { Component } from "@angular/core";
import { debounceTime, Subject } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { AddSourceComponent } from "../add-source/add-source.component";
import { FormGroup } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { AuthService, SourcesService } from "../../../../../shared/services";
import { SharedUiModule } from "../../../../../shared/components/shared-ui.module";
import { Router, ActivatedRoute } from "@angular/router";
import { BasicTableThreeComponent } from "../../../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";

@Component({
  selector: "app-sources",
  templateUrl: "./sources.component.html",
  styleUrls: ["./sources.component.scss"],
  imports: [SharedUiModule, BasicTableThreeComponent],
})
export class SourcesComponent {
  tableResponse: any | undefined;
  tableData: any[] = [];
  pageSize: number | undefined = 5;
  page: number | undefined = 1;
  pageIndex: number = 0;
  columns: any = [];
  originalTableData: any[] = [];
  private subject = new Subject<any>();
  constructor(
    private _SourcesService: SourcesService,
    private spinner: NgxSpinnerService,
    private _ToastrService: ToastrService,
    public dialog: MatDialog,
    public _AuthService: AuthService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.columns = [
      { header: "sources.name_en", field: "name_en", type: "text" },
      {
        header: "sources.name_ar",
        field: "name_ar",
        type: "text",
      },

      { header: "", field: "action", type: "action" },
    ];
    this.getAllSources();
    this.subject.pipe(debounceTime(800)).subscribe({
      next: (res) => {
        this.getAllSources();
      },
    });
  }

  // all sources
  getAllSources() {
    this.spinner.show();
    this._SourcesService.getSources(1).subscribe({
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
    this._SourcesService.getSources(event).subscribe({
      next: (res) => {
        this.tableResponse = res.data.total;
        this.tableData = res?.data.data;
        this.originalTableData = [...this.tableData];
        this.spinner.hide();
      },
    });
  }
  //
  // search
  handleSearch(value: string) {
    this.tableData = this.originalTableData.filter(
      (item) =>
        item.name_ar.toLowerCase().includes(value.toLowerCase()) ||
        item.name_en.toLowerCase().includes(value.toLowerCase())
    );
  }
  // add source
  openAddSource() {
    const dialogRef = this.dialog.open(AddSourceComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addSource(result);
      }
    });
  }

  addSource(data: FormGroup) {
    this._SourcesService.addSource(data.value).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, "Source Added Succesfuly");
      },
      error: (err) => {
        this._ToastrService.error(err.message, "Error in Added Source");
      },
      complete: () => {
        this.getAllSources();
      },
    });
  }

  // edit source
  openEditSource(item: any) {
    const dialogRef = this.dialog.open(AddSourceComponent, {
      data: item,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editSource(result, item.id);
      }
    });
  }

  editSource(data: FormGroup, id: number) {
    this._SourcesService.editSource(data.value, id).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, "Source Update Succesfuly");
      },
      error: (err) => {
        this._ToastrService.error(err.message, "Error in Update Source");
      },
      complete: () => {
        this.getAllSources();
      },
    });
  }

  // pagination
  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.page = e.pageIndex + 1;
    this.getAllSources();
  }

  // delete source

  deleteItem(id: number) {
    this._SourcesService.deleteSource(id).subscribe({
      next: (res) => {
        this._ToastrService.success("Source Deleted");
      },
      error: (err) => {
        this._ToastrService.error("Delete Source Failed");
      },
      complete: () => {
        this.getAllSources();
      },
    });
  }
  tableAction(event: { value: string; dataRow?: any }) {
    if (event.value === "edit") {
      this.openEditSource(event?.dataRow);
    } else if (event.value === "delete") {
      this.deleteItem(event?.dataRow.id);
    } else if (event.value === "view") {
      this.router.navigate(["./view", event?.dataRow.id], {
        relativeTo: this.route,
      });
    }
  }
}
