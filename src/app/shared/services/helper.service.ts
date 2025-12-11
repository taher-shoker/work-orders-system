import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HelperService {
  constructor(private _HttpClient: HttpClient) {}

  getCurrentUser(): Observable<any> {
    return this._HttpClient.get("auth/get_single_user");
  }
  getEngineers(id: number): Observable<any> {
    return this._HttpClient.get(`auth/get_engineers/100/${id}`, {
      headers: { "X-No-Spinner": "true" },
    });
  }
  getTechnicians(id: number): Observable<any> {
    return this._HttpClient.get(`auth/get_technicians/100/${id}`, {
      headers: { "X-No-Spinner": "true" },
    });
  }
  getSupervisor(id: number): Observable<any> {
    return this._HttpClient.get(`auth/get_technicians/100/${id}`);
  }

  getNotifications(id: number): Observable<any> {
    return this._HttpClient.get(`notifications/${id}`);
  }

  getAllNotifications(page: number = 1): Observable<any> {
    return this._HttpClient.get(`notifications?page=${page}`, {
      headers: { "X-No-Spinner": "true" },
    });
  }

  MarkAsRead(id: number, data: number): Observable<any> {
    return this._HttpClient.put(`notifications/mark_as_read/${id}`, data);
  }
}
