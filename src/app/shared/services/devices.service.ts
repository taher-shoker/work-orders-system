import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DevicesService {
  constructor(private _HttpClient: HttpClient) {}

  addNewDevice(data: any): Observable<any> {
    return this._HttpClient.post("devices/create", data, {
      headers: { "X-No-Spinner": "true" },
    });
  }
  addDeviceData(data: any): Observable<any> {
    return this._HttpClient.post("devices/lookups", data);
  }
  getAllDevices(params?: any): Observable<any> {
    return this._HttpClient.get("devices", { params: { page: params } });
  }
  getDevice(id: number): Observable<any> {
    return this._HttpClient.get(`devices/show/${id}`);
  }

  onEditDevice(body: FormData, id: number): Observable<any> {
    return this._HttpClient.put(`devices/update/${id}`, body);
  }
  onDeleteDevice( id: number): Observable<any> {
    return this._HttpClient.delete(`devices/delete/${id}`,);
  }
  getDeviceWorkOrder(id: number): Observable<any> {
    return this._HttpClient.get(`work-orders/orders_by_device/${id}`);
  }

  // onGetDeviceType(data:any): Observable<any> {
  //   return this._HttpClient.post('devices/lookups',{type:data});
  // }

  onGetCustodians(): Observable<any> {
    return this._HttpClient.get("auth/get_custodians/10");
  }

  onGetDepartment(): Observable<any> {
    return this._HttpClient.get("departments");
  }
  onGetDeviceModel(): Observable<any> {
    return this._HttpClient.get("device_models");
  }
  onGetDeviceManufacturers(): Observable<any> {
    return this._HttpClient.get("device_manufacturers");
  }
  onGetDeviceType(): Observable<any> {
    return this._HttpClient.get("device_types");
  }
  onGetDeviceStatus(): Observable<any> {
    return this._HttpClient.get("device_statuses");
  }
}
