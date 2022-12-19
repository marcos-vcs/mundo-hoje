import { Component, OnInit } from '@angular/core';
import { FavoritesQuantityService } from 'src/app/services/favorites-quantity.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  favoritesQuantity: number;

  constructor(
    private favoriteQuantityService: FavoritesQuantityService
  ) { }

  ngOnInit() {
    this.favoriteQuantityService.quantity.subscribe({
      next: (v) => {
        this.favoritesQuantity = v;
      }
    });
  }

}
