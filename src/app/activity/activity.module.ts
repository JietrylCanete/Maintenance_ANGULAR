import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ActivityRoutingModule } from './activity-routing.module';
import { ActivityComponent } from './activity.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ActivityRoutingModule
    ],
    declarations: [
        ActivityComponent
    ]
})
export class ActivityModule { }