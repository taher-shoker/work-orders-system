import { CommonModule } from "@angular/common";
import { Component, Input, forwardRef } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
  FormControl,
} from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-text-area",
  standalone: true,
  imports: [CommonModule, TranslateModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative">
      <textarea
        [placeholder]="placeholder | translate"
        [rows]="rows"
        [disabled]="disabled"
        [ngClass]="textareaClasses"
        [value]="value"
        (input)="handleInput($event)"
        (blur)="onTouched()"
      ></textarea>

      @if (control && control.touched && control.errors?.['required']) {
      <p class="mt-1.5 text-xs text-error-500">
        {{ "forms.field_required" | translate }}
      </p>
      }
    </div>
  `,
  styles: ``,
})
export class TextAreaComponent implements ControlValueAccessor, Validator {
  @Input() placeholder = "forms.add_description";
  @Input() rows = 3;
  @Input() className = "";
  @Input() hint = "";
  @Input() required = false;

  value: string = "";
  disabled = false;
  hasError = false;

  // ---- ControlValueAccessor required methods ---- //

  onChange = (_: any) => {};
  onTouched = () => {};
  control!: FormControl;

  writeValue(val: string): void {
    this.value = val ?? "";
    this.validateRequired();
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

  // ---- Input handler ---- //
  handleInput(event: Event) {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value = val;
    this.validateRequired();
    this.onChange(val);
  }

  // ---- Validators ---- //
  validate(control: AbstractControl): ValidationErrors | null {
    this.control = control as FormControl;
    return null;
  }

  private validateRequired() {
    this.hasError = this.required && !this.value;
  }

  // ---- Styles ---- //
  get textareaClasses(): string {
    let base = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${this.className} `;

    if (this.disabled) {
      base += `bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed
               dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (this.hasError) {
      base += `bg-transparent border-error-400 focus:border-error-300 focus:ring-3 focus:ring-error-500/10
               dark:border-error-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800`;
    } else {
      base += `bg-transparent text-gray-900 dark:text-gray-300 border-gray-300
               focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10
               dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
    }

    return base;
  }
}
