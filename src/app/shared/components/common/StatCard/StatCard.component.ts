import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-StatCard",
  templateUrl: "./StatCard.component.html",
  imports: [CommonModule, MatIconModule],
})
export class StatCardComponent {
  @Input() title: string = ""; // The title of the card
  @Input() icon: string = ""; // The icon name (Material Icons class name)
  @Input() number: number = 0; // The number to display on the card
  @Input() colorClass: string = ""; // The color class (Tailwind CSS class)
}
