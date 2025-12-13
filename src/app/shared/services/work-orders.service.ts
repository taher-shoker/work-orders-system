import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WorkOrdersService {
  constructor(private _HttpClient: HttpClient) {}
  getAllOrders(params: any = 1): Observable<any> {
    return this._HttpClient.get("work-orders", {
      params: { page: params },
    });
  }
  getOrder(id: number): Observable<any> {
    return this._HttpClient.get(`work-orders/show/${id}`);
  }
  deleteOrder(id: number): Observable<any> {
    return this._HttpClient.delete(`work-orders/delete/${id}`);
  }
  addNewOrder(data: any): Observable<any> {
    return this._HttpClient.post("work-orders/add", data);
  }
  editOrder(data: any, id: number): Observable<any> {
    return this._HttpClient.put(`work-orders/update/${id}`, data);
  }
  getMaterialByOrderId(id: number): Observable<any> {
    return this._HttpClient.get(`work-orders/materials/${id}`);
  }
  getPartsByOrderId(id: number): Observable<any> {
    return this._HttpClient.get(`work-orders/spare-parts/${id}`);
  }
  updateStatusOrder(id: number, formData: FormData): Observable<any> {
    return this._HttpClient.post(`work-orders/${id}/change-status`, formData);
  }
}
