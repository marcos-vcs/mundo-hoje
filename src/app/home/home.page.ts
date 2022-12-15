/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Item, News } from '../models/news';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IbgeNoticeApiService } from '../services/ibge-notice-api.service';
import {
  IonInfiniteScroll,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { ToastService } from '../components/tools/toast.service';
import { StorageService } from '../services/storage.service';
import { NewsDetailComponent } from '../components/news-detail/news-detail.component';
import { Configuration } from '../models/configuration';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  //#region variaveis
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  news: News = new News();
  searchValue = '';
  allLoadMsg = false;
  notFoundMsg = false;
  loadCenter = false;
  private readonly limit = 10;
  private page = 1;
  //#endregion

  constructor(
    private newsService: IbgeNoticeApiService,
    private storage: StorageService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private toast: ToastService
  ) {
    this.news.items = [];
  }

  async ngOnInit() {
    this.loadCenter = true;
    this.getNews();
    this.loadCenter = false;
    this.storage.init();
    this.loadConfiguration();
  }

  async ionViewWillEnter() {
    this.news.items = [];
    this.ngOnInit();
  }

  async ionPageWillLeave() {
    this.news.items = [];
    this.ngOnInit();
  }

  async loadConfiguration() {
    await this.storage.openStore();
    const configuration = await (
      await this.storage.getItem('configurations')
    ).toString();

    if (configuration) {
      const loadedConfigurations = JSON.parse(configuration) as Configuration;
      console.log(loadedConfigurations);

      if (loadedConfigurations.isDarkMode) {
        document.body.setAttribute('color-theme', 'dark');
      } else {
        document.body.setAttribute('color-theme', 'light');
      }

    }
  }

  getSearchbarValue() {
    this.page = 1;
    this.news.items = [];
    this.notFoundMsg = false;
    this.allLoadMsg = false;
    this.loadCenter = true;
    setTimeout(() => {
      this.findNews();
      this.loadCenter = false;
    }, 500);
  }

  findNews() {
    if (this.searchValue.length > 0) {
      setTimeout(() => {
        this.newsService
          .find(this.page, this.limit, this.searchValue)
          .subscribe(
            async (response) => {
              this.notFoundMsg = false;

              response.items.forEach((i) => {
                if (i !== undefined) {
                  i.photos = this.newsService.getPhotos(i.link, i.imagens);
                  this.news.items?.push(i);
                }
              });

              this.news.count = response.count;
              this.news.nextPage = response.nextPage;
              this.news.page = response.page;
              this.news.previousPage = response.previousPage;
              this.news.showingFrom = response.showingFrom;
              this.news.showingTo = response.showingTo;
              this.news.totalPages = response.totalPages;

              this.notFoundMsg = this.news.count > 0 ? false : true;
              this.allLoadMsg =
                this.news.totalPages === this.news.page && !this.notFoundMsg
                  ? true
                  : false;

              await this.storage.openStore();
              const favorites = await (
                await this.storage.getItem('favorites')
              ).toString();
              let itens: Item[] = [];
              if (favorites) {
                itens = JSON.parse(favorites) as Item[];
              }

              console.log(itens);

              itens.forEach((item) => {
                const index = this.news.items.findIndex(
                  (obj) => obj.id === item.id
                );
                if (index !== -1) {
                  this.news.items[index].save = item.save;
                }
              });
            },
            (error) => {
              if (error.status === 0) {
                this.page--;
                this.toast.presentToast(
                  'Você está sem internet :(',
                  'top',
                  'danger'
                );
              }

              this.notFoundMsg = true;
              this.loadCenter = false;
            }
          );
      }, 100);
    } else {
      this.page = 1;
      this.news.items = [];
      this.loadCenter = true;
      setTimeout(() => {
        this.getNews();
        this.loadCenter = false;
      }, 100);
    }
  }

  getNews() {
    if (this.searchValue.length === 0) {
      setTimeout(() => {
        this.newsService.get(this.page, this.limit).subscribe(
          async (response) => {
            this.notFoundMsg = false;
            this.allLoadMsg = false;

            response.items.forEach((i) => {
              if (i !== undefined) {
                i.photos = this.newsService.getPhotos(i.link, i.imagens);
                i.save = false;
                this.news.items?.push(i);
              }
            });

            this.news.count = response.count;
            this.news.nextPage = response.nextPage;
            this.news.page = response.page;
            this.news.previousPage = response.previousPage;
            this.news.showingFrom = response.showingFrom;
            this.news.showingTo = response.showingTo;
            this.news.totalPages = response.totalPages;

            this.notFoundMsg = this.news.count > 0 ? false : true;
            this.allLoadMsg =
              this.news.totalPages === this.news.page && !this.notFoundMsg
                ? true
                : false;

            await this.storage.openStore();
            const favorites = await (
              await this.storage.getItem('favorites')
            ).toString();
            let itens: Item[] = [];
            if (favorites) {
              itens = JSON.parse(favorites) as Item[];
            }

            itens.forEach((item) => {
              const index = this.news.items.findIndex(
                (obj) => obj.id === item.id
              );
              if (index !== -1) {
                this.news.items[index].save = item.save;
              }
            });
          },
          (error) => {
            if (error.status === 0) {
              this.page--;
              this.allLoadMsg = true;
              this.toast.presentToast(
                'Você está sem internet :(',
                'top',
                'danger'
              );
            }

            this.notFoundMsg = true;
            this.loadCenter = false;
          }
        );
      }, 100);
    }
  }

  loadData(event) {
    setTimeout(() => {
      if (this.page < this.news.totalPages) {
        this.page++;
        this.searchValue.length > 0 ? this.findNews() : this.getNews();
      }
      event.target.complete();
    }, 100);
  }

  doRefresh(event) {
    setTimeout(() => {
      this.page = 1;
      this.news.items = [];
      this.getNews();
      event.target.complete();
    }, 100);
  }

  async openDetails(item: Item) {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando os detalhes da notícia 📜 Aguarde...',
      duration: 10000,
    });

    loading.present();

    this.newsService.getArticle(item).subscribe({
      next: async (v) => {
        item = v;

        const modal = await this.modalCtrl.create({
          component: NewsDetailComponent,
          componentProps: { data: item },
        });
        modal.present();
        await modal.onWillDismiss();
      },
      error: (e) => {
        this.toast.presentToast(
          'Erro ao carregar detalhes da noticia :(',
          'top',
          'danger'
        );
        console.log(e);
      },
      complete: () => {
        loading.dismiss();
      },
    });
  }

  async favorite(item: Item) {
    this.newsService.getArticle(item).subscribe({
      next: async (v) => {
        item = v;

        const index = this.news.items.findIndex((obj) => obj.id === item.id);
        this.news.items[index].save = item.save ? false : true;

        await this.storage.openStore();
        const favorites = await (
          await this.storage.getItem('favorites')
        ).toString();
        let itens: Item[] = [];

        if (favorites) {
          itens = JSON.parse(favorites) as Item[];
        }

        if (item.save) {
          itens.push(item);
        } else {
          itens = itens.filter((data) => data.id !== item.id);
        }

        this.storage.openStore();
        this.storage.setItem('favorites', JSON.stringify(itens));

        if (this.news.items[index].save) {
          this.toast.presentToast(
            'Notícia adicionada aos itens favoritados.',
            'top',
            'success'
          );
        } else {
          this.toast.presentToast(
            'Notícia removida dos itens favoritados.',
            'top',
            'danger'
          );
        }
      },
      error: (e) => {
        this.toast.presentToast(
          'Não foi possível favoritar a notícia :(',
          'top',
          'danger'
        );
        console.log(e);
      },
    });
  }
}
