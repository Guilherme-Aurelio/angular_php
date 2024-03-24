import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl = 'http://localhost:8000/api'; // Ajuste conforme sua rota

  constructor(private http: HttpClient) {}

  getItems(shoppingListId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/shoppingList/${shoppingListId}/items`);
  }

  createItem(shoppingListId: number, newItemData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/shoppingList/${shoppingListId}/items`, newItemData);
  }

  updateItem(shoppingListId: number, itemId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/shoppingList/${shoppingListId}/items/${itemId}`, data);
  }

  deleteItem(shoppingListId: number, itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/shoppingList/${shoppingListId}/items/${itemId}`);
  }

}
