import { Component, Input, Output, EventEmitter } from "@angular/core";
import { SharedUiModule } from "../../shared-ui.module";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  imports: [CommonModule, MatIconModule],
  standalone: true,
})
export class ButtonComponent {
  @Input() className = "";
  @Input() size: "sm" | "md" = "md";
  @Input() variant: "primary" | "outline" | "success" | "warning" = "primary";
  @Input() disabled = false;
  @Input() isLoading = false;
  @Input() startIcon?: string;
  @Input() endIcon?: string;

  @Output() clicked = new EventEmitter<Event>();
  get sizeClasses(): string {
    return this.size === "sm" ? "px-4 py-3 text-sm" : "px-5 py-3.5 text-sm";
  }

  get variantClasses(): string {
    switch (this.variant) {
      case "primary":
        return "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300";

      case "success":
        return "bg-green-500 text-white shadow-theme-xs hover:bg-green-600 disabled:bg-green-300";

      case "warning":
        return "bg-yellow-500 text-white shadow-theme-xs hover:bg-yellow-600 disabled:bg-yellow-300";

      default: // secondary fallback
        return "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 \
              dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 \
              dark:hover:bg-white/[0.03] dark:hover:text-gray-300";
    }
  }

  get disabledClasses(): string {
    return this.disabled ? "cursor-not-allowed opacity-50" : "";
  }

  onClick(event: Event) {
    if (!this.isLoading && !this.disabled) {
      this.clicked.emit(event);
    }
  }
}
