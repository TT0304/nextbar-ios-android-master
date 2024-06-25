import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage,
        
      },
      {
        path: 'articles',
        loadChildren: () => import('../articles/articles.module').then( m => m.ArticlesPageModule)
      },

    ])
  ],
  declarations: [HomePage],
  exports:[],
})
export class HomePageModule {}
