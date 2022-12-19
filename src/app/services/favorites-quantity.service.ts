import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../models/news';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesQuantityService {

  quantity = new BehaviorSubject(0);

  constructor(private storage: StorageService) { }

  async updateFavoriteQuantity(){
    this.storage.init();
    await this.storage.openStore();
    const favorites = await (
      await this.storage.getItem('favorites')
    ).toString();
    const itens: Item[] = favorites ? (JSON.parse(favorites) as Item[]) : [];
    this.quantity.next(itens.length);
  }

}
