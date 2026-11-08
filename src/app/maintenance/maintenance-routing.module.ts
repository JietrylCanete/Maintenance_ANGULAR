import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/_helpers';
import { Role } from '@app/_models';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { CreateComponent } from './create.component';
import { StaffListComponent } from './staff-list.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: ListComponent },
            { path: 'create', component: CreateComponent },
            {
                path: 'assigned',
                component: StaffListComponent,
                canActivate: [AuthGuard],
                data: { roles: [Role.Staff] }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaintenanceRoutingModule { }