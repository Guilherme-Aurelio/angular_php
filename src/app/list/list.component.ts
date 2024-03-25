import { FormsModule } from '@angular/forms';
import { PhpService } from '../php.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemService } from '../item.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent  implements OnInit {
  shoppingListId!: number;
  shoppingList: any = {};
  items: any[] = [];
  newItem: any = {};

  constructor(private route: ActivatedRoute, private phpService: PhpService, private itemService: ItemService) { }

  ngOnInit(): void {
    // Obter o ID da lista da URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.shoppingListId = +id; // Usando operador de asserção de não-nulidade
      // Carregar os detalhes da lista
      this.loadShoppingList();
      // Carregar os itens da lista
      this.loadItems();
    }
  }

  loadShoppingList() {
    this.phpService.getShoppingList(this.shoppingListId).subscribe(
      (data: any) => {
        this.shoppingList = data;
      },
      (error) => {
        console.log('Error loading shopping list:', error);
      }
    );
  }

  loadItems() {
    this.itemService.getItems(this.shoppingListId).subscribe(
      (data: any[]) => {
        this.items = data;
      },
      (error) => {
        console.log('Error loading items:', error);
      }
    );
  }

  createItem() {
    const newItemData = {
      name: this.newItem.name,
      quantity: this.newItem.quantity,
      completed: false,
      shopping_list_id: this.shoppingListId
    };

    this.itemService.createItem(this.shoppingListId, newItemData).subscribe(
      (data) => {
        console.log('Item created successfully:', data);
        this.items.push(data);
        if (!this.shoppingList.items) {
          this.shoppingList.items = [];
        }
        this.shoppingList.items.push(data);
        this.newItem = {};
      },
      (error) => {
        console.log('Error creating item:', error);
      }
    );
  }



  deleteItem(itemId: number) {
    console.log('Deleting item with ID:', itemId);
    this.itemService.deleteItem(this.shoppingListId, itemId).subscribe(
      () => {
        console.log('Item deleted successfully');
        // Remover o item da lista localmente
        this.items = this.items.filter(item => item.id !== itemId);
      },
      (error) => {
        console.log('Error deleting item:', error);
      }
    );
  }

  markItemAsBought(itemId: number) {
    this.itemService.updateItem(this.shoppingListId, itemId, { completed: true }).subscribe(
      () => {
        console.log('Item marked as bought successfully');
        this.loadItems(); // Recarregar a lista de itens após a atualização
      },
      (error) => {
        console.log('Error marking item as bought:', error);
      }
    );
  }
}
