import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HelperService } from '../helper.service';
import { HttpService } from '../providers/http.service';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.page.html',
  styleUrls: ['./suppliers.page.scss'],
})
export class SuppliersPage implements OnInit  {
  user: any;
  data: any = [];
  mediaUrl: string;
  dataLoaded: boolean=false;
  env: any = {};
  skeleton: any[];
  search:""
  removeItem: any;
  removeIndex: any;
 

  constructor(private helper: HelperService,
    private serviceCall: HttpService,
    private ref: ChangeDetectorRef,
    private alertController:AlertController,
  ) {
    this.user = this.helper.getUser();
    this.env = environment
   }

  ngOnInit() {


    this.skeleton = this.helper.getSkeletonItem();

  }

  ionViewDidEnter() {

    this.getData()

  }

  async getData() {

    let params: any = {   };
    

    this.serviceCall.getDetails("Dobavljaci/getAllActiveDobavljaci", params).subscribe(r => {
      console.log(r);
      this.dataLoaded = true;
      if (r.code ==200) {
        let _data = r.response;
     
        this.data = _data;

      } else {
        this.data = [];


      }
    })
  }




  async confirmDelete(itemID,index) {

    this.removeItem = itemID
    this.removeIndex = index

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete',
      message: 'Jeste li sigurni da zelite izbrisati?',
      mode:"ios",
      buttons: [
        {
          text: 'Otkazi',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Da',
          handler: () => {
            this.delete();
          }
        }
      ]
    });

    await alert.present()
  }

 
      
  async delete() {

    let loader =await this.helper.presentLoading("Deleting...");
  loader.present()
  this.data.splice(this.removeIndex,1);
 
    this.serviceCall.postData("Dobavljaci/deleteDobavljaci/" + this.removeItem, {}).subscribe(d => {
      console.log(d);
      if (d.code =="200") {
        this.data.splice(this.removeIndex,1);


        setTimeout(() => {
          console.log("hwee");
          this.ref.detectChanges()
          loader.dismiss()
        }, 400);
      
          
      } 
    })
  }



}
