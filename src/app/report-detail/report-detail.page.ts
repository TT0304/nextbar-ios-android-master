import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HelperService } from '../helper.service';
import { HttpService } from '../providers/http.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.page.html',
  styleUrls: ['./report-detail.page.scss'],
})
export class ReportDetailPage implements OnInit {
  dt: any = "";
  enddt: any = "";
  dataLoaded: boolean;
  data: any;
  periodicni: boolean = true;
  izvestaj: boolean = false;
  articlala_virman: boolean = false
  storno_artikala: boolean = false;
  Izvestaj_kuhinje: boolean= false;
  Izvestaj_Sanka: boolean= false;
  type: string="";
  constructor(private navCtrl: NavController, private helper: HelperService,
    private serviceCall: HttpService,
    private activatedRoute: ActivatedRoute


  ) {
    let dt = new Date();
    this.dt = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    this.enddt = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    // this.getData();

  }

  ngOnInit() {
  }

  ionViewWillEnter() {

    this.activatedRoute.paramMap.subscribe((p: any) => {

      if (p.keys.length != 0) {
        this.type = p.get('type');
        this.getData()
      }
    });





  }

  async getData() {
    this.data = [{

      report_1: [],
      report_2: [],
      report_3: [],
      report_4: [],
      report_5: []
    }
    ];

    let loader =await this.helper.presentLoading();
    loader.present()
    this.serviceCall.postData("stats/reports", { "date": this.dt, "endDate":this.enddt }).subscribe(r => {

      this.dataLoaded = true;
      if (r.code == 200) {
        this.data = r.response;
        console.log(this.data);
      } else {
        this.data = [];
      }
      loader.dismiss();

    })
  }



  show(type) {
    if (type == 'periodicni') {
      this.periodicni = !this.periodicni
    } else  if (type == 'izvestaj') {
      this.izvestaj = !this.izvestaj
    }else  if (type == 'articlala_virman') {
      this.articlala_virman = !this.articlala_virman
    }else  if (type == 'storno_artikala') {
      this.storno_artikala = !this.storno_artikala
    }
    else  if (type == 'Izvestaj_kuhinje') {
      this.Izvestaj_kuhinje = !this.Izvestaj_kuhinje
    }
    else  if (type == 'Izvestaj_Sanka') {
      this.Izvestaj_Sanka = !this.Izvestaj_Sanka
    }


  }

}
