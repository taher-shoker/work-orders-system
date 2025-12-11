import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceModelService {

  constructor(private http: HttpClient) { }
 
   getAllDeviceModel(): Observable<any> {
     return this.http.get(`device_models`);
   }
   addDeviceModel(data: any): Observable<any> {
     return this.http.post(`device_models/create`, data, {
       headers: { "X-No-Spinner": "true" },
     });
   }
   updateDeviceModel(data: any, id: string): Observable<any> {
     return this.http.put(`device_models/update/${id}`, data, {
       headers: { "X-No-Spinner": "true" },
     });
   }
   deleteDeviceModel(id: string): Observable<any> {
     return this.http.delete(`device_models/delete/${id}`, {
       headers: { "X-No-Spinner": "true" },
     });
   }
   getDeviceModelById(id:string): Observable<any> {
     return this.http.get(`device_models/show/${id}`)
   }
 
}
