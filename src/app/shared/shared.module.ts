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
import { ExpressionComponent } from './_components/expression/expression.component';

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
    ExpressionComponent,
    DynamicContentTooltipComponent,
    DynamicTooltipDirective,
    PaginatorComponent,
    SnackBarContentComponent,
  ],
  exports: [
    ExpressionComponent,
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
