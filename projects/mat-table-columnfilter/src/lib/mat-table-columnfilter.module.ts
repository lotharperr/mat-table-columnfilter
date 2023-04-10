import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { TableColumnHeaderComponent } from './components/table-column-header/table-column-header.component';
import { TableHeaderControllerComponent } from './components/table-header-controller/table-header-controller.component';
import { TableHeaderFilterpanelComponent } from './components/table-header-filterpanel/table-header-filterpanel.component';

@NgModule({
  declarations: [
    TableColumnHeaderComponent,
    TableHeaderControllerComponent,
    TableHeaderFilterpanelComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTableModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
  ],
  exports: [
    TableColumnHeaderComponent,
    TableHeaderControllerComponent,
    TableHeaderFilterpanelComponent
  ]
})
export class MatTableColumnFilterModule { }
