import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HelperService {
  constructor(private _HttpClient: HttpClient) {}

  getCurrentUser(): Observable<any> {
    return this._HttpClient.get("auth/get_single_user");
  }
  forgotPassword(data: { email: string }): Observable<any> {
    return this._HttpClient.post("auth/forgot-password", data).pipe(
      catchError(() => this._HttpClient.post("auth/forget-password", data))
    );
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
