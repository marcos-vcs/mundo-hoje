import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { NewsDetailComponent } from 'src/app/components/news-detail/news-detail.component';
import { ToastService } from 'src/app/components/tools/toast.service';
import { Configuration } from 'src/app/models/configuration';
import { Item } from 'src/app/models/news';
import { FavoritesQuantityService } from 'src/app/services/favorites-quantity.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  //#region variaveis
  configuration: Configuration;
  news: Item[] = [];
  atualFilter: string;
  searchValue = '';
  today = new Date();
  startDate: Date;
  endDate: Date;
  loadDown = false;
  loadCenter = false;
  notFoundMsg = false;
  allLoadMsg = false;
  errorImage = '../../../assets/no-found.png';
  //#endregion

  constructor(
    private storage: StorageService,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private favoriteQuantityService: FavoritesQuantityService,
    private modalCtrl: ModalController,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.favoriteQuantityService.updateFavoriteQuantity();
    this.loadCenter = true;
    this.getNotices();
    this.loadCenter = false;
    this.storage.init();
    this.loadConfiguration();
  }

  async ionViewWillEnter() {
    this.loadConfiguration();
    await this.getNotices();
  }
  async ionPageWillLeave() {
    this.loadConfiguration();
    await this.getNotices();
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

  getSearchbarValue() {
    this.notFoundMsg = false;
    this.allLoadMsg = false;

    this.loadCenter = true;
    this.getNotices();
    this.loadCenter = false;
  }

  async getNotices() {
    this.notFoundMsg = false;
    this.allLoadMsg = false;

    if (this.searchValue.length !== 0) {
      await this.storage.openStore();
      const favorites = await (
        await this.storage.getItem('favorites')
      ).toString();
      const itens: Item[] = favorites ? (JSON.parse(favorites) as Item[]) : [];
      this.news = itens;
      this.news = this.news.filter((f) =>
        f.introducao.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    } else if (
      this.startDate &&
      this.endDate &&
      this.atualFilter === 'period'
    ) {
      await this.storage.openStore();
      const favorites = await (
        await this.storage.getItem('favorites')
      ).toString();
      const itens: Item[] = favorites ? (JSON.parse(favorites) as Item[]) : [];
      this.news = itens;
      const intervalos = [];
      this.startDate = new Date(this.startDate);
      this.endDate = new Date(this.endDate);
      intervalos.push(this.getFormattedDate(this.startDate));

      while (this.startDate < this.endDate) {
        this.startDate.setDate(this.startDate.getDate() + 1);
        intervalos.push(this.getFormattedDate(this.startDate));
      }
      console.log(intervalos);
      this.news = this.news.filter((f) => {
        intervalos.includes(f.data_publicacao);
      });
    } else {
      await this.storage.openStore();
      const favorites = await (
        await this.storage.getItem('favorites')
      ).toString();
      const itens: Item[] = favorites ? (JSON.parse(favorites) as Item[]) : [];
      this.news = itens;
    }

    this.notFoundMsg =
      this.news.length === 0 && !this.loadCenter ? true : false;
    this.allLoadMsg = this.news.length > 0 && !this.loadCenter ? true : false;
  }

  async removeNews(item: Item) {
    const alert = await this.alertController.create({
      subHeader: 'Tem certeza que deseja remover essa noticia dos favoritos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
        },
      ],
    });
    await alert.present();

    const role = await alert.onDidDismiss();

    if (role.role === 'confirm') {
      const index = this.news.findIndex((obj) => obj.id === item.id);
      this.news[index].save = item.save = false;
      await this.storage.openStore();
      const favorites = await (
        await this.storage.getItem('favorites')
      ).toString();
      let itens: Item[] = favorites ? (JSON.parse(favorites) as Item[]) : [];

      if (item.save) {
        itens.push(item);
      } else {
        itens = itens.filter((data) => data.id !== item.id);
      }

      this.storage.openStore();
      this.storage.setItem('favorites', JSON.stringify(itens));
      this.toast.presentToast(
        'Notícia removida dos itens favoritados.',
        'top',
        'danger'
      );

      this.loadCenter = true;
      setTimeout(() => {
        this.news = [];
        this.getNotices();
        this.loadCenter = false;
      }, 300);
    }
    this.favoriteQuantityService.updateFavoriteQuantity();
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

  doRefresh(event) {
    setTimeout(() => {
      this.news = [];
      this.startDate = null;
      this.endDate = null;
      this.searchValue = '';
      this.getNotices();
      event.target.complete();
    }, 100);
  }

  async openDetails(item: Item) {
    const modal = await this.modalCtrl.create({
      component: NewsDetailComponent,
      componentProps: { data: item },
    });
    modal.present();
    await modal.onWillDismiss();
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

  private getFormattedDate(date: Date) {
    date = new Date(date);
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '-' + day + '-' + year;
  }
}
