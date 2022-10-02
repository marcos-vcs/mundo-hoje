/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Item, Notice } from './../models/notice';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IbgeNoticeApiService } from '../services/ibge-notice-api.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { ToastService } from '../components/tools/toast.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  //#region variaveis
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  notice: Notice = new Notice();
  searchValue = '';
  allLoadMsg = false;
  notFoundMsg = false;
  loadCenter = false;
  private readonly limit = 10;
  private page = 1;
  //#endregion

  constructor(private noticeService: IbgeNoticeApiService,
              private storage: StorageService,
              private toast: ToastService) {
    this.notice.items = [];
  }

  async ngOnInit() {
    this.loadCenter = true;
    this.getNotices();
    this.loadCenter = false;
    this.storage.init();
  }

  getSearchbarValue(){
    this.page = 1;
    this.notice.items = [];
    this.notFoundMsg = false;
    this.allLoadMsg = false;
    this.loadCenter = true;
    setTimeout(()=>{
      this.findNotices();
      this.loadCenter = false;
    },500);
  }

  findNotices(){
    if(this.searchValue.length > 0){
      setTimeout(()=>{
        this.noticeService.find(this.page, this.limit, this.searchValue).subscribe(
          async (response) => {
            this.notFoundMsg = false;

            response.items.forEach(i => {
              if(i !== undefined){
                i.photos = this.noticeService.getPhotos(i.link, i.imagens);
                this.notice.items?.push((i));
              }
            });

            this.notice.count = response.count;
            this.notice.nextPage = response.nextPage;
            this.notice.page = response.page;
            this.notice.previousPage = response.previousPage;
            this.notice.showingFrom = response.showingFrom;
            this.notice.showingTo = response.showingTo;
            this.notice.totalPages = response.totalPages;

            this.notFoundMsg = this.notice.count > 0 ? false : true;
            this.allLoadMsg = this.notice.totalPages === this.notice.page && !this.notFoundMsg ? true : false;

            await this.storage.openStore();
            const favorites = await (await this.storage.getItem('favorites')).toString();
            let itens: Item[] = [];
            if(favorites){
             itens =  JSON.parse(favorites) as Item[];
            }

            console.log(itens);

            itens.forEach(item => {
              const index = this.notice.items.findIndex((obj => obj.id === item.id));
              if(index !== -1){
                this.notice.items[index].save = item.save;
              }
            });

          },
          (error) => {
            if(error.status === 0){
              this.page--;
              this.toast.presentToast('Você está sem internet :(','top','danger');
            }

            this.notFoundMsg = true;
            this.loadCenter = false;
          }
        );
      },100);
    }else{
      this.page = 1;
      this.notice.items = [];
      this.loadCenter = true;
      setTimeout(()=>{
        this.getNotices();
        this.loadCenter = false;
      },100);
    }
  }

  getNotices(){
    if(this.searchValue.length === 0){
      setTimeout(()=>{
        this.noticeService.get(this.page, this.limit).subscribe(
          async (response) => {
            this.notFoundMsg = false;
            this.allLoadMsg  = false;

            response.items.forEach(i => {
              if(i !== undefined){
                i.photos = this.noticeService.getPhotos(i.link, i.imagens);
                i.save = false;
                this.notice.items?.push((i));
              }
            });

            this.notice.count = response.count;
            this.notice.nextPage = response.nextPage;
            this.notice.page = response.page;
            this.notice.previousPage = response.previousPage;
            this.notice.showingFrom = response.showingFrom;
            this.notice.showingTo = response.showingTo;
            this.notice.totalPages = response.totalPages;

            this.notFoundMsg = this.notice.count > 0 ? false : true;
            this.allLoadMsg = this.notice.totalPages === this.notice.page && !this.notFoundMsg ? true : false;

            await this.storage.openStore();
            const favorites = await (await this.storage.getItem('favorites')).toString();
            let itens: Item[] = [];
            if(favorites){
             itens =  JSON.parse(favorites) as Item[];
            }

            itens.forEach(item => {
              const index = this.notice.items.findIndex((obj => obj.id === item.id));
              if(index !== -1){
                this.notice.items[index].save = item.save;
              }
            });

          },
          (error) => {
            if(error.status === 0){
              this.page--;
              this.allLoadMsg = true;
              this.toast.presentToast('Você está sem internet :(','top','danger');
            }

            this.notFoundMsg = true;
            this.loadCenter = false;
          }
        );
      },100);
    }
  }

  loadData(event) {
    setTimeout(() => {
      if(this.page < this.notice.totalPages){
        this.page++;
        this.searchValue.length > 0 ? this.findNotices() : this.getNotices();
      }
      event.target.complete();
    }, 100);
  }

  doRefresh(event) {
    setTimeout(() => {
      this.page = 1;
      this.notice.items = [];
      this.getNotices();
      event.target.complete();
    }, 100);
  }

  async favorite(item: Item){
    const index = this.notice.items.findIndex((obj => obj.id === item.id));
    this.notice.items[index].save = item.save ? false : true;

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

    if(this.notice.items[index].save){
      this.toast.presentToast('Notícia adicionada aos itens favoritados.', 'top', 'success');
    }else{
      this.toast.presentToast('Notícia removida dos itens favoritados.', 'top', 'danger');
    }
  }

}
