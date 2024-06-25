import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HelperService } from '../helper.service';
import { HttpService } from '../providers/http.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { filter, findIndex, sumBy, uniqBy } from "lodash";

@Component({
  selector: 'app-waiter-orders',
  templateUrl: './waiter-orders.page.html',
  styleUrls: ['./waiter-orders.page.scss'],
})
export class WaiterOrdersPage implements OnInit {
  user: any;
  data: any = [];
  mediaUrl: string;
  dataLoaded: boolean = false;
  env: any = {};
  skeleton: any[];
  inputParams: any;
  stolovi_id: any;
  timer: any;
  grandTotal: any = 0;
  imeStola: any;

  constructor(private helper: HelperService,
    private serviceCall: HttpService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef

  ) {
    this.user = this.helper.getUser();
    this.env = environment
  }

  ngOnInit() {
    this.skeleton = this.helper.getSkeletonItem();

    this.activatedRoute.paramMap.subscribe((p: any) => {
      console.log("in init");
      if (p.keys.length != 0) {

        this.inputParams = p.params;
        this.stolovi_id = p.get('stolovi_id');
        this.imeStola = p.get('imeStola');
        this.getData();

        this.timer = setInterval(() => {
          console.log(new Date());
          this.getData()
        }, 30000);

      }
    });






  }

  ionViewDidEnter() {


 


  }
  ionViewWillEnter() {

    console.log("entered")
    // if (this.timer) {
    //   clearInterval(this.timer)
    // }





  }

  ionViewDidLeave() {
    console.log("leaving");
    clearInterval(this.timer)
    delete this.timer;

  }


  async getData() {
    console.log("here--", Math.random());
    let params: any = {};


    this.serviceCall.getDetails("Stolovi/getAllActiveStoloviOrderByOrderId/" + this.stolovi_id, params).subscribe(r => {

      this.dataLoaded = true;
      if (r.code == 200) {
        let _data = r.response;

        let uniqueOrders = uniqBy(_data, 'order_id');
        this.grandTotal = sumBy(uniqBy(_data, 'order_id'), 'ukupno');

        this.data = _data;

      } else {
        this.data = [];


      }
    })
  }

  ngOnDestroy() {
    clearInterval(this.timer)
  }

  addNew() {
    let params: any = {};
    params.stolovi_id = this.stolovi_id
    params.imeStola = this.imeStola
    params.type = "insert"
    this.helper.gotoPage("waiter-tables/waiter-articles", params);
  }


  async checkout(orderId, i) {
    
    let loader = await this.helper.presentLoading();
    loader.present()
    // this.data = []


    this.serviceCall.postData("Artikli/orderpostcheckout", { "orderId": orderId }).subscribe(r => {

      if (r.code == 200) {
   
        this.data=[];
        this.helper.showToast("Narudzbina naplacena");
        this.getData()
      }
      loader.dismiss()
    })
  }


}

