/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Item, News } from '../models/news';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IbgeNoticeApiService } from '../services/ibge-notice-api.service';
import {
  ActionSheetController,
  IonInfiniteScroll,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { ToastService } from '../components/tools/toast.service';
import { StorageService } from '../services/storage.service';
import { NewsDetailComponent } from '../components/news-detail/news-detail.component';
import { Configuration } from '../models/configuration';
import { EconomyApiService } from '../services/economy-api.service';
import { CoinsMetadata } from '../models/coins';
import { FavoritesQuantityService } from '../services/favorites-quantity.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePage implements OnInit {
  //#region variaveis
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  errorImage = '../../../assets/no-found.png';
  today = new Date();
  startDate: Date;
  endDate: Date;
  atualFilter: string;
  configuration: Configuration;
  coins: CoinsMetadata[] = [];
  news: News = new News();
  searchValue = '';
  allLoadMsg = false;
  notFoundMsg = false;
  loadCenter = false;
  private readonly limit = 10;
  private page = 1;
  //#endregion

  constructor(
    private economyService: EconomyApiService,
    private newsService: IbgeNoticeApiService,
    private storage: StorageService,
    private socialSharing: SocialSharing,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private favoriteQuantityService: FavoritesQuantityService,
    private toast: ToastService
  ) {
    this.news.items = [];
  }

  async ngOnInit() {
    this.page = 1;
    this.loadCenter = true;
    this.getNews();
    this.loadCenter = false;
    this.storage.init();
    this.loadConfiguration();
    this.getCoins();
    setInterval(() => this.getCoins(), 30000);
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
      this.configuration = loadedConfigurations;
      if (loadedConfigurations.isDarkMode) {
        document.body.setAttribute('color-theme', 'dark');
      } else {
        document.body.setAttribute('color-theme', 'light');
      }
    }
  }

  async getSearchbarValue() {
    this.page = 1;
    this.news.items = [];
    this.notFoundMsg = false;
    this.allLoadMsg = false;

    this.loadCenter = true;
    this.findNews();
    this.loadCenter = false;
  }

  getCoins() {
    this.economyService.getCoins().subscribe({
      next: (v) => {
        this.coins = this.economyService.getMetadata(v);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  findNews() {
    if (this.searchValue.length > 0) {
      this.newsService.find(this.page, this.limit, this.searchValue).subscribe({
        next: async (v) => {
          this.notFoundMsg = false;

          v.items.forEach(async (i) => {
            if (i) {
              i.photos = this.newsService.getPhotos(i.link, i.imagens);
              i.save = await this.isFavorited(i);
            }
          });
          v.items.forEach((i) => this.news.items.push(i));
          const itensPreUpdate = this.news.items;
          this.news = v;
          this.news.items = itensPreUpdate;

          this.notFoundMsg = this.news.count > 0 ? false : true;
          this.allLoadMsg =
            this.news.totalPages === this.news.page && !this.notFoundMsg
              ? true
              : false;
        },
        error: (e) => {
          if (e.status === 0) {
            this.page--;
            this.toast.presentToast(
              'Você está sem internet :(',
              'top',
              'danger'
            );
          }

          this.notFoundMsg = true;
          this.loadCenter = false;
        },
      });
    } else if (
      this.startDate &&
      this.endDate &&
      this.atualFilter === 'period'
    ) {
      this.newsService.getByDate(this.startDate, this.endDate).subscribe({
        next: (v) => {
          this.notFoundMsg = false;

          v.items.forEach(async (i) => {
            if (i) {
              i.photos = this.newsService.getPhotos(i.link, i.imagens);
              i.save = await this.isFavorited(i);
            }
          });
          v.items.forEach((i) => this.news.items.push(i));
          const itensPreUpdate = this.news.items;
          this.news = v;
          this.news.items = itensPreUpdate;

          this.notFoundMsg = this.news.count > 0 ? false : true;
          this.allLoadMsg =
            this.news.totalPages === this.news.page && !this.notFoundMsg
              ? true
              : false;
        },
        error: (e) => {
          if (e.status === 0) {
            this.page--;
            this.toast.presentToast(
              'Você está sem internet :(',
              'top',
              'danger'
            );
          }

          this.notFoundMsg = true;
          this.loadCenter = false;
        },
      });
    } else {
      this.page = 1;
      this.news.items = [];

      this.loadCenter = true;
      this.getNews();
      this.loadCenter = false;
    }
  }

  getNews() {
    if (this.searchValue.length === 0) {
      this.newsService.get(this.page, this.limit).subscribe({
        next: async (v) => {
          this.notFoundMsg = false;
          this.allLoadMsg = false;

          v.items.forEach(async (i) => {
            if (i) {
              i.photos = this.newsService.getPhotos(i.link, i.imagens);
              i.save = await this.isFavorited(i);
            }
          });
          v.items.forEach((i) => this.news.items.push(i));
          const itensPreUpdate = this.news.items;
          this.news = v;
          this.news.items = itensPreUpdate;

          this.notFoundMsg = this.news.items.length > 0 ? false : true;
          this.allLoadMsg =
            this.news.totalPages === this.news.page && !this.notFoundMsg
              ? true
              : false;
        },
        error: (e) => {
          if (e.status === 0) {
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
        },
        complete: () => {
          this.loadCenter = false;
        },
      });
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
      this.startDate = null;
      this.endDate = null;
      this.searchValue = '';
      this.getNews();
      this.getCoins();
      event.target.complete();
    }, 100);
  }

  async openDetails(item: Item) {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando os detalhes da notícia. Aguarde...',
      duration: 10000,
    });

    loading.present();

    this.newsService.getArticle(item).subscribe({
      next: async (v) => {
        item = v;
        item.article.textIndented = [];
        item.article.text
          .split('<br>')
          .forEach((p) => item.article.textIndented.push(p));

        const modal = await this.modalCtrl.create({
          component: NewsDetailComponent,
          componentProps: { data: item },
        });
        modal.present();
        await modal.onWillDismiss();
      },
      error: (e) => {
        loading.dismiss();
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
    const loading = await this.loadingCtrl.create({
      message: 'Carregando, aguarde...',
      duration: 10000,
    });

    loading.present();

    this.newsService.getArticle(item).subscribe({
      next: async (v) => {
        item = v;
        item.article.textIndented = [];
        item.article.text
          .split('<br>')
          .forEach((p) => item.article.textIndented.push(p));
        const index = this.news.items.findIndex((obj) => obj.id === item.id);
        this.news.items[index].save = !item.save;

        await this.storage.openStore();
        const favorites = await (
          await this.storage.getItem('favorites')
        ).toString();
        let itens: Item[] = favorites ? (JSON.parse(favorites) as Item[]) : [];

        if (!itens.find((i) => i.id === item.id)) {
          item.save = true;
          itens.push(item);
        } else {
          this.news.items[index].save = false;
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
        this.favoriteQuantityService.updateFavoriteQuantity();
      },
      error: (e) => {
        this.toast.presentToast(
          'Não foi possível favoritar a notícia :(',
          'top',
          'danger'
        );
        this.favoriteQuantityService.updateFavoriteQuantity();
        console.log(e);
      },
      complete: () => {
        loading.dismiss();
      },
    });
  }

  shareNews(item: Item) {
    this.socialSharing
      .share(null, null, null, item.link)
      .then(() => {
        this.toast.presentToast(
          'Notícia compartilhada com sucesso',
          'top',
          'success'
        );
      })
      .catch(() => {
        this.toast.presentToast(
          'Erro ao compartilhar notícia',
          'top',
          'danger'
        );
      });
  }

  async filterActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecione o filtro',
      buttons: [
        {
          text: 'Filtrar por palavra chave',
          role: 'keyword',
        },
        {
          text: 'Filtrar por período',
          role: 'period',
        },
      ],
    });

    await actionSheet.present();
    const role = await actionSheet.onDidDismiss();
    this.atualFilter = role.role !== 'backdrop' ? role.role : this.atualFilter;

    if (this.atualFilter !== 'backdrop') {
      this.startDate = null;
      this.endDate = null;
      this.searchValue = '';
    }
  }

  private async isFavorited(item: Item): Promise<boolean> {
    await this.storage.openStore();
    const favorites = await (
      await this.storage.getItem('favorites')
    ).toString();
    const itens: Item[] = favorites ? (JSON.parse(favorites) as Item[]) : [];
    return itens.find((i) => i.id === item.id) ? true : false;
  }
}
