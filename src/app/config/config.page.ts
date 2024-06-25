import { Component, OnInit } from '@angular/core';
import { HelperService } from '../helper.service';
import { HttpService } from '../providers/http.service';
import { NavController, MenuController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';
const { Storage } = Plugins;

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  server: string;

  constructor(
    private helper: HelperService,
    private serviceCall: HttpService,
    private navCtrl: NavController,
    public menuCtrl: MenuController,
    private http: HttpClient,

  ) { }

  ngOnInit() {
    // this.server = this.serviceCall.getCongiuration()

    Storage.get({
      key: 'configuration',

    }).then((s) => {
      if (s.value) {
        console.log(s.value);
        this.server = s.value;

      }


    })


  }

  async save() {

    if(this.server.trim()==''){
      this.helper.showToast("Molimo vas da unesete adresu servera");
      return false;
    }



    let loader = await this.helper.presentLoading();
    loader.present()

    // let url = this.server + "/index.php/ping/status_check/osoblje";
    // console.log(url);
    let url = "http://" + this.server + environment.nextBarDomain
    console.log(url);
    let checkStatusURL = url +  "ping/status_check/osoblje"

    this.get(checkStatusURL).subscribe(r => {
      if (r.code == 409) {
        this.helper.showToast(r.status);
      } else if (r.code == 200) {


        Storage.set({
          key: 'configuration',
          value: this.server
        }).then((s) => {
          console.log(s);
          this.serviceCall.setConfiguration(url);
          this.close()
        })

      }
      loader.dismiss()
    })


  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  close() {
    this.navCtrl.back()
  }

  get(url): Observable<any> {
    return this.http.get(url, {})
      .pipe(
        tap(_ => console.log('response received')),
        catchError(this.handleError('getDetails', []))
      );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.helper.showToast("Cannot connect to server", "danger")
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
