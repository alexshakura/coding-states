import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PortalModule } from '@angular/cdk/portal';

import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorIntl,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';

import { CustomMatPaginatorIntlRu } from './_helpers/custom-paginator';
import { DynamicContentTooltipComponent } from './_components/dynamic-content-tooltip/dynamic-content-tooltip.component';
import { DynamicTooltipDirective } from './_directives/dynamic-tooltip.directive';
import { PaginatorComponent } from './_components/paginator/paginator.component';
import { SnackBarContentComponent } from './_components/snack-bar-content/snack-bar-content.component';
import { DiscreteExpressionComponent } from './_components/discrete-expression/discrete-expression.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    PortalModule,
  ],
  declarations: [
    DiscreteExpressionComponent,
    DynamicContentTooltipComponent,
    DynamicTooltipDirective,
    PaginatorComponent,
    SnackBarContentComponent,
  ],
  exports: [
    DiscreteExpressionComponent,
    DynamicContentTooltipComponent,
    DynamicTooltipDirective,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    PaginatorComponent,
    SnackBarContentComponent,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlRu },
  ],
  entryComponents: [
    DynamicContentTooltipComponent,
    SnackBarContentComponent,
  ],
})
export class SharedModule { }
