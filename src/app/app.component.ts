import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { HelperService } from './helper.service';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { HttpService } from './providers/http.service';
import { environment } from 'src/environments/environment';
const { Storage, SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  user: any = {
    name: '',
  };
  public appPages = [];
  userType: string = '';
  constructor(
    private platform: Platform,
    private helper: HelperService,
    private navCtrl: NavController,
    private router: Router,
    private serviceCall: HttpService
  ) {
    this.initializeApp();

    Storage.get({
      key: 'configuration',
    }).then((s) => {
      if (s.value) {
        console.log(s.value);
        let url = 'http://' + s.value + environment.nextBarDomain;
        this.serviceCall.setConfiguration(url);
      }
    });

    this.helper.getUserDetail().subscribe((data) => {
      console.log(data);
      this.user = data;
      // this.checkUserData()
      this.setupMenu();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.user = this.helper.getUser();
      console.log(this.user);
      // this.checkUserData()
    });
  }

  async checkUserData() {
    const ret = await Storage.get({ key: 'userProfile' }).then((v) => {
      if (v.value) {
        v = JSON.parse(v.value);
        this.user = v;
        this.helper.setUser(v);
        this.setupMenu();
        // this.helper.gotoPage("/waiter-tables");
        this.helper.gotoPage('/home');
        // this.helper.gotoPage("/reports");
        // this.helper.gotoPage("/waiter-tables");

        // SplashScreen.hide()
      } else {
        // SplashScreen.hide()
      }
    });
    // const user = JSON.parse(ret.value);
  }

  async logout() {
    await Storage.remove({ key: 'userProfile' }).then(() => {
      this.helper.setUser({});
      this.navCtrl.navigateRoot('/login');
    });
  }

  setupMenu() {
    this.userType = this.user.prioritet;

    this.appPages = [
      {
        title: 'Home',
        url: '/home',
        icon: 'home',
      },
      {
        title: 'Aktivni stolovi',
        url: '/tables',
        icon: 'albums-outline',
      },
      {
        title: 'Artikli',
        url: '/home/articles',
        icon: 'fast-food-outline',
      },
      {
        title: 'Osoblje',
        url: '/waiters',
        icon: 'people-outline',
      },
      {
        title: 'Komitenti',
        url: '/customers',
        icon: 'people-circle-outline',
      },
      {
        title: 'Dobavljaci',
        url: '/suppliers',
        icon: 'briefcase-outline',
      },
      {
        title: 'Izvestaji',
        url: '/reports',
        icon: 'briefcase-outline',
      },
    ];

    if (this.user.prioritet == 'Konobar') {
      this.appPages = [
        {
          title: 'Home',
          url: '/home',
          icon: 'home',
        },
        {
          title: 'Aktivni stolovi',
          url: '/waiter-tables',
          icon: 'albums-outline',
        },
      ];
    }
  }
}
