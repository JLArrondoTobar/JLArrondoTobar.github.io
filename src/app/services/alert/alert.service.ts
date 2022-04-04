import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Tipster } from 'src/app/shared/tipster';
import { StorageService } from '../storage/storage.service';
import { TipsterService } from '../tipster/tipster.service';
import { Bet } from 'src/app/shared/bet';
import { BetService } from '../bet/bet.service';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController,
              private storageService: StorageService,
              private toastController: ToastController,
              private tipsterService: TipsterService,
              private betService: BetService,
              ) { }

  async presentToast(message: string, milliseconds: number, color? : string) {
    let toastClass = '';
    if (color){
      toastClass = 'toastClassColor';
    } else {
      toastClass = 'toastClassNormal';
    }

    if (color === 'error'){
      toastClass = 'toastClassError';
      const toast = await this.toastController.create({
        message: message,
        duration: milliseconds,
        cssClass: toastClass
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: message,
        duration: milliseconds,
        cssClass: toastClass,
        color: color
      });
      toast.present();
    }
  }

  async presentAlertDeleteTipster(totalTipsters: Array<Tipster>, index: number){
      const alert = await this.alertController.create({
        header: 'Delete Tipster',
        message: '<strong>Are you sure?</strong>',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
            }
          }, {
            text: 'Okay',
            handler: () => {
              this.tipsterService.removeFromList(totalTipsters, index);
              this.storageService.save(totalTipsters);
              this.presentToast('Tipster Deleted', 1000, 'error');
            }
          }
        ]
      });
  
      await alert.present();
  }

  async presentAlertDeleteBet(totalTipsters: Array<Tipster>, tipster: Tipster, totalActiveBets: Array<Bet>, bet: Bet){
    const alert = await this.alertController.create({
      header: 'Delete Bet',
      message: '<strong>Are you sure?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.tipsterService.deleteBet(tipster, bet);
            this.tipsterService.replaceTipsterFromList(totalTipsters, tipster);
            this.betService.removeFromActiveBets(totalActiveBets, bet);
            this.storageService.save(totalTipsters);
            this.presentToast('Bet Deleted', 1000, 'error');
          }
        }
      ]
    });

    await alert.present();

  }

  async presentAlertSingOut(){
    const alert = await this.alertController.create({
      header: 'Sign Out',
      message: '<strong>Are you sure?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            Auth.signOut({ global: true })
              .then(data => {
                localStorage.removeItem('jwtToken');
                this.presentToast('Signed out successfully', 2500, 'error');
              })
              .catch(err => console.log(err));
          }
        }
      ]
    });

    await alert.present();
  }
  
}
