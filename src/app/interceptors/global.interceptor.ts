import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { environment } from "../../environments/environment";

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.cookieService.get("token");
    const language = localStorage.getItem("app-lang") || "ar";

    //const baseUrl = "https://vonnn.net/workorders2/public/api/"; // development
    // const baseUrl = "http:127.0.0.1:8000/api/"; //production
    let headers: any = {
      "Accept-Language": language,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const isAbsoluteUrl = (url: string) =>
      url.startsWith("http://") || url.startsWith("https://");

    const newReq = request.clone({
      setHeaders: headers,
      url:
        request.url.includes("assets") || isAbsoluteUrl(request.url)
          ? request.url // keep assets and absolute URLs unchanged
          : `${environment.apiUrl}/api/${request.url.replace(/^\/+/, "")}`, // prepend baseUrl + /api/
    });

    return next.handle(newReq);
  }
}
