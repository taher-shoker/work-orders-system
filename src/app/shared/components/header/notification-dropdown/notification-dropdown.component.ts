import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { DropdownComponent } from "../../ui/dropdown/dropdown.component";
import { DropdownItemComponent } from "../../ui/dropdown/dropdown-item/dropdown-item.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { HelperService } from "../../../services";
import { TimeAgoPipe } from "../../../pipe/time-ago.pipe";

@Component({
  selector: "app-notification-dropdown",
  templateUrl: "./notification-dropdown.component.html",
  imports: [
    CommonModule,
    RouterModule,
    DropdownComponent,
    DropdownItemComponent,
    TimeAgoPipe,
    TranslateModule,
  ],
})
export class NotificationDropdownComponent {
  isOpen = false;
  notifying = true;
  notifications: any[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  isLoading: boolean = false;
  isFetchingMore: boolean = false;

  constructor(
    private _helpService: HelperService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchNotifications(1);
  }

  private fetchNotifications(page: number = 1): void {
    if (this.isFetchingMore) return;

    this.isFetchingMore = true;

    this._helpService.getAllNotifications(page).subscribe({
      next: (res) => {
        if (page === 1) {
          // first load
          this.notifications = res.data.data;
        } else {
          // append new items
          this.notifications = [...this.notifications, ...res.data.data];
        }

        this.currentPage = res.data.current_page;
        this.lastPage = res.data.last_page;

        this.isFetchingMore = false;
      },
      error: () => {
        this.isFetchingMore = false;
      },
    });
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.notifying = false;
  }

  closeDropdown() {
    this.isOpen = false;
  }
  handlelClick(item: any) {
    this.router.navigate(["/dashboard/work-orders/view", item.work_order_id], {
      relativeTo: this.route,
    });
  }
}
