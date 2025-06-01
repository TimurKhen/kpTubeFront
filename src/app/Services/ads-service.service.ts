import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdsServiceService {

  constructor() { }

  private adsInformation = [
    {
      "name": 'evgeniyaADS.jpg',
      "author": 'Пожилой Жека',
      "text": 'Наглые подростки совсем потеряли совесть и сделали ЭТО прямо в спальне родителей. Уберите детей от экранов!!!!!\n' +
        'Смотреть только на KPtube:  Пожилой Жека',
      "link": 'https://kptube.netlify.app/account/1725207636522'
    },
    {
      "name": '../KptubeLogo.svg',
      "author": 'KP229',
      "text": 'Здесь могла быть ваша реклама.',
      "link": 'https://t.me/gvinses'
    },
  ]

  generator() {
    const randomIndex = Math.floor(Math.random() * this.adsInformation.length)
    return this.adsInformation[randomIndex]
  }
}
