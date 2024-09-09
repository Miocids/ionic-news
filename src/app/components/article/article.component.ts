import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@capacitor/inappbrowser';
import { Share } from '@capacitor/share';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

  @Input() article!: Article;

  @Input() index!: number;

  constructor(
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private storageService: StorageService
  ) { }

  async openArticle(){

    if(this.platform.is('ios') || this.platform.is('android')){
      const browser = await InAppBrowser.openInExternalBrowser({
        url: this.article.url
      });
    }

    window.open(this.article.url,'_blank');

  }

  async onOpenMenu(){

    const articleInFavorite = this.storageService.articleInFavorites(this.article);

    const share: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    };

    const normalBts: ActionSheetButton[] = [
      {
        text: articleInFavorite? 'Remover Favorito': 'Favorito',
        icon: articleInFavorite? 'heart':  'heart-outline',
        handler: () => this.onToggleFavorite()
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel',
        cssClass: 'secondary'
      }
    ]

    // if(this.platform.is('capacitor')){
      normalBts.unshift(share);
    // }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: normalBts
    });

    await actionSheet.present();

  }

  async onShareArticle(){

    await Share.share({
      title: this.article.title,
      text: this.article.source.name,
      dialogTitle: 'Compartir',
      url: this.article.url
    });

    // console.log('Share article');
  }

  onToggleFavorite(){
    this.storageService.saveRemoveArticle(this.article);
  }

}
