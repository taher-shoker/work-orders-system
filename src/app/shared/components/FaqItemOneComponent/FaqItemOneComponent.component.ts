import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SharedUiModule } from "../shared-ui.module";

@Component({
  selector: "app-AccordionItem",
  templateUrl: "./AccordionItem.component.html",
  imports: [SharedUiModule, CommonModule],
})
export class AccordionItemComponent {
  @Input() title: string = "title";
  @Input() answer: string = "body";
  open = false;

  toggle() {
    this.open = !this.open;
  }
}
