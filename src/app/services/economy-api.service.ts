/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coins, CoinsMetadata } from '../models/coins';

@Injectable({
  providedIn: 'root'
})
export class EconomyApiService {

  constructor(private http: HttpClient) { }

  getCoins(): Observable<Coins>{
    return this.http.get<Coins>(`${environment.economyApi}`);
  }

  getMetadata(coins: Coins): CoinsMetadata[]{
    const metadatas: CoinsMetadata[] = [];
    metadatas.push({
      code:        coins.USDBRL.code,
      codein:      coins.USDBRL.codein,
      name:        coins.USDBRL.name,
      high:        coins.USDBRL.high,
      low:         coins.USDBRL.low,
      varBid:      coins.USDBRL.varBid,
      pctChange:   coins.USDBRL.pctChange,
      bid:         coins.USDBRL.bid,
      ask:         coins.USDBRL.ask,
      timestamp:   coins.USDBRL.timestamp,
      create_date: coins.USDBRL.create_date
    });

    metadatas.push({
      code:        coins.USDBRLT.code,
      codein:      coins.USDBRLT.codein,
      name:        coins.USDBRLT.name,
      high:        coins.USDBRLT.high,
      low:         coins.USDBRLT.low,
      varBid:      coins.USDBRLT.varBid,
      pctChange:   coins.USDBRLT.pctChange,
      bid:         coins.USDBRLT.bid,
      ask:         coins.USDBRLT.ask,
      timestamp:   coins.USDBRLT.timestamp,
      create_date: coins.USDBRLT.create_date
    });

    metadatas.push({
      code:        coins.EURBRL.code,
      codein:      coins.EURBRL.codein,
      name:        coins.EURBRL.name,
      high:        coins.EURBRL.high,
      low:         coins.EURBRL.low,
      varBid:      coins.EURBRL.varBid,
      pctChange:   coins.EURBRL.pctChange,
      bid:         coins.EURBRL.bid,
      ask:         coins.EURBRL.ask,
      timestamp:   coins.EURBRL.timestamp,
      create_date: coins.EURBRL.create_date
    });

    metadatas.push({
      code:        coins.CNYBRL.code,
      codein:      coins.CNYBRL.codein,
      name:        coins.CNYBRL.name,
      high:        coins.CNYBRL.high,
      low:         coins.CNYBRL.low,
      varBid:      coins.CNYBRL.varBid,
      pctChange:   coins.CNYBRL.pctChange,
      bid:         coins.CNYBRL.bid,
      ask:         coins.CNYBRL.ask,
      timestamp:   coins.CNYBRL.timestamp,
      create_date: coins.CNYBRL.create_date
    });

    metadatas.push({
      code:        coins.GBPBRL.code,
      codein:      coins.GBPBRL.codein,
      name:        coins.GBPBRL.name,
      high:        coins.GBPBRL.high,
      low:         coins.GBPBRL.low,
      varBid:      coins.GBPBRL.varBid,
      pctChange:   coins.GBPBRL.pctChange,
      bid:         coins.GBPBRL.bid,
      ask:         coins.GBPBRL.ask,
      timestamp:   coins.GBPBRL.timestamp,
      create_date: coins.GBPBRL.create_date
    });

    metadatas.push({
      code:        coins.BTCBRL.code,
      codein:      coins.BTCBRL.codein,
      name:        coins.BTCBRL.name,
      high:        coins.BTCBRL.high,
      low:         coins.BTCBRL.low,
      varBid:      coins.BTCBRL.varBid,
      pctChange:   coins.BTCBRL.pctChange,
      bid:         coins.BTCBRL.bid,
      ask:         coins.BTCBRL.ask,
      timestamp:   coins.BTCBRL.timestamp,
      create_date: coins.BTCBRL.create_date
    });

    metadatas.push({
      code:        coins.ETHBRL.code,
      codein:      coins.ETHBRL.codein,
      name:        coins.ETHBRL.name,
      high:        coins.ETHBRL.high,
      low:         coins.ETHBRL.low,
      varBid:      coins.ETHBRL.varBid,
      pctChange:   coins.ETHBRL.pctChange,
      bid:         coins.ETHBRL.bid,
      ask:         coins.ETHBRL.ask,
      timestamp:   coins.ETHBRL.timestamp,
      create_date: coins.ETHBRL.create_date
    });

    metadatas.push({
      code:        coins.XRPBRL.code,
      codein:      coins.XRPBRL.codein,
      name:        coins.XRPBRL.name,
      high:        coins.XRPBRL.high,
      low:         coins.XRPBRL.low,
      varBid:      coins.XRPBRL.varBid,
      pctChange:   coins.XRPBRL.pctChange,
      bid:         coins.XRPBRL.bid,
      ask:         coins.XRPBRL.ask,
      timestamp:   coins.XRPBRL.timestamp,
      create_date: coins.XRPBRL.create_date
    });

    return metadatas;

  }

}
