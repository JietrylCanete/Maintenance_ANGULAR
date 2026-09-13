import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { MaintenanceService } from '@app/_services';
import { AccountService } from '@app/_services';
import { MaintenanceRequest } from '@app/_models';

@Component({
templateUrl: 'maintenance-list.component.html',
styleUrls: ['maintenance-list.component.css']
})
export class MaintenanceListComponent implements OnInit {

requests: MaintenanceRequest[] = [];
loading = false;
error = '';

selectedStaffId = 0;
staffAccounts: any[] = [];

constructor(
    private maintenanceService: MaintenanceService,
    private accountService: AccountService
) { }

ngOnInit() {
    this.loadRequests();
    this.loadStaffAccounts();
}

loadRequests() {
    this.loading = true;
    this.error = '';

    this.maintenanceService.getAll()
        .subscribe({
            next: requests => {

                const priorityOrder: any = {
                    'Critical': 1,
                    'High': 2,
                    'Medium': 3,
                    'Low': 4
                };

                this.requests = requests.sort(
                    (a, b) =>
                        (priorityOrder[a.priority || ""] || 5) -
                        (priorityOrder[b.priority || ""] || 5)
                );

                this.loading = false;
            },
            error: error => {
                console.error(error);
                this.error = 'Failed to load maintenance requests.';
                this.loading = false;
            }
        });
}

loadStaffAccounts() {
    this.accountService.getAll()
        .subscribe({
            next: accounts => {
                this.staffAccounts = accounts.filter(
                    account => account.role === 'Staff'
                );
            },
            error: error => {
                console.error(error);
                this.error = 'Failed to load staff accounts.';
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
    const request = event.item.data as MaintenanceRequest;
    const newStatus = event.container.data;

    if (!request || !newStatus) {
        return;
    }

    if (request.status === newStatus) {
        return;
    }

    this.updateStatus(request.RequestId, newStatus);
}

assignRequest(id: number | undefined, assignedTo: string) {

    if (id === undefined || !assignedTo) {
        return;
    }

    const staffId = Number(assignedTo);

    this.maintenanceService.assign(id, staffId)
        .subscribe({
            next: () => {
                this.loadRequests();
            },
            error: error => {
                console.error(error);
                this.error = 'Failed to assign maintenance request.';
            }
        });
}

getStaffName(accountId: number | undefined) {
    if (accountId === undefined) {
        return 'Unassigned';
    }

    const staff = this.staffAccounts.find(
        account => Number(account.AccountId) === Number(accountId)
    );

    if (!staff) {
        return 'Unassigned';
    }

    return `${staff.firstName} ${staff.lastName}`;
}
}