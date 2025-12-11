import { CommonModule } from "@angular/common";
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ElementRef,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-file-input",
  imports: [TranslateModule, CommonModule, MatIconModule],
  template: `
    <div class="uploader-box space-y-2">
      <!-- Upload Button + Input -->

      <div class="flex w-full">
        <div
          class="h-11 w-full rounded-lg flex items-center   rounded-l-lg border  border-gray-300
             bg-white-100 text-gray-700 hover:bg-white-100
             disabled:opacity-50 disabled:cursor-not-allowed"
          (click)="onClick($event)"
        >
          <i class="fas fa-link"></i>
          <span
            class="h-full w-40 bg-gray-200 px-4 py-2 border border-black-700 "
            >{{ chooseLabel | translate }}</span
          >
          <span *ngIf="required" class="text-red-500">*</span>

          <!-- Uploaded Files List -->
          <div
            *ngIf="attachmentFiles?.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            <div
              *ngFor="let f of attachmentFiles; let i = index"
              class="flex justify-between items-center p-1 mx-2 border rounded-lg bg-gray-50 dark:bg-gray-800 h-auto w-50"
            >
              <span
                class="truncate max-w-[180px]"
                [title]="f.file.label ? f.file.label : f.file.name"
              >
                {{
                  truncateLabelText(f.file.label ? f.file.label : f.file.name)
                }}
              </span>

              <button
                type="button"
                class="text-red-500 hover:text-red-600"
                (click)="removeFileRemotly(f.id); $event.stopPropagation()"
                [attr.title]="deleteButtonLabel || null"
              >
                <mat-icon class="text-red-500">cancel</mat-icon>
              </button>
            </div>
          </div>
        </div>

        <input
          #fileUpload
          type="file"
          class="hidden file-input flex-1 h-11 border border-gray-300 rounded-r-lg px-4 py-2 text-sm
             text-gray-700 bg-white cursor-pointer
             focus:outline-none focus:ring-2 focus:ring-blue-500"
          (change)="onFileSelected($event)"
          [multiple]="multiple"
          [accept]="accept"
        />
      </div>

      <!-- Validation Message -->
      <div class="text-red-500 text-sm" *ngIf="invalidFileMessageDetail">
        {{ invalidFileMessageDetail }}
      </div>
      @if (control && control.touched && control.errors?.['required']) {
      <p class="mt-1.5 text-xs text-error-500">
        {{ "forms.field_required" | translate }}
      </p>
      }
      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="flex items-center gap-2">
        <div
          class="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"
        ></div>
        <span class="text-sm text-gray-600">Loading...</span>
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true,
    },
  ],
})
export class FileUploaderComponent implements ControlValueAccessor {
  value: any;

  onTouched: any = () => {};
  onChange: any = () => {};

  writeValue(value: any): void {
    if (!value || !Array.isArray(value)) return;

    // Clear existing files
    this.files = [];

    value.forEach((item: any) => {
      if (item?.fileName) {
        // Create empty blob for preview only
        const blob = new Blob([""], { type: "application/octet-stream" });

        const file = new File([blob], item.fileName, {
          type: blob.type,
          lastModified: Date.now(),
        });

        this.files.push(file);
      }
    });
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

  @Input() attachmentFiles: any = [];
  @Input() mode: any;
  @Input() names: any;
  @Input() url: any;
  @Input() method: any;
  @Input() multiple!: boolean;
  @Input() disabled!: boolean;
  @Input() accept = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
    "text/csv",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  @Input() maxFileSize: any;
  @Input() isLoading!: boolean;
  @Input() required = false;
  @Input() withCredentials: any;
  @Input() invalidFileMessageDetail!: string;
  @Input() previewWidth: any;
  @Input() uploadLabel = "Upload";
  @Input() cancelLabel = "Cancel";
  @Input() customUpload: any;
  @Input() showUploadButton: any;
  @Input() showCancelButton: any;
  @Input() dataUriPrefix: any;
  @Input() deleteButtonLabel: any;
  @Input() deleteButtonIcon = "close";
  @Input() showUploadInfo: any;

  @Output() onformchange = new EventEmitter();
  @Output() ondelete = new EventEmitter();

  @ViewChild("fileUpload") fileUpload!: ElementRef;

  @Input() files: File[] = [];
  @Input() size = 2e7;
  chooseLabel = "forms.select_file";
  control!: FormControl;

  // FIXED TYPING
  onClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.fileUpload) {
      this.clearInputElement();
      this.fileUpload.nativeElement.click();
    }
  }
  // VALIDATION — store control instance
  validate(control: AbstractControl): ValidationErrors | null {
    this.control = control as FormControl;
    return null;
  }
  // FIXED TYPING
  onFileSelected(event: Event) {
    this.invalidFileMessageDetail = "";

    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files) return;

    let allFilesValid = true;
    const filesWithId: { id: number; file: File }[] = [];

    for (let i = 0; i < files.length; i++) {
      // Wrap file with ID
      const fileWithId = {
        id: i,
        file: files[i],
      };

      // Validate the file
      if (!this.validatee(fileWithId.file)) {
        allFilesValid = false;
      } else {
        // Only push valid files
        filesWithId.push(fileWithId);
      }
    }

    if (allFilesValid) {
      // emit the array with id
      this.onformchange.emit(filesWithId);
    } else {
      console.warn("Some files are invalid!");
    }
  }

  removeFile(file: File) {
    const ix = this.files.indexOf(file);
    if (ix !== -1) {
      this.files.splice(ix, 1);
      this.clearInputElement();
    }
  }

  removeFileRemotly(id: number) {
    this.ondelete.emit(id);
  }

  validatee(file: File) {
    if (file.size > this.size) {
      this.invalidFileMessageDetail = "File is too big!";
      return false;
    }

    if (file.type === "") {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!this.accept.includes(ext)) {
        this.invalidFileMessageDetail = "File is Invalid Format!";
        return false;
      }
      return true;
    }

    if (!this.accept.includes(file.type)) {
      this.invalidFileMessageDetail = "File is Invalid Format!";
      return false;
    }

    return true;
  }

  truncateLabelText(label: string) {
    const ext = label.slice(label.lastIndexOf("."));
    return label.slice(0, 10) + "..." + ext;
  }

  clearInputElement() {
    if (this.fileUpload) {
      this.fileUpload.nativeElement.value = "";
    }
  }

  isMultiple(): boolean {
    return this.multiple;
  }
}
