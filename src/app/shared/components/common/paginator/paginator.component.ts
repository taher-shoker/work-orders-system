import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { SharedUiModule } from "../../shared-ui.module";

@Component({
  selector: "app-pagination",
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: "./paginator.component.html",
})
export class PaginationComponent {
  @Input() currentPage: number = 1; // Receive currentPage from parent
  @Input() totalPages: number = 10; // Receive totalPages from parent

  @Output() pageChange = new EventEmitter<number>(); // Emit pageChange event to parent

  // Logic for determining which pages to display
  get displayedPages(): (number | string)[] {
    const pages = [];
    let start = Math.max(1, this.currentPage - 2); // Show 2 pages before the current page
    let end = Math.min(this.totalPages, this.currentPage + 2); // Show 2 pages after the current page

    // Adjust range to handle edge cases (beginning and end of page range)
    if (start > 1) {
      pages.push(1); // Always show the first page
      if (start > 2) pages.push("..."); // Add ellipsis
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < this.totalPages) {
      if (end < this.totalPages - 1) pages.push("..."); // Add ellipsis
      pages.push(this.totalPages); // Always show the last page
    }

    return pages;
  }

  // Method to go to a specific page
  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage); // Emit the new page number
    }
  }
}
