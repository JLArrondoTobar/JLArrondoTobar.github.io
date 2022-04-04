import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AmplifyService } from 'aws-amplify-angular';
import { I18n } from '@aws-amplify/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  isLoggedIn: Boolean = false;
  user: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private amplifyService: AmplifyService,
    private alertController: AlertController
  ) {
    this.initializeApp();
    this.amplifyService.authStateChange$
      .subscribe(authState => {
          this.isLoggedIn = authState.state === 'signedIn';
          if (!authState.user) {
              this.user = null;
              localStorage.removeItem('jwtToken');
          } else {
              this.user = authState.user;
              console.log(this.user);
              if(this.user.signInUserSession){
                localStorage.setItem('jwtToken', this.user.signInUserSession.idToken.jwtToken);
              }
          }
      });
  }

  initializeApp() {
    /*console.log(window.innerWidth);
    console.log(window.outerWidth);
    console.log(window.innerHeight);
    console.log(window.outerHeight);*/
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#FA9933');
      this.statusBar.styleBlackOpaque();
      
      setTimeout (() => {
        this.splashScreen.hide();
      }, 1000);
    });
  }

  async changeLanguageToSpanish(){
    const alert = await this.alertController.create({
      header: 'Spanish',
      message: '<strong>Are you sure you want to change the language?</strong>',
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
            I18n.setLanguage('es');
          }
        }
      ]
    });

    await alert.present();
  }

  async changeLanguageToEnglish(){
    console.log("english!");
    const alert = await this.alertController.create({
      header: 'English',
      message: '<strong>Are you sure you want to change the language?</strong>',
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
            I18n.setLanguage('en');
          }
        }
      ]
    });

    await alert.present();
  }
}
