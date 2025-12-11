import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-radio-sm",
  imports: [CommonModule],
  template: `
    <label
      [attr.for]="id"
      class="flex cursor-pointer select-none items-center text-sm transition
        text-gray-500 dark:text-gray-400"
      [ngClass]="[className, disabled ? 'cursor-not-allowed opacity-60' : '']"
    >
      <span class="relative">
        <!-- Hidden Input -->
        <input
          type="radio"
          class="sr-only"
          [id]="id"
          [name]="name"
          [value]="value"
          [checked]="checked"
          [disabled]="disabled"
          (change)="onChange()"
        />

        <!-- Styled Radio Circle -->
        <span
          class="mr-2 flex h-4 w-4 items-center justify-center rounded-full border transition"
          [ngClass]="
            checked
              ? 'border-brand-500 bg-brand-500'
              : 'border-gray-300 dark:border-gray-700 bg-transparent'
          "
        >
          <!-- Inner Dot -->
          <span
            class="h-1.5 w-1.5 rounded-full transition"
            [ngClass]="checked ? 'bg-white' : 'bg-white dark:bg-[#1e2636]'"
          ></span>
        </span>
      </span>

      {{ label }}

      @if (required && !checked) {
      <span class="ml-1 text-red-500">*</span>
      }
    </label>
  `,
  styles: ``,
})
export class RadioSmComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() value!: string;
  @Input() label!: string;

  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;

  @Input() className: string = "";

  @Output() valueChange = new EventEmitter<string>();

  onChange() {
    if (this.disabled) return;
    this.valueChange.emit(this.value);
  }
}
