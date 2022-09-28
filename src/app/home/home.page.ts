import { Notice } from './../models/notice';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IbgeNoticeApiService } from '../services/ibge-notice-api.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { AlertService } from '../components/tools/alert.service';
import { ToastService } from '../components/tools/toast.service';

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
  allLoads = false;
  loadCenter = false;
  notFoundMsg = false;
  private readonly limit = 10;
  private page = 1;
  //#endregion

  constructor(private noticeService: IbgeNoticeApiService,
              private toast: ToastService) {
    this.notice.items = [];
  }

  ngOnInit() {
    this.loadCenter = true;
    this.getNotices();
    this.loadCenter = false;
  }

  getSearchbarValue($event: any){
    this.page = 1;
    this.notice.items = [];
    this.loadCenter = true;
    setTimeout(()=>{
      this.findNotices();
      this.loadCenter = false;
    },200);
  }

  findNotices(){
    if(this.searchValue.length > 0){
      setTimeout(()=>{
        this.noticeService.find(this.page, this.limit, this.searchValue).subscribe(
          (response) => {
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

            this.allLoads = this.notice.totalPages === this.page ? true : false;
          },
          (error) => {
            if(error.status === 0){
              this.page--;
              this.allLoads = true;
              this.toast.presentToast('Você está sem internet :(','top','danger');
            }

            this.notFoundMsg = true;
            this.loadCenter = false;
          }
        );
      },200);
    }else{
      this.page = 1;
      this.notice.items = [];
      this.loadCenter = true;
      setInterval(()=>{
        this.getNotices();
        this.loadCenter = false;
      },200);
    }
  }

  getNotices(){
    if(this.searchValue.length === 0){
      setTimeout(()=>{
        this.noticeService.get(this.page, this.limit).subscribe(
          (response) => {
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

           this.allLoads = this.notice.totalPages === this.page ? true : false;
           this.notFoundMsg = false;

          },
          (error) => {
            if(error.status === 0){
              this.page--;
              this.allLoads = true;
              this.toast.presentToast('Você está sem internet :(','top','danger');
            }

            this.notFoundMsg = true;
            this.loadCenter = false;
          }
        );
      },200);
    }
  }

  loadData(event) {
    setTimeout(() => {
      if(this.page < this.notice.totalPages){
        if(this.searchValue.length > 0){
          this.page++;
          this.findNotices();
        }else{
          this.page++;
          this.getNotices();
        }
      }
      event.target.complete();

    }, 200);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  doRefresh(event) {
    setTimeout(() => {
      this.page = 1;
      this.notice.items = [];
      this.getNotices();
      event.target.complete();
    }, 200);
  }

}
