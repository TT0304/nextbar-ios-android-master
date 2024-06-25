import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HelperService } from '../helper.service';
import { HttpService } from '../providers/http.service';
import { environment } from 'src/environments/environment';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { filter } from "lodash";
import { ActivatedRoute } from '@angular/router';
import { OrderConfirmationPage } from '../order-confirmation/order-confirmation.page';

@Component({
  selector: 'app-waiter-articles',
  templateUrl: './waiter-articles.page.html',
  styleUrls: ['./waiter-articles.page.scss'],
})
export class WaiterArticlesPage implements OnInit {
  user: any;
  data: any = [];
  mediaUrl: string;
  dataLoaded: boolean = false;
  env: any = {};
  skeleton: any[];
  search: string = ""
  removeItem: any;
  removeIndex: any;
  mediaPath: string = ""
  categories: any[];
  categories2: any[];
  selectedText2: string;
  selectedText: string;
  frm: any;
  artikli_id_kat1: string;
  artikli_id_kat2: string;
  stolovi_id: string;
  imeStola: string;
  type: any;
  orderId: any;

  constructor(private helper: HelperService,
    private serviceCall: HttpService,
    private activatedRoute: ActivatedRoute,
    private nav: NavController,
    private modalController: ModalController

  ) {
    this.user = this.helper.getUser();
    this.env = environment
  }

  ngOnInit() {
    this.skeleton = this.helper.getSkeletonItem();
    this.mediaPath = environment.mediaPath;
  }

  ionViewDidEnter() {

    this.getData()
    this.getCategories();

    this.activatedRoute.paramMap.subscribe((p: any) => {

      if (p.keys.length != 0) {

        this.stolovi_id = p.get("stolovi_id");
        this.imeStola = p.get("imeStola");
        this.type = p.get("type");
        this.orderId = p.get("id");

      }
    });


  }



  async getData() {

    let params: any = {};


    this.serviceCall.getDetails("Artikli/getAllActiveArtikliCustom", params).subscribe(r => {
      console.log(r);
      this.dataLoaded = true;
      if (r.code == 200) {
        let _data = r.response;

        _data.forEach(e => {
            e.kategorije2_id = parseInt(e.kategorije2_id);
        }); 

        this.data = _data;

      } else {
        this.data = [];


      }
    })
  }




  getCategories() {



    this.serviceCall.getDetails("KategoriOne/getAllActiveKategorije", {}).subscribe(r => {
      console.log(r);
      if (r.code == 403) {
        this.categories = []
        this.categories2 = []
        this.selectedText2 = ""

      } else if (r.code == 200) {
        this.categories = r.response
        this.categories2 = []
        this.selectedText2 = ""
      } else {
        this.categories = []
        this.categories2 = []
        this.selectedText2 = ""

      }


      this.selectedText2 = ""
    })



  }



  getCategories2() {

    this.selectedText2 = ""
    if (this.artikli_id_kat1) {
      // this.search = this.artikli_id_kat1;
      this.serviceCall.getDetails("KategoriTwo/getAllActiveKategorije/" + this.artikli_id_kat1, {}).subscribe(r => {
        console.log(r);
        if (r.code == 403) {
          this.categories2 = []
        } else if (r.code == 200) {
          this.categories2 = r.response


        } else {
          this.categories2 = []
        }


      })
    } else {
      this.categories2 = []
      this.selectedText2 = ""
    }



  }

  updateSearch() {
    this.search = this.artikli_id_kat2;
  }


  addQty(item) {
    item.kolacina++;
  }
  removeQty(item) {
    let qty = item.kolacina - 1;
    if (qty < 0) {
      item.kolacina = 0;

    } else {
      item.kolacina = qty;

    }

  }



  async submit() {



    let articles = filter(this.data, function (o) {

      return o.kolacina > 0
    })

    if (articles.length == 0) {
      this.helper.showToast("Please select atleast one article", "danger")
    }

    let saveObj = {
      items: articles,
      stolovi_id: this.stolovi_id,
      konobar: this.user.id,
      orderId: this.orderId,
      type: this.type

    }
    console.log(saveObj);


    let loader = await this.helper.presentLoading();
    loader.present()



    this.serviceCall.postData("Artikli/finalize_order", saveObj).subscribe(r => {
      console.log(r);
      if (r.code == 403) {

      } else if (r.code == 200) {
        this.helper.showToast("Narudzbina zavrsena");
        loader.dismiss();
        this.nav.back()

      } else {

      }


    })

  }


  async confirm() {

    let data = filter(this.data, function (d) {
      return d.kolacina > 0
    })

    const modal = await this.modalController.create({
      component: OrderConfirmationPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps:
        { "data": data }


    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log(dataReturned)
        if(dataReturned.data.isSaved){
          this.submit()
        }
      }
    });
    return await modal.present();
  }


}
