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
import { DnfEquationComponent } from './_components/dnf-equation/dnf-equation.component';
import { ShefferEquationComponent } from './_components/sheffer-equation/sheffer-equation.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    TranslateModule,
  ],
  declarations: [
    DynamicContentTooltipComponent,
    DynamicTooltipDirective,
    PaginatorComponent,
    SnackBarContentComponent,
    DnfEquationComponent,
    ShefferEquationComponent,
  ],
  exports: [
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
    DnfEquationComponent,
    ShefferEquationComponent,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntlRu,
      deps: [TranslateService],
    },
  ],
  entryComponents: [
    DynamicContentTooltipComponent,
    SnackBarContentComponent,
  ],
})
export class SharedModule { }
