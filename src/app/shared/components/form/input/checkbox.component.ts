import { Component, Input, forwardRef } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
  AbstractControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-checkbox",
  standalone: true,
  imports: [CommonModule],
  template: `
    <label
      class="flex items-center space-x-3 group cursor-pointer"
      [ngClass]="{ 'cursor-not-allowed opacity-60': disabled }"
    >
      <div class="relative w-5 h-5">
        <input
          [id]="id"
          type="checkbox"
          class="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 
               checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60"
          [ngClass]="className"
          [checked]="value"
          (change)="handleChange($event)"
          (blur)="onTouched()"
          [disabled]="disabled"
          [required]="required"
        />

        @if (value) {
        <svg
          class="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
            stroke="white"
            stroke-width="1.94437"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        } @else if (disabled) {
        <svg
          class="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
            stroke="#E4E7EC"
            stroke-width="2.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        }
      </div>

      @if (label) {
      <span class="text-sm font-medium text-gray-800 dark:text-gray-200">
        {{ label }}
      </span>
      }
    </label>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor, Validator {
  @Input() label?: string;
  @Input() className = "";
  @Input() id?: string;
  @Input() disabled = false;
  @Input() required = false;

  value = false; // checked state
  requiredError = false;

  // --- ControlValueAccessor ---
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: boolean): void {
    this.value = !!value;
    this.checkRequired();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // --- Change Handler ---
  handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.checked;
    this.checkRequired();
    this.onChange(this.value);
  }

  // --- Validation ---
  validate(control: AbstractControl): ValidationErrors | null {
    this.checkRequired();

    if (this.required && !this.value) {
      return { required: true };
    }
    return null;
  }

  private checkRequired() {
    this.requiredError = this.required && !this.value;
  }
}
