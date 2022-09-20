import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notice } from '../models/notice';

@Injectable({
  providedIn: 'root'
})
export class IbgeNoticeApiServiceService {

  constructor(private http: HttpClient) { }

  get(page: number, limit: number): Observable<Notice>{
    return this.http.get<Notice>(`${environment.ibgeApi}/?qtd=${limit}&page=${page}`);
  }

  find(page: number, limit: number, findBy: string): Observable<Notice>{
    return this.http.get<Notice>(`${environment.ibgeApi}/?qtd=${limit}&page=${page}&busca=${findBy}`);
  }

  getByDate(initial: Date, final: Date){
    return this.http.get<Notice>(`${environment.ibgeApi}/?de=${this.getFormattedDate(initial)}&
    ate=${this.getFormattedDate(final)}`);
  }

  private getFormattedDate(date: Date){
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '-' + day + '-' + year;
  }

}
