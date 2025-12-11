import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { finalize, Observable } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private _ngxSpinner: NgxSpinnerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const showSpinner = !req.headers.has("X-No-Spinner"); // 👈 skip spinner if header present

    if (showSpinner) {
      this._ngxSpinner.show();
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (showSpinner) {
          this._ngxSpinner.hide();
        }
      })
    );
  }
}
