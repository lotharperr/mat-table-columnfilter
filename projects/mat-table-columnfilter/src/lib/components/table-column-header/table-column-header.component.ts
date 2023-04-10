import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionHelper } from '../../helper/subscription-helper';
import { TableHeaderService } from '../../services/table-header.service';
import { ColumnFilterInstance, TableHeaderControllerComponent } from '../table-header-controller/table-header-controller.component';

@Component({
  selector: 'mat-table-column-header',
  templateUrl: './table-column-header.component.html',
  styleUrls: ['./table-column-header.component.css']
})
export class TableColumnHeaderComponent implements OnInit, OnDestroy {
  @Input() controller!: TableHeaderControllerComponent;
  @Input() columnName!: string;

  subscriptionHelper = new  SubscriptionHelper();
  showFilterIcons = false;
  filterActive = false;

  constructor(
    private tableHeaderService: TableHeaderService
  ) { }
  ngOnInit(): void {
    const localThis = this;
    if (this.controller) {
      this.subscriptionHelper.add(this.controller.showFilterChange.subscribe((value: boolean) => {
        localThis.showFilterIcons = value;
      }));
      this.subscriptionHelper.add(this.controller.filterChange.subscribe((eventData: ColumnFilterInstance) => {
        if (eventData.columnName === this.columnName) {
          localThis.filterActive = eventData.selectedOptions.length > 0;
        }
      }));      
    }
    this.showFilterIcons = this.controller.filterEnabled;
  }

  ngOnDestroy(): void {
    this.subscriptionHelper.unsubscribeAll();
  }

  togglePanel(event: MouseEvent) {
    if (!this.tableHeaderService.panelVisible$.value) {
      this.controller.showFilterPanel(this.columnName, event.pageX, event.pageY);
    } else {
      this.controller.hideFilterPanel();
    }

    event.stopPropagation();
  }

}
