import { Notice } from './../models/notice';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IbgeNoticeApiService } from '../services/ibge-notice-api.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  //#region variaveis
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  notice: Notice = new Notice();
  allLoads = false;
  loadCenter = false;
  private readonly limit = 10;
  private page = 1;
  //#endregion

  constructor(private noticeService: IbgeNoticeApiService) {
    this.notice.items = [];
  }

  ngOnInit() {
    this.getNotices();
  }

  getNotices(){
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

        if(this.notice.totalPages === this.page){
          this.allLoads = true;
        }
        else{
          this.allLoads = false;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadData(event) {
    setTimeout(() => {
      if(this.page < this.notice.totalPages){
        this.page++;
        this.getNotices();
      }
      event.target.complete();

    }, 500);
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
    }, 500);
  }

}
