import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/components/tools/toast.service';
import { Item } from 'src/app/models/news';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  //#region variaveis
  notices: Item[] = [];
  searchValue = '';
  loadDown = false;
  loadCenter = false;
  notFoundMsg = false;
  allLoadMsg = false;
  //#endregion

  constructor(private storage: StorageService,
              private toast: ToastService) { }

  ngOnInit() {
    this.loadCenter = true;
    setTimeout(async ()=>{this.getNotices();},200);
    this.loadCenter = false;
    this.storage.init();
  }

  async ionViewWillEnter(){
    await this.getNotices();
  }
  async ionPageWillLeave(){
    await this.getNotices();
  }

  getSearchbarValue(){
    this.notFoundMsg = false;
    this.allLoadMsg = false;
    this.loadCenter = true;
    setTimeout(()=>{
      this.getNotices();
      this.loadCenter = false;
    },500);
  }

  async getNotices(){
    this.notFoundMsg = false;
    this.allLoadMsg = false;
    if(this.searchValue.length === 0){
      setTimeout(async ()=>{
        await this.storage.openStore();
        const favorites = await (await this.storage.getItem('favorites')).toString();
        let itens: Item[] = [];
        this.notices = [];

        if(favorites){
         itens =  JSON.parse(favorites) as Item[];
        }

        itens.forEach(i => {
          if(i !== undefined){
            this.notices?.push((i));
          }
        });

        this.notFoundMsg = this.notices.length === 0 && !this.loadCenter ? true : false;
        this.allLoadMsg = this.notices.length > 0 && !this.loadCenter ? true : false;
      }, 100);
    }else{
      setTimeout(async ()=>{
        await this.storage.openStore();
        const favorites = await (await this.storage.getItem('favorites')).toString();
        let itens: Item[] = [];

        if(favorites){
         itens =  JSON.parse(favorites) as Item[];
        }

        itens.forEach(i => {
          if(i !== undefined){
            this.notices?.push((i));
          }
        });
        this.notices = this.notices.filter(f => f.introducao.toLowerCase()
                                   .includes(this.searchValue.toLowerCase()));
        this.notFoundMsg = this.notices.length === 0 && !this.loadCenter ? true : false;
        this.allLoadMsg = this.notices.length > 0 && !this.loadCenter ? true : false;
      }, 100);
    }
  }

  async removeNotices(item: Item){
    const index = this.notices.findIndex((obj => obj.id === item.id));
    this.notices[index].save = item.save = false;
    await this.storage.openStore();
    const favorites = await (await this.storage.getItem('favorites')).toString();
    let itens: Item[] = [];

    if(favorites){
     itens =  JSON.parse(favorites) as Item[];
    }

    if(item.save){
      itens.push(item);
    }else{
      itens = itens.filter(data => data.id !== item.id);
    }

    this.storage.openStore();
    this.storage.setItem('favorites',JSON.stringify(itens));
    this.toast.presentToast('Notícia removida dos itens favoritados.', 'top', 'danger');

    this.loadCenter = true;
    setTimeout(()=>{
      this.notices = [];
      this.getNotices();
      this.loadCenter = false;
    },300);

  }

  doRefresh(event) {
    setTimeout(() => {
      this.notices = [];
      this.getNotices();
      event.target.complete();
    }, 100);
  }

}
