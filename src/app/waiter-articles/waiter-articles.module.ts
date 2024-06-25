import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaiterArticlesPageRoutingModule } from './waiter-articles-routing.module';

import { WaiterArticlesPage } from './waiter-articles.page';
import { NgPipesModule } from 'ngx-pipes';
import { OrderConfirmationPageModule } from '../order-confirmation/order-confirmation.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaiterArticlesPageRoutingModule,
    NgPipesModule,
    OrderConfirmationPageModule
  ],
  declarations: [WaiterArticlesPage]
})
export class WaiterArticlesPageModule {}
