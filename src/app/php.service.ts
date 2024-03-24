import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhpService {

  private apiUrl = 'http://localhost:8000/api/shoppingList';

  constructor(private http: HttpClient) {}

  getShoppingLists(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getShoppingList(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createShoppingList(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateShoppingList(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteShoppingList(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
