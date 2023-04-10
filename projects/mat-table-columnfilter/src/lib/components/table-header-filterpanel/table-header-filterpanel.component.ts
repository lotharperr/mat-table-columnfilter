import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionHelper } from '../../helper/subscription-helper';
import { TableHeaderService } from '../../services/table-header.service';

@Component({
  selector: 'mat-table-header-filterpanel',
  templateUrl: './table-header-filterpanel.component.html',
  styleUrls: ['./table-header-filterpanel.component.css']
})
export class TableHeaderFilterpanelComponent implements OnInit, OnDestroy {
  @Input() searchPlaceholder = "Search";
  @Input() applyCaption = "Apply";
  @Input() clearCaption = "Clear";
  @Input() closeCaption = "Close";
  @Input('width') panelWidth = "20rem";
  @Input('height') panelHeight = "15rem";
  
  subscriptionHelper = new SubscriptionHelper();
  textFilter = "";
  options = new Array<string>();
  filteredOptions = new Array<string>();
  selectedOptions = new Array<string>();

  private clickTargetComponent = false;

  constructor(
    public headerService: TableHeaderService
  ) { }

  ngOnInit(): void {
    const options = new Array<string>();
    this.headerService.options$.next(options);
    this.subscriptionHelper.add(this.headerService.options$.subscribe(options => this.setOptions(options)));
    this.subscriptionHelper.add(this.headerService.selectedOptions$.subscribe(options => this.selectedOptions = options!));
  }

  ngOnDestroy(): void {
    this.subscriptionHelper.unsubscribeAll();
  }

  @HostListener('click')
  clickInside() {
    this.clickTargetComponent = true;
  }
  
  @HostListener('document:click', ['$event.target'])
  onMouseClick() {
    if (!this.clickTargetComponent) {
      this.closeFilterPanel();    
    }
    this.clickTargetComponent = false;
  }

  setOptions(options: Array<string> | undefined) {
    if (options) {
      this.options = options;
      this.filteredOptions.length = 0;
      options.map(item => {
        if (this.textFilter.length === 0 || item.toLocaleLowerCase().indexOf(this.textFilter.toLocaleLowerCase()) != -1) {
          this.filteredOptions.push(item);
        }
      });
    }
  }

  textFilterChanged(event: any) {
    this.setOptions(this.options);
  }

  applyFilter() {
    this.headerService.selectedOptions$.next(this.selectedOptions);
    this.closeFilterPanel();
  }

  clearFilter() {
    this.headerService.selectedOptions$.next(new Array<string>());
    this.closeFilterPanel();
  }

  closeFilterPanel() {
    this.textFilter = "";
    this.headerService.hide();
  }

}
