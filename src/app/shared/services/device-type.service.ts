import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DeviceTypeService {
  constructor(private http: HttpClient) {}

  getAllDeviceType(params: any): Observable<any> {
    return this.http.get(`device_types`, { params: { page: params } });
  }
  addDeviceType(data: any): Observable<any> {
    return this.http.post(`device_types/create`, data, {
      headers: { "X-No-Spinner": "true" },
    });
  }
  updateDeviceType(data: any, id: string): Observable<any> {
    return this.http.put(`device_types/update/${id}`, data, {
      headers: { "X-No-Spinner": "true" },
    });
  }
  deleteDeviceType(id: string): Observable<any> {
    return this.http.delete(`device_types/delete/${id}`, {
      headers: { "X-No-Spinner": "true" },
    });
  }
  getDeviceTypeById(id: string): Observable<any> {
    return this.http.get(`device_types/show/${id}`);
  }
}
