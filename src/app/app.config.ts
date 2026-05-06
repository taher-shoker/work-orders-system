import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";

// Translating
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

// UI modules
import { ToastrModule } from "ngx-toastr";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgOtpInputModule } from "ng-otp-input";

// Services
import { CookieService } from "ngx-cookie-service";
import { provideAnimations } from "@angular/platform-browser/animations";

// Routes & shared modules
import { routes } from "./app.routes";
import { SharedUiModule } from "./shared/components/shared-ui.module";

// Interceptors
import { GlobalInterceptor } from "./interceptors/global.interceptor";
import { SpinnerInterceptor } from "./interceptors/spinner.interceptor";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { DirectionService } from "./shared/services/direction.service";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";

// Loader for ngx-translate
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
export function initDirection(directionService: DirectionService) {
  return () => directionService.initDirection();
}

export const appConfig: ApplicationConfig = {
  providers: [
    // 🚀 Angular optimized change detection
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 🚦 Routing system
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy },

    // 🌍 Global Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },

    // 🍪 Cookie Service
    CookieService,
    provideAnimations(), // <-- add this

    // 📦 Import classic Angular modules
    importProvidersFrom(
      HttpClientModule,

      // 🌐 Translation
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),

      // 🔔 Toastr
      ToastrModule.forRoot({
        positionClass: "toast-top-right",
        timeOut: 3000,
        preventDuplicates: true,
      }),

      // ⏳ Spinner
      NgxSpinnerModule,

      // 🔢 OTP Input
      NgOtpInputModule,

      // 🧩 Shared UI Components
      SharedUiModule
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initDirection,
      deps: [DirectionService],
      multi: true,
    },
  ],
};
