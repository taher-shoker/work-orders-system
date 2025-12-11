import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SharedUiModule } from "../../../shared-ui.module";
import { PaginationComponent } from "../../../common/paginator/paginator.component";
import { ModalComponent } from "../../../ui/modal/modal.component";
import { TableDropdownComponent } from "../../../common/table-dropdown/table-dropdown.component";

interface Transaction {
  image: string;
  action: string;
  date: string;
  amount: string;
  category: string;
  status: "Success" | "Pending" | "Failed";
}

@Component({
  selector: "app-basic-table-three",
  imports: [
    SharedUiModule,
    PaginationComponent,
    ModalComponent,
    TableDropdownComponent,
  ],
  providers: [DatePipe],
  templateUrl: "./basic-table-three.component.html",
  standalone: true,
})
export class BasicTableThreeComponent implements OnInit {
  // Type definition for the transaction data
  @Input() type: string = "normal";
  @Input() importExport: boolean = false;
  @Input() noFilter: boolean = false;
  @Input() addBtn: boolean = false;

  @Input() title: string = "";
  @Input() deleteMsg: string = "45";
  @Input() columns: any = [];
  @Input() data: Record<string, any>[] = [];
  @Output() doAction: EventEmitter<{ value: string; dataRow?: any }> =
    new EventEmitter<{ value: string; dataRow?: any }>();
  @Input() haveView: boolean = true;
  isOpen = false;
  selectItem: any;
  isRtl!: boolean;
  ngOnInit(): void {
    const language = localStorage.getItem("lang");
    if (language === "en") {
      this.isRtl = false;
    } else {
      this.isRtl = true;
    }
    console.log(this.data);
  }
  getNestedProperty(item: any, field: string): any {
    return field.split(".").reduce((acc, part) => acc && acc[part], item);
  }
  preprocessDate(dateString: string): string {
    // Remove microseconds and keep milliseconds
    const formattedDate = dateString.substring(0, 23) + "Z"; // Format it to ISO 8601 with milliseconds

    // Create a JavaScript Date object from the formatted date string
    const dateObj = new Date(formattedDate);

    // Check if the date object is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date"; // Return 'Invalid Date' if the date is not valid
    }

    // Get day, month and year
    const day = String(dateObj.getDate()).padStart(2, "0"); // Get day with leading zero if needed
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Get month (0-based) with leading zero
    const year = dateObj.getFullYear(); // Get full year

    // Return the formatted date in 'dd/mm/yyyy' format
    return `${day}/${month}/${year}`;
  }
  // Example data
  handleExport(type: string) {
    // logic here
    this.doAction.emit({ value: type });
  }
  handleAdd(type: string) {
    this.doAction.emit({ value: type });
  }
  handleImport(type: string) {
    // logic here
    this.doAction.emit({ value: type });
  }
  handleView(type: string, item: any) {
    // logic here
    this.doAction.emit({ value: type, dataRow: item });
  }

  handleDelete(type: string, item: any) {
    // logic here
    this.openModal();
    this.selectItem = item;
  }

  handleEdit(type: string, item: any) {
    // logic here
    this.doAction.emit({ value: type, dataRow: item });
  }
  getBadgeColor(status: string): "success" | "warning" | "error" {
    if (status === "Success") return "success";
    if (status === "Pending") return "warning";
    return "error";
  }
  confirm() {
    this.doAction.emit({ value: "delete", dataRow: this.selectItem });
    this.closeModal();
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }
  handleFilter() {
    console.log("Filter clicked");
    // Add your filter logic here
  }
}
