import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { CreateComponent } from './create.component';
import { StaffListComponent } from './staff-list.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaintenanceRoutingModule,
        DragDropModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        CreateComponent,
        StaffListComponent
    ]
})
export class MaintenanceModule { }