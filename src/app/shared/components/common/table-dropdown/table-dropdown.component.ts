import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { createPopper, Instance } from "@popperjs/core";
import { SharedUiModule } from "../../shared-ui.module";

@Component({
  selector: "app-table-dropdown",
  imports: [SharedUiModule],
  templateUrl: "./table-dropdown.component.html",
  styles: ``,
  standalone: true,
})
export class TableDropdownComponent {
  @Input() dropdownButton: any;
  @Input() dropdownContent: any;
  @ViewChild("buttonRef") buttonRef!: ElementRef<HTMLDivElement>;
  @ViewChild("contentRef") contentRef!: ElementRef<HTMLDivElement>;

  isOpen = false;
  private popperInstance: Instance | null = null;

  constructor() {}

  ngAfterViewInit() {
    document.addEventListener("click", this.close.bind(this));

    if (this.buttonRef && this.contentRef) {
      // Check if the page is in RTL or LTR mode
      const isRTL = document.documentElement.getAttribute("dir") === "rtl";
      // Define custom offsets in pixels (you can adjust these values as needed)
      const customOffsetX = isRTL ? 10 : 10; // Horizontal offset (in pixels)
      const customOffsetY = -100; // Vertical offset (in pixels)

      // Dynamically set the placement based on the direction
      const placement = isRTL ? "bottom-start" : "bottom-end";

      // Create the Popper instance with custom positioning
      this.popperInstance = createPopper(
        this.buttonRef.nativeElement,
        this.contentRef.nativeElement,
        {
          placement: placement, // Default placement (can be 'bottom-start', 'bottom-end', etc.)
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [customOffsetX, customOffsetY], // Custom offsets (X, Y)
              },
            },
          ],
        }
      );
    }
  }

  ngOnDestroy() {
    document.removeEventListener("click", this.close.bind(this));
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.popperInstance) {
      this.popperInstance.update();
    }
  }

  close(event: MouseEvent) {
    const target = event.target as Node;
    if (this.buttonRef && this.contentRef) {
      const dropdown = this.buttonRef.nativeElement.closest("div");
      if (dropdown && !dropdown.contains(target)) {
        this.isOpen = false;
      }
    }
  }
}
