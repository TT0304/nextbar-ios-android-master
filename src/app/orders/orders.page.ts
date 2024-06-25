import { Component, OnInit } from '@angular/core';
import { HelperService } from '../helper.service';
import { HttpService } from '../providers/http.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { filter, findIndex, sumBy,uniqBy } from "lodash";


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  user: any;
  data: any = [];
  mediaUrl: string;
  dataLoaded: boolean=false;
  env: any = {};
  skeleton: any[];
  inputParams: any;
  ID: any;
  timer:any ;
  grandTotal: any=0;

  constructor(private helper: HelperService,
    private serviceCall: HttpService,
    private activatedRoute: ActivatedRoute

  ) {
    this.user = this.helper.getUser();
    this.env = environment
   }

  ngOnInit() {


    this.skeleton = this.helper.getSkeletonItem();
  }

  ionViewWillEnter() {



    this.activatedRoute.paramMap.subscribe((p:any) => {

      if(p.keys.length!=0){
        console.log(p.params)
        this.inputParams = p.params;
        this.ID = p.get('stolovi_id');
        this.getData();
        
        this.timer = setInterval(() => this.getData(), 30000);


      } 
    });





  }


      
  async getData() {

    let params: any = {   };
    

    this.serviceCall.getDetails("Stolovi/getAllActiveStoloviOrderByOrderId/" + this.ID, params).subscribe(r => {
      console.log(r);
      this.dataLoaded = true;
      if (r.code ==200) {
        let _data = r.response;

        let uniqueOrders  = uniqBy(_data, 'order_id');
        this.grandTotal   = sumBy(uniqBy(_data, 'order_id'),'ukupno');
    
        this.data = _data;

      } else {
        this.data = [];


      }
    })
  }

  ngOnDestroy() {
    clearInterval(this.timer)
  }


}

