import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BuildingService {
  constructor(private _HttpClient: HttpClient) {}

  getBuildings(): Observable<any> {
    return this._HttpClient.get("buildings");
  }
  getBuildingById(id: number): Observable<any> {
    return this._HttpClient.get(`buildings/show/${id}`);
  }
  addBuilding(data: any): Observable<any> {
    return this._HttpClient.post("buildings/create", data, {
      headers: { "X-No-Spinner": "true" },
    });
  }
  editBuilding(data: any, id: number): Observable<any> {
    return this._HttpClient.put(`buildings/update/${id}`, data, {
      headers: { "X-No-Spinner": "true" },
    });
  }
  deleteBuilding(id: number): Observable<any> {
    return this._HttpClient.delete(`buildings/delete/${id}`, {
      headers: { "X-No-Spinner": "true" },
    });
  }
}
