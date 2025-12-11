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
  selector: "app-input-field",
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="relative">
      <input
        [type]="fieldType"
        [id]="id"
        [name]="name"
        [placeholder]="placeholder"
        [value]="value"
        [min]="min"
        [max]="max"
        [step]="step"
        [disabled]="disabled"
        [ngClass]="inputClasses"
        (input)="handleInput($event)"
        (blur)="onTouched()"
      />

      @if (control && control.touched && control.errors?.['required']) {
      <p class="mt-1.5 text-xs text-error-500">
        {{ "forms.field_required" | translate }}
      </p>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true,
    },
  ],
})
export class InputFieldComponent implements ControlValueAccessor, Validator {
  @Input("type") fieldType: string = "text";
  @Input() id: string = "";
  @Input() name: string = "";
  @Input() placeholder: string = "";
  @Input() min?: number | string;
  @Input() max?: number | string;
  @Input() step?: number;
  @Input() hint?: string;
  @Input() className: string = "";

  value: string | number = "";
  disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  control!: FormControl;

  ngOnInit(): void {
    if (!this.id) this.id = this.generateRandomId();
  }

  private generateRandomId(): string {
    return "id-" + Math.random().toString(36).substring(2, 10);
  }

  // CVA
  writeValue(value: any): void {
    this.value = value ?? "";
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let val: string | number = input.value;

    if (this.fieldType === "number") {
      val = input.value === "" ? "" : Number(input.value);
    }

    this.value = val;
    this.onChange(val);
  }

  // VALIDATION — store control instance
  validate(control: AbstractControl): ValidationErrors | null {
    this.control = control as FormControl;
    return null; // do not validate manually; let Angular handle it
  }

  // Classes based on FormControl state
  get inputClasses(): string {
    const hasError = this.control?.touched && this.control?.errors;

    let classes = `
      h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm
      shadow-theme-xs placeholder:text-gray-400
      focus:outline-hidden focus:ring-3
      dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30
      ${this.className || ""}
    `;

    if (this.disabled) {
      classes += `
        text-gray-500 border-gray-300 opacity-40 bg-gray-100
        dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700
      `;
    } else if (hasError) {
      classes += `
        border-error-500 focus:border-error-300 focus:ring-error-500/20
      `;
    } else {
      classes += `
        bg-transparent text-gray-800 border-gray-300
        focus:border-brand-300 focus:ring-brand-500/20
        dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800
      `;
    }

    return classes;
  }
}
