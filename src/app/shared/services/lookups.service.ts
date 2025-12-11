import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LookupsService {
  constructor(private _HttpClient: HttpClient) {}
  private dashboardSubject = new BehaviorSubject<any>(null); // Initial value
  dashboard$ = this.dashboardSubject.asObservable();
  getDashboard(): Observable<any> {
    return this._HttpClient.get("dashboard").pipe(
      tap((res: any) => {
        this.dashboardSubject.next(res.data); // Update the BehaviorSubject with API response
      })
    );
  }

  get currentDashboardValue() {
    return this.dashboardSubject.value;
  }
  getbuilding(): Observable<any> {
    return this._HttpClient.get("work-orders/lookups/building", {
      headers: { "X-No-Spinner": "true" },
    });
  }
  getWork_type(): Observable<any> {
    return this._HttpClient.get("work-orders/lookups/work_types", {
      headers: { "X-No-Spinner": "true" },
    });
  }
  getSource(): Observable<any> {
    return this._HttpClient.get("work-orders/lookups/sources", {
      headers: { "X-No-Spinner": "true" },
    });
  }
  getReport(): Observable<any> {
    return this._HttpClient.get("work-orders/lookups/reports");
  }
  getEquipment(): Observable<any> {
    return this._HttpClient.get("work-orders/lookups/equipment", {
      headers: { "X-No-Spinner": "true" },
    });
  }
  getDepartment(): Observable<any> {
    return this._HttpClient.get("work-orders/lookups/departments", {
      headers: { "X-No-Spinner": "true" },
    });
  }
  getDepartmentById(id: number): Observable<any> {
    return this._HttpClient.get(`work-orders/get_department_by_id/${id}`, {
      headers: { "X-No-Spinner": "true" },
    });
  }
  getStatus(): Observable<any> {
    return this._HttpClient.get("work-orders/lookups/statuses");
  }
}
