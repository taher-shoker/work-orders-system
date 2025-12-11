import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { DirectionService } from "../../../services/direction.service";
import { HelperService } from "../../../services/helper.service";

@Component({
  selector: "app-lang-toggle-selector",
  templateUrl: "./lang-toggle-selector.component.html",
  imports: [CommonModule],
})
export class LangToggleSelectorComponent {
  constructor(
    public helperService: HelperService,
    public directionService: DirectionService
  ) {}
  // Method to toggle between languages
  toggleLanguage() {
    // const newLang =
    //   this.helperService.translate.currentLang === "ar" ? "en" : "ar";
    this.directionService.toggle();
  }
}
