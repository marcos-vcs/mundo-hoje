import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  //#region variaveis
  loadDown = false;
  loadCenter = false;
  //#endregion

  constructor() { }

  ngOnInit() {
  }

}
