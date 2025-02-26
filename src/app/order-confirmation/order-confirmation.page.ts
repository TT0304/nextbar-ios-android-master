import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.page.html',
  styleUrls: ['./order-confirmation.page.scss'],
})
export class OrderConfirmationPage implements OnInit {
  @Input() data: string = "";

  constructor(private modalController: ModalController
  ) { }

  ngOnInit() {
  }


  close() {

    this.modalController.dismiss({
      'dismissed': true
    });
  }

  saveClose() {

    this.modalController.dismiss({
      'dismissed': true,
      'isSaved':true
    });
  }

}
