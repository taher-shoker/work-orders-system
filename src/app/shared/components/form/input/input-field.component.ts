import { CommonModule } from "@angular/common";
import { Component, Input, forwardRef, OnInit } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
  FormControl,
} from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-input-field",
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule],
  template: `
    <div class="relative">
      <!-- Input wrapper -->
      <div class="relative  min-h-[44px]">
        <input
          [type]="actualType"
          [id]="id"
          [name]="name"
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          [ngClass]="inputClasses"
          (input)="handleInput($event)"
          (blur)="onTouched()"
        />

        <!-- Password toggle icon -->
        @if (type === 'password') {
        <span
          (click)="togglePasswordVisibility()"
          class="absolute top-1/2 -translate-y-1/2 cursor-pointer z-10
               ltr:right-4 rtl:left-4 flex items-center"
        >
          @if(showPassword){ <mat-icon>visibility</mat-icon>
          }@else {
          <mat-icon>visibility_off</mat-icon>

          }
        </span>
        }
      </div>

      <!-- ❗ Error messages OUTSIDE -->
      @if (control?.touched && control?.errors?.['required']) {
      <p class="mt-1.5 text-xs text-error-500">
        {{ "forms.field_required" | translate }}
      </p>
      } @if (control?.touched && control?.errors?.['pattern']) {
      <p class="mt-1.5 text-xs text-error-500">
        {{ "users.password_pattern" | translate }}
      </p>
      } @if (control?.touched && control?.errors?.['passwordMismatch']) {
      <p class="mt-1.5 text-xs text-error-500">
        {{ "users.match" | translate }}
      </p>
      } @if (control?.touched && control?.errors?.['email']) {
      <p class="mt-1.5 text-xs text-error-500">
        {{ "users.email_pattern" | translate }}
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
export class InputFieldComponent
  implements ControlValueAccessor, Validator, OnInit
{
  @Input() type: string = "text";
  @Input() id = "";
  @Input() name = "";
  @Input() placeholder = "";
  @Input() min?: number | string;
  @Input() max?: number | string;
  @Input() step?: number;
  @Input() className = "";

  value: string | number = "";
  disabled = false;

  showPassword = false;
  control?: FormControl;

  onChange = (_: any) => {};
  onTouched = () => {};

  ngOnInit(): void {
    if (!this.id) {
      this.id = "id-" + Math.random().toString(36).substring(2, 10);
    }
  }

  /** 🔑 Actual input type */
  get actualType(): string {
    if (this.type !== "password") return this.type;
    return this.showPassword ? "text" : "password";
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val: string | number = input.value;

    if (this.type === "number") {
      val = input.value === "" ? "" : Number(input.value);
    }

    this.value = val;
    this.onChange(val);
  }

  // Validator
  validate(control: AbstractControl): ValidationErrors | null {
    this.control = control as FormControl;
    return null;
  }

  // Dynamic classes
  get inputClasses(): string {
    const hasError = this.control?.touched && this.control?.errors;

    return `
      h-11 w-full rounded-lg border px-4 py-2.5 text-sm
      shadow-theme-xs placeholder:text-gray-400
      focus:outline-hidden focus:ring-3
      ${this.className}
      ${
        this.disabled
          ? "opacity-40 bg-gray-100 border-gray-300"
          : hasError
          ? "border-error-500 focus:ring-error-500/20"
          : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20"
      }
    `;
  }
}
