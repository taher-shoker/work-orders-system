import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ManufacturersService {
  constructor(private http: HttpClient) {}

  getAllManufacturers(): Observable<any> {
    return this.http.get(`device_manufacturers`);
  }
  addManufacturers(data: any): Observable<any> {
    return this.http.post(`device_manufacturers/create`, data, {
      headers: { "X-No-Spinner": "true" },
    });
  }
  updateManufacturers(data: any, id: string): Observable<any> {
    return this.http.put(`device_manufacturers/update/${id}`, data, {
      headers: { "X-No-Spinner": "true" },
    });
  }
  deleteManufacturers(id: string): Observable<any> {
    return this.http.delete(`device_manufacturers/delete/${id}`, {
      headers: { "X-No-Spinner": "true" },
    });
  }
  getManufacturersById(id: string): Observable<any> {
    return this.http.get(`device_manufacturers/show/${id}`);
  }
}
