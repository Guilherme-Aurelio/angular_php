import { FormsModule } from '@angular/forms';
import { PhpService } from '../php.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemService } from '../item.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  shoppingLists: any[] = [];
  newShoppingList: any = {};
  items: any[] = [];
  newItem: any = {};

  constructor(private phpService: PhpService, private itemService: ItemService, private router: Router) { }

  ngOnInit(): void {
    this.loadShoppingLists();
    this.loadItems
  }

  loadShoppingLists() {
    this.phpService.getShoppingLists().subscribe(
      (data: any[]) => {
        this.shoppingLists = data;
        this.shoppingLists.forEach(list => {
          this.loadItems(list.id);
        });
      },
      (error) => {
        console.log('Error loading shopping lists:', error);
      }
    );
  }

  createShoppingList() {
    this.phpService.createShoppingList(this.newShoppingList).subscribe(
      (data: any) => {
        console.log('Shopping list created successfully:', data);
        this.loadShoppingLists();
        this.newShoppingList = {};
        // Redirecionar para a página da lista recém-criada
        this.router.navigate(['/list', data.id]); // Assumindo que a resposta do servidor contém o ID da lista criada
      },
      (error) => {
        console.log('Error creating shopping list:', error);
      }
    );
  }

  deleteShoppingList(id: number) {
    this.phpService.deleteShoppingList(id).subscribe(
      () => {
        console.log('Shopping list deleted successfully');
        this.loadShoppingLists();
      },
      (error) => {
        console.log('Error deleting shopping list:', error);
      }
    );
  }

  loadItems(shoppingListId: number) {
    this.itemService.getItems(shoppingListId).subscribe(
      (data: any[]) => {
        this.items = data;
      },
      (error) => {
        console.log('Error loading items:', error);
      }
    );
  }

  createItem(shoppingListId: number) {
    const newItemData = {
      name: this.newItem.name,
      quantity: this.newItem.quantity,
      completed: false,
      shopping_list_id: shoppingListId
    };

    this.itemService.createItem(shoppingListId, newItemData).subscribe(
      (data) => {
        console.log('Item created successfully:', data);
        const shoppingListIndex = this.shoppingLists.findIndex(list => list.id === shoppingListId);
        if (shoppingListIndex !== -1) {
          if (!this.shoppingLists[shoppingListIndex].items) {
            this.shoppingLists[shoppingListIndex].items = [];
          }
          this.shoppingLists[shoppingListIndex].items.push(data);
        } else {
          console.error('Shopping list not found');
        }
        this.newItem = {};
      },
      (error) => {
        console.log('Error creating item:', error);
      }
    );
  }

  deleteItem(shoppingListId: number, itemId: number) {
    console.log('Deleting item with ID:', itemId);
    this.itemService.deleteItem(shoppingListId, itemId).subscribe(
      () => {
        console.log('Item deleted successfully');
        this.loadItems(shoppingListId);
      },
      (error) => {
        console.log('Error deleting item:', error);
      }
    );
  }

  markItemAsBought(shoppingListId: number, itemId: number) {
    this.itemService.updateItem(shoppingListId, itemId, { completed: true }).subscribe(
      () => {
        console.log('Item marked as bought successfully');
        this.loadShoppingLists();
      },
      (error) => {
        console.log('Error marking item as bought:', error);
      }
    );
  }
}
