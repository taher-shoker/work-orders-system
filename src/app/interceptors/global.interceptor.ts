import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.cookieService.get("token");
    const language = localStorage.getItem("app-lang") || "ar";

    const baseUrl = "https://vonnn.net/workorders2/public/api/";

    let headers: any = {
      "Accept-Language": language,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const newReq = request.clone({
      setHeaders: headers,
      url: request.url.includes("assets") ? request.url : baseUrl + request.url,
    });

    return next.handle(newReq);
  }
}
