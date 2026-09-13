import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { MaintenanceService } from '@app/_services';

@Component({
templateUrl: 'staff-list.component.html',
styleUrls: ['staff-list.component.css']

})
export class StaffListComponent implements OnInit {

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

drop(event: CdkDragDrop<string>) {

    const request = event.item.data;
    const newStatus = event.container.data;

    if (!request || !newStatus) {
        return;
    }

    if (request.status === newStatus) {
        return;
    }

    this.updateStatus(request.RequestId, newStatus);
}
}
