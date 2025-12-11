import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SourcesService {

  constructor(private _HttpClient: HttpClient) { }

  getSources(): Observable<any> {
    return this._HttpClient.get('sources');
  }

  getSourceById(id: number): Observable<any> {
    return this._HttpClient.get(`sources/show/${id}`);
  }

  addSource(data: any): Observable<any> {
    return this._HttpClient.post("sources/create", data, {
      headers: { "X-No-Spinner": "true" },
    });
  }

  editSource(data: any, id: number): Observable<any> {
    return this._HttpClient.put(`sources/update/${id}`, data, {
      headers: { "X-No-Spinner": "true" },
    });
  }

  deleteSource(id: number): Observable<any> {
    return this._HttpClient.delete(`sources/delete/${id}`, {
      headers: { "X-No-Spinner": "true" },
    });
  }
}
