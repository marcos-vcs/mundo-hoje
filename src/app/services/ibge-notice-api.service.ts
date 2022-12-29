import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item, News, Photos } from '../models/news';

@Injectable({
  providedIn: 'root'
})
export class IbgeNoticeApiService {

  constructor(private http: HttpClient) { }

  getPhotos(url: string, images: string){
    const baseUrl = url.split('/')[0] + url.split('/')[1] + '//' + url.split('/')[2];
    const photos = new Photos();
    photos.image_fulltext = baseUrl + '/' + JSON.parse(images).image_fulltext;
    photos.image_intro = baseUrl + '/' + JSON.parse(images).image_intro;
    return photos;
  }

  get(page: number, limit: number): Observable<News>{
    return this.http.get<News>(`${environment.ibgeApi}/?qtd=${limit}&page=${page}`);
  }

  find(page: number, limit: number, findBy: string): Observable<News>{
    return this.http.get<News>(`${environment.ibgeApi}/?qtd=${limit}&page=${page}&busca=${findBy}`);
  }

  getByDate(initial: Date, final: Date){
    return this.http.get<News>(`${environment.ibgeApi}/?de=${this.getFormattedDate(initial)}&
    ate=${this.getFormattedDate(final)}`);
  }

  getArticle(item: Item): Observable<Item>{
    return this.http.post<Item>(`${environment.articleScrapingApi}`, item);
  }

  private getFormattedDate(date: Date){
    date = new Date(date);
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '-' + day + '-' + year;
  }
}
