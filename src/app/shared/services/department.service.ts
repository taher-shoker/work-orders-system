import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DepartmentService {
  constructor(private _HttpClient: HttpClient) {}

  getDepartment(): Observable<any> {
    return this._HttpClient.get("departments");
  }

  getDepartmentById(id: number): Observable<any> {
    return this._HttpClient.get(`departments/show/${id}`);
  }

  addDepartment(data: any): Observable<any> {
    return this._HttpClient.post("departments/create", data, {
      headers: { "X-No-Spinner": "true" },
    });
  }

  editDepartment(data: any, id: number): Observable<any> {
    return this._HttpClient.put(`departments/update/${id}`, data, {
      headers: { "X-No-Spinner": "true" },
    });
  }

  deleteDepartment(id: number): Observable<any> {
    return this._HttpClient.delete(`departments/delete/${id}`, {
      headers: { "X-No-Spinner": "true" },
    });
  }
}
