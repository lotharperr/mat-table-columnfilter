# mat-table-columnfilter

mat-table-columnfilter adds Excel-like column filter to a mat-table.

![image](https://user-images.githubusercontent.com/12022499/230994564-19c84433-4b85-405c-bded-d2d2ac743757.png)

# Build from source


```
# build project `mat-table-columnfilter`
ng build mat-table-columnfilter

# Start the demo:
ng serve demo
```

# Getting started (npm)

```
npm install --save mat-table-columnfilter
```

Import mat-table-columnfilter in your ngModule:
```
import { MatTableColumnFilterModule } from 'mat-table-columnfilter';
```
```
@NgModule({
  imports: [
    ...
    MatTableColumnFilterModule
  ],
 ]})
```

Add the filter-panel component to your `app.component.html` file:
```html
<mat-table-header-filterpanel></mat-table-header-filterpanel>
```

Add a controller component, one per mat-table:
```html
<mat-table-header-controller #headerController></mat-table-header-controller>
```

Assign the controller dataSource
```html
  <table mat-table [dataSource]="headerController.dataSource">
    ...
  </table>
```

Add the column-header inside the `<th>` tag of your column definition:
```html
    <!-- Position Column -->
    <ng-container matColumnDef="position">
      <th mat-header-cell *matHeaderCellDef> <mat-table-column-header [controller]="headerController"
          columnName="position">Position</mat-table-column-header> </th>
      <td mat-cell *matCellDef="let element"> {{element.position}} </td>
    </ng-container>

```

Get a reference to the controller:
```typescript
import { TableHeaderControllerComponent } from 'mat-table-columnfilter';

...

@ViewChild(TableHeaderControllerComponent) controller?: TableHeaderControllerComponent;
```

And finally, set the data source:
```typescript
this.controller.setDataSource(new MatTableDataSource(this.dataSource));
```

## app.component.html

```html
<mat-table-header-filterpanel height="20rem"></mat-table-header-filterpanel>

<div class="wrapper">
  <h1>mat-table-columnfilter demo</h1>
  <h2>attached filter header</h2>
  <mat-table-header-controller #headerController [filterEnabled]="filterEnabled"></mat-table-header-controller>

  <div class="filter-settings">
    <mat-slide-toggle [(ngModel)]="filterEnabled">Enable filter</mat-slide-toggle>
    <button class="reset-button" mat-button (click)="headerController.resetFilter()">Reset</button>
  </div>

  <table mat-table [dataSource]="headerController.dataSource" class="mat-elevation-z8">

    <!-- Position Column -->
    <ng-container matColumnDef="position">
      <th mat-header-cell *matHeaderCellDef> <mat-table-column-header [controller]="headerController"
          columnName="position">Position</mat-table-column-header> </th>
      <td mat-cell *matCellDef="let element"> {{element.position}} </td>
    </ng-container>

    <!-- Name Column -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef> <mat-table-column-header [controller]="headerController"
          columnName="name">Name</mat-table-column-header> </th>
      <td mat-cell *matCellDef="let element"> {{element.name}} </td>
    </ng-container>

    <!-- Weight Column -->
    <ng-container matColumnDef="weight">
      <th mat-header-cell *matHeaderCellDef>
        <mat-table-column-header [controller]="headerController" columnName="weight">Weight</mat-table-column-header>
      </th>
      <td mat-cell *matCellDef="let element"> {{element.weight}} </td>
    </ng-container>

    <!-- Symbol Column -->
    <ng-container matColumnDef="symbol">
      <th mat-header-cell *matHeaderCellDef>
        <mat-table-column-header [controller]="headerController" columnName="symbol">Symbol</mat-table-column-header>
      </th>
      <td mat-cell *matCellDef="let element"> {{element.symbol}} </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>


  <div class="detached-headers">
    <div *ngIf="filterEnabled">
      <h2>Deteached header filter:</h2>
      <mat-table-column-header [controller]="headerController" columnName="position">Position</mat-table-column-header>
      <mat-table-column-header [controller]="headerController" columnName="name">Name</mat-table-column-header>
      <mat-table-column-header [controller]="headerController" columnName="weight">Weight</mat-table-column-header>
      <mat-table-column-header [controller]="headerController" columnName="symbol">Symbol</mat-table-column-header>
    </div>
  </div>

  <table mat-table [dataSource]="headerController.dataSource" class="mat-elevation-z8">

    <!-- Position Column -->
    <ng-container matColumnDef="position">
      <th mat-header-cell *matHeaderCellDef>Position</th>
      <td mat-cell *matCellDef="let element"> {{element.position}} </td>
    </ng-container>

    <!-- Name Column -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef>Name</th>
      <td mat-cell *matCellDef="let element"> {{element.name}} </td>
    </ng-container>

    <!-- Weight Column -->
    <ng-container matColumnDef="weight">
      <th mat-header-cell *matHeaderCellDef>Weight</th>
      <td mat-cell *matCellDef="let element"> {{element.weight}} </td>
    </ng-container>

    <!-- Symbol Column -->
    <ng-container matColumnDef="symbol">
      <th mat-header-cell *matHeaderCellDef>Symbol</th>
      <td mat-cell *matCellDef="let element"> {{element.symbol}} </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>


</div>
```

app.component.ts
```typescript
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableHeaderControllerComponent } from 'mat-table-columnfilter';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  filterEnabled = true;

  @ViewChild(TableHeaderControllerComponent) controller?: TableHeaderControllerComponent;

  constructor(private cdRef : ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.controller) {
      this.controller.setDataSource(new MatTableDataSource(this.dataSource));
      this.cdRef.detectChanges();
    }
  }
}

```
