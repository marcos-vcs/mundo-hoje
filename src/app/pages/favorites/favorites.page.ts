import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewsDetailComponent } from 'src/app/components/news-detail/news-detail.component';
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
  news: Item[] = [];
  searchValue = '';
  loadDown = false;
  loadCenter = false;
  notFoundMsg = false;
  allLoadMsg = false;
  //#endregion

  constructor(private storage: StorageService,
              private modalCtrl: ModalController,
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
        this.news = [];

        if(favorites){
         itens =  JSON.parse(favorites) as Item[];
        }

        itens.forEach(i => {
          if(i !== undefined){
            this.news?.push((i));
          }
        });

        this.notFoundMsg = this.news.length === 0 && !this.loadCenter ? true : false;
        this.allLoadMsg = this.news.length > 0 && !this.loadCenter ? true : false;
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
            this.news?.push((i));
          }
        });
        this.news = this.news.filter(f => f.introducao.toLowerCase()
                                   .includes(this.searchValue.toLowerCase()));
        this.notFoundMsg = this.news.length === 0 && !this.loadCenter ? true : false;
        this.allLoadMsg = this.news.length > 0 && !this.loadCenter ? true : false;
      }, 100);
    }
  }

  async removeNews(item: Item){
    const index = this.news.findIndex((obj => obj.id === item.id));
    this.news[index].save = item.save = false;
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
      this.news = [];
      this.getNotices();
      this.loadCenter = false;
    },300);

  }

  doRefresh(event) {
    setTimeout(() => {
      this.news = [];
      this.getNotices();
      event.target.complete();
    }, 100);
  }

  async openDetails(item: Item){
    const modal = await this.modalCtrl.create({
      component: NewsDetailComponent,
      componentProps: {data: item}
    });
    modal.present();
    await modal.onWillDismiss();
  }

}
