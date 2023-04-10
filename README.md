# mat-table-columnfilter

mat-table-columnfilter adds Excel-like column filter to a mat-table.

![image](https://user-images.githubusercontent.com/12022499/230994564-19c84433-4b85-405c-bded-d2d2ac743757.png)

# Getting started

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

Add the column-header inside the `<th>` tag of your column definition:
```html
    <!-- Position Column -->
    <ng-container matColumnDef="position">
      <th mat-header-cell *matHeaderCellDef> <mat-table-column-header [controller]="headerController"
          columnName="position">Position</mat-table-column-header> </th>
      <td mat-cell *matCellDef="let element"> {{element.position}} </td>
    </ng-container>

```
