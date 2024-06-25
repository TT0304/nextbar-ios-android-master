import { Component, OnInit } from '@angular/core';
import { HelperService } from '../helper.service';
import { HttpService } from '../providers/http.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  user: any;
  data: any = [];
  mediaUrl: string;
  dataLoaded: boolean=false;  
  env: any = {};
  params: any;
  images: any=[];

  constructor(private helper: HelperService,
    private serviceCall: HttpService,
    private activatedRoute: ActivatedRoute, private router: Router,

  ) {
    this.user = this.helper.getUser();
    console.log(this.user);
   }
 
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.params = params;
      console.log(this.params);
    });

    this.getData()
  }

      
  async getData() {

    let params: any = { user_id: this.user.id ,complaint_id: this.params.complaint_id  };
    

    this.serviceCall.getDetails ("complaints/complaint", params).subscribe(r => {
      
      this.dataLoaded = true;
      if (r.code ==200) {

        r.photos.forEach(e => {
          e.picture = environment.mediaPath + e.picture;
        });
        this.data = r.park_complaints[0];
        this.images = r.photos
      } else {
        this.data = [];


      }
    })
  }


}
