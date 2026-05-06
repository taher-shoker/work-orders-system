import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import { DropdownComponent } from "../../ui/dropdown/dropdown.component";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { DropdownItemTwoComponent } from "../../ui/dropdown/dropdown-item/dropdown-item.component-two";
import { AuthService } from "../../../services";
import { TranslateModule } from "@ngx-translate/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-user-dropdown",
  templateUrl: "./user-dropdown.component.html",
  imports: [
    CommonModule,
    RouterModule,
    DropdownComponent,
    DropdownItemTwoComponent,
    TranslateModule,
  ],
})
export class UserDropdownComponent implements OnInit {
  isOpen = false;
  name: any;
  email: any;
  private readonly destroyRef = inject(DestroyRef);

  constructor(private authService: AuthService, private _Router: Router) {}
  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: any) => {
        if (user) {
          this.name = user.name;
          this.email = user.email;
        }
      });
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
  onLogout() {
    this.authService.logout();
    this._Router.navigate(["/signin"]);
  }
}
