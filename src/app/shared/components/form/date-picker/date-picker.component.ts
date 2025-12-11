import { CommonModule } from "@angular/common";
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  forwardRef,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import flatpickr from "flatpickr";
import { LabelComponent } from "../label/label.component";
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-date-picker",
  imports: [CommonModule, LabelComponent, TranslateModule],
  templateUrl: "./date-picker.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent
  implements ControlValueAccessor, Validator, AfterViewInit, OnDestroy
{
  @Input() id!: string;
  @Input() mode: "single" | "multiple" | "range" | "time" = "single";
  @Input() defaultDate?: string | Date | string[] | Date[];
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() required = false; // <-- reactive form validation

  @Output() dateChange = new EventEmitter<any>();

  @ViewChild("dateInput", { static: false })
  dateInput!: ElementRef<HTMLInputElement>;

  control!: FormControl;
  private flatpickrInstance: flatpickr.Instance | undefined;
  private onChange = (_: any) => {};
  private onTouched = () => {};
  @Input() disabled = false;
  @Input() className: string = "";

  writeValue(value: any): void {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.setDate(value || null, true);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.dateInput) {
      this.dateInput.nativeElement.disabled = isDisabled;
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    this.control = control as FormControl;

    if (this.required && (!this.control.value || this.control.value === "")) {
      return { required: true };
    }

    return null;
  }

  ngAfterViewInit() {
    this.flatpickrInstance = flatpickr(this.dateInput.nativeElement, {
      mode: this.mode,
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate: this.defaultDate,
      onChange: (selectedDates, dateStr, instance) => {
        this.onChange(dateStr);
        this.dateChange.emit({ selectedDates, dateStr, instance });
        if (this.control) {
          this.control.markAsTouched();
          this.control.updateValueAndValidity();
        }
      },
      onClose: () => {
        this.onTouched();
      },
    });
  }

  ngOnDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }

  get errorMessage(): string | null {
    if (!this.control || !this.control.errors) return null;

    if (
      this.control.errors["required"] &&
      (this.control.touched || this.control.dirty)
    ) {
      return "This field is required"; // Or use TranslateService
    }

    return null;
  }

  // Classes based on FormControl state
  get inputClasses(): string {
    const hasError = this.control?.touched && this.control?.errors;

    let classes = `
     
      ${this.className || ""}
    `;

    if (this.disabled) {
      classes += `
        text-gray-500 border-gray-300 opacity-40 bg-gray-100
        dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700
      `;
    } else if (hasError) {
      classes += `
        !border-error-500 !focus:border-error-300 !focus:ring-error-500/20 border rounded-lg
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
