import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
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
  styleUrls: ["./basic-table-three.component.scss"],
  standalone: true,
})
export class BasicTableThreeComponent implements OnInit, OnChanges {
  // Type definition for the transaction data
  @Input() type: string = "normal";
  @Input() importExport: boolean = false;
  @Input() noFilter: boolean = false;
  @Input() noSearch: boolean = false;
  @Input() addBtn: boolean = false;
  @Input() print: boolean = false;
  @Input() placeholderSearch: string = "";
  @Input() title: string = "";
  @Input() deleteMsg: string = "45";
  @Input() columns: any = [];
  @Input() data: Record<string, any>[] = [];
  @Input() dataPrint: Record<string, any>[] = [];
  @Input() totalItems!: number;
  @Output() doAction: EventEmitter<{ value: string; dataRow?: any }> =
    new EventEmitter<{ value: string; dataRow?: any }>();
  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() paginationEvent: EventEmitter<number> = new EventEmitter<number>();

  @Input() haveView: boolean = true;
  isOpen = false;
  selectItem: any;
  isRtl!: boolean;
  totalPages!: number;
  ngOnInit(): void {
    const language = localStorage.getItem("lang");
    if (language === "en") {
      this.isRtl = false;
    } else {
      this.isRtl = true;
    }
    this.calculatePages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"]) {
      this.calculatePages();
    }
  }
  printStyles = {
    "#print-section": {
      display: "block",
    },

    ".print-header": {
      "text-align": "center",
      "margin-bottom": "10px",
    },

    ".print-header img": {
      width: "120px",
      display: "block",
      margin: "0 auto",
    },

    ".page-header": {
      "text-align": "center",
      "margin-bottom": "20px",
    },

    ".print-title": {
      "font-size": "22px",
      "font-weight": "bold",
    },
  };
  handlePagination(event: number) {
    console.log(event);
    this.paginationEvent.emit(event);
  }
  calculatePages(): void {
    // Divide total items by items per page and round up to get full pages
    this.totalPages = Math.ceil(this.totalItems / 15);
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
  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    console.log(value);
    this.searchEvent.emit(value);

    // filter table / call API / update list
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
