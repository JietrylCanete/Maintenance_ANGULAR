import { Component, OnInit } from '@angular/core';

import { MaintenanceService } from '@app/_services';
import { MaintenanceRequest } from '@app/_models';

@Component({
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {

    requests: MaintenanceRequest[] = [];
    loading = false;

    constructor(private maintenanceService: MaintenanceService) { }

    ngOnInit() {
        this.loading = true;

        this.maintenanceService.getAll()
            .subscribe({
                next: requests => {
                    this.requests = requests;
                    this.loading = false;
                },
                error: error => {
                    console.error(error);
                    this.loading = false;
                }
            });
    }
}