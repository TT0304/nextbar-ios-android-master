import { Component } from '@angular/core';
import { MenuController, ModalController, IonRouterOutlet, NavController } from '@ionic/angular';
import { HelperService } from '../helper.service';
import { Plugins } from '@capacitor/core';
import { HttpService } from '../providers/http.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: any;
  data: any =[];
  dataLoaded: boolean;
  gotovina: string;
  timer:any ;


  constructor(private navCtrl: NavController, private helper: HelperService,
    private serviceCall: HttpService,

    public menuCtrl: MenuController, public modalController: ModalController,

     ) {

    this.user = this.helper.getUser()
      console.log(this.user );
      this.menuCtrl.enable(true);
      let dt  = new Date();
      this.gotovina = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();

  }

  ionViewDidEnter() {

    this.getData()

    this.timer = setInterval(() => this.getData(), 30000);


  }

  async getData() {


    

    let params = {"gotovina":this.gotovina};
    
    if(this.user['prioritet']=='Konobar'){
      params['id_konobara']=this.user['id']
    }
    



    this.serviceCall.postData("stats/getAllActiveTables", params).subscribe(r => {
      console.log(r);
      this.dataLoaded = true;
      if (r.code ==200) {
     
        this.data = r.response;

      } else {
        this.data = [];


      }
    })
  }

   

  ionViewWillLeave() {
    clearInterval(this.timer)
  }

}
