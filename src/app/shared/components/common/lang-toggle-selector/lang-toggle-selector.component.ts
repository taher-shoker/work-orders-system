import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { DirectionService } from "../../../services/direction.service";

@Component({
  selector: "app-lang-toggle-selector",
  templateUrl: "./lang-toggle-selector.component.html",
  imports: [CommonModule],
})
export class LangToggleSelectorComponent {
  currentLang$ = this.directionService.currentLanguage$;

  constructor(public directionService: DirectionService) {}

  // Method to toggle between languages
  toggleLanguage() {
    this.directionService.toggle();
  }
}
