import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubscriptionHelper } from '../../helper/subscription-helper';
import { TableHeaderService } from '../../services/table-header.service';

export class ColumnFilterInstance {
  columnName = "";
  selectedOptions = new Array<string>();
}

@Component({
  selector: 'mat-table-header-controller',
  templateUrl: './table-header-controller.component.html',
  styleUrls: ['./table-header-controller.component.css']
})
export class TableHeaderControllerComponent implements OnInit, OnDestroy {
  _filterEnabled = false;
  get filterEnabled(): boolean {
    return this._filterEnabled;
  }
  @Input() set filterEnabled(value: boolean) {
    this._filterEnabled = value;
    this.filterActiveChanged();
  }

  @Output() showFilterChange = new EventEmitter<boolean>();
  @Output() filterChange = new EventEmitter<ColumnFilterInstance>();

  dataSource: any;
  controllerActive = false; // Falls mehrere Tabellen gleichzeitig auf einer Seite vorhanden sind
  currentColumnName = "";
  fullTextSearch = "";
  subscriptionHelper = new SubscriptionHelper();
  filterActiveSubscription!: Subscription;

  filterSet = new Array<ColumnFilterInstance>();

  constructor(
    private tableHeaderService: TableHeaderService
  ) { }

  ngOnInit(): void {
    this.filterActiveSubscription = this.tableHeaderService.panelVisible$.subscribe(visible => {
      if (visible) {
        this.subscribeEvents();
      } else {
        this.subscriptionHelper.unsubscribeAll();
        this.controllerActive = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.filterActiveSubscription.unsubscribe();
  }

  setDataSource(dataSource: any) {
    this.dataSource = dataSource;
    if (this.dataSource) {
      this.dataSource.filterPredicate = this.filterPredicate;
      this.filterData();
      this.dataSource.filter = this.getFilterText();
    }
  }

  showFilterPanel(columnName: string, left: number, top: number) {
    this.controllerActive = true;
    const filterInstance = this.filterSet.find(item => item.columnName === columnName);
    this.tableHeaderService.columnName$.next(columnName);
    this.tableHeaderService.options$.next(this.getDistinctColumnData(columnName));
    this.tableHeaderService.selectedOptions$.next(filterInstance?.selectedOptions);
    this.tableHeaderService.show(left, top);
  }

  hideFilterPanel() {
    this.tableHeaderService.hide();
  }

  resetFilter() {
    this.filterSet.map((instance) => {
      const eventData: ColumnFilterInstance = {
        columnName: instance.columnName,
        selectedOptions: new Array<string>()
      };
      this.filterChange.emit(eventData);
    });
    this.showFilterChange.emit(this.filterEnabled);
    this.filterSet.length = 0;
    this.dataSource.filter = this.getFilterText();
  }

  /**
   * Die Filter-Funktion von MatDataSource filtert nur, 
   * wenn dataSource.filter einen Wert besitzt.
   * Wenn für die Volltext-Suche kein Wert eingegeben wurde, 
   * muss ein Platzhalter eingefügt werden. 
   * Ansonsten wird filterPredicate nicht aufgerufen.
   */
  private getFilterText() {
    return this.fullTextSearch?.length > 0 ? this.fullTextSearch : "◬";
  }

  private subscribeEvents() {
    this.subscriptionHelper.add(this.tableHeaderService.selectedOptions$.subscribe(options => {
      if (this.controllerActive && this.currentColumnName?.length > 0 && options) {
        if (options.length > 0) {
          const filterInstance = this.filterSet.find(item => item.columnName === this.currentColumnName);
          if (filterInstance) {
            filterInstance.selectedOptions = options;
          } else {
            this.filterSet.push({ columnName: this.currentColumnName, selectedOptions: options! });
          }
        } else {
          // Spalte löschen, wenn keine Einträge vorhanden sind
          const item = this.filterSet.find(i => i.columnName == this.currentColumnName);
          if (item) {
            this.filterSet.splice(this.filterSet.indexOf(item), 1);
          }
        }

        // Table-Header benachrichtigen (Farbe ändern)
        const eventData: ColumnFilterInstance = {
          columnName: this.currentColumnName,
          selectedOptions: options
        };
        this.filterChange.emit(eventData);
        this.filterData();
        this.dataSource.filter = this.getFilterText();
      }
    }));

    this.subscriptionHelper.add(this.tableHeaderService.columnName$.subscribe(columnName => {
      if (this.controllerActive) {
        this.currentColumnName = columnName!;
      }
    }));
  }

  private filterPredicate = (data: any, filter: string): boolean => {
    const dataStr = Object.keys(data)
      .reduce((currentTerm: string, key: string) => {
        return currentTerm + (data as { [key: string]: any })[key] + '◬';
      }, '').toLowerCase();

    const transformedFilter = filter.trim().toLowerCase();
    const resultSearch = transformedFilter.length > 0 && dataStr.indexOf(transformedFilter) != -1;
    const resultFilter = this.filterSet.length > 0 ? data[`show-row`] === true : true;
    return resultSearch && resultFilter;
  };

  private filterByColumn(columnName: string, data: Array<any>) {
    const result = new Array<any>();
    const filterInstance = this.filterSet.find(item => item.columnName === columnName);
    if (filterInstance) {
      data.map(row => {
        filterInstance.selectedOptions.map(selectedOption => {
          const subobjects = columnName.split(".");
          let value = row;
          subobjects.map(member => value = value[`${member}`]);

          if (value == selectedOption) {
            result.push(row);
          }

        });
      });
    }
    return result;
  }

  private filterData() {
    let result = this.dataSource.data;
    this.dataSource.data.map((row: any) => row[`show-row`] = false);
    this.filterSet.map((instance) => {
      result = this.filterByColumn(instance.columnName, result);
    });
    result.map((row: any) => row[`show-row`] = true);
  }

  private filterActiveChanged() {
    if (this.dataSource) {
      if (this.filterEnabled) {
        this.dataSource.filter = this.getFilterText();
        const filterInstance = this.filterSet.find(item => item.columnName === this.currentColumnName);
        this.tableHeaderService.columnName$.next(this.currentColumnName);
        this.tableHeaderService.options$.next(this.getDistinctColumnData(this.currentColumnName));
        this.tableHeaderService.selectedOptions$.next(filterInstance?.selectedOptions);
      } else {
        this.dataSource.filter = "";
      }
    }
    if (!this.filterEnabled) {
      this.tableHeaderService.panelVisible$.next(false);
    }
    this.showFilterChange.emit(this.filterEnabled);
  }

  /*
   * Ermittelt die Liste möglicher Filter-Einträge:
   * Die Tabellen-Daten werden bis zur vorletzten Filter-Instanz gefilter 
   * und anschließend die Filter-Spalte aufgelistet (distinct)
   * -> jede Instanz muss ALLE möglichen Werte anzeigen, die bis zu dieser Filterebene möglich sind
   */
  getDistinctColumnData(columnName: string) {
    const result = new Array<string>();
    let data = this.dataSource.data;
    const instance = this.filterSet.find(i => i.columnName == columnName);
    let instanceIndex = this.filterSet.length;

    if (instance) { // eine bestehende Instanz wurde geändert, nur bis eine Instant davor filtern!!
      instanceIndex = this.filterSet.indexOf(instance);
    }
    for (let i = 0; i < instanceIndex; i++) {
      data = this.filterByColumn(this.filterSet[i].columnName, data);
    }

    if (data.length === 0) data = this.dataSource.data;
    data.map((row: any) => {
      // Subobjecte auflösen, z.B. part.partName
      const subobjects = columnName.split(".");
      let value = row;
      subobjects.map(member => value = value[`${member}`]);
      if (result.indexOf(value) === -1) {
        result.push(value);
      }
    });
    result.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0));

    return result;
  }

}
