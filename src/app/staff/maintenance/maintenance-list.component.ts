import { Component, OnInit } from '@angular/core';

import { MaintenanceService } from '@app/_services';

@Component({
    templateUrl: 'maintenance-list.component.html'
})
export class MaintenanceListComponent implements OnInit {

    requests: any[] = [];
    loading = false;
    error = '';

    constructor(
        private maintenanceService: MaintenanceService
    ) { }

    ngOnInit() {
        this.loadRequests();
    }

    loadRequests() {
        this.loading = true;
        this.error = '';

        this.maintenanceService.getAssigned()
            .subscribe({
                next: requests => {
                    this.requests = requests;
                    this.loading = false;
                },
                error: error => {
                    console.error(error);
                    this.error = 'Failed to load assigned maintenance requests.';
                    this.loading = false;
                }
            });
    }

    updateStatus(id: number | undefined, status: string) {
        if (id === undefined) {
            return;
        }

        this.maintenanceService.updateStatus(id, status)
            .subscribe({
                next: () => {
                    this.loadRequests();
                },
                error: error => {
                    console.error(error);
                    this.error = 'Failed to update maintenance request status.';
                }
            });
    }
}