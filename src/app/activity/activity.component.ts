import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, ActivityService } from '@app/_services';
import { ActivityLog, Role } from '@app/_models';

interface ActionInfo {
    value: string;
    label: string;
    icon: string;
    tone: string;
}

@Component({
    templateUrl: 'activity.component.html',
    styleUrls: ['activity.component.css']
})
export class ActivityComponent implements OnInit {
    isAdmin = false;
    form!: FormGroup;

    logs: ActivityLog[] = [];
    accounts: any[] = [];

    loading = false;
    error = '';

    page = 1;
    pageSize = 20;
    total = 0;
    totalPages = 1;

    actions: ActionInfo[] = [
        { value: 'login', label: 'Login', icon: 'bi-box-arrow-in-right', tone: 'account' },
        { value: 'password_reset', label: 'Password reset', icon: 'bi-key', tone: 'account' },
        { value: 'profile update', label: 'Profile update', icon: 'bi-person-gear', tone: 'account' },
        { value: 'request_created', label: 'Request created', icon: 'bi-plus-circle', tone: 'request' },
        { value: 'request_classified', label: 'AI classified', icon: 'bi-stars', tone: 'system' },
        { value: 'request_auto_assigned', label: 'Auto-assigned', icon: 'bi-cpu', tone: 'system' },
        { value: 'request_assigned', label: 'Assigned', icon: 'bi-person-check', tone: 'assign' },
        { value: 'request_reassigned', label: 'Reassigned', icon: 'bi-arrow-left-right', tone: 'assign' },
        { value: 'request_status_changed', label: 'Status changed', icon: 'bi-check2-circle', tone: 'status' },
        { value: 'attachment_uploaded', label: 'Image uploaded', icon: 'bi-image', tone: 'file' }
    ];

    constructor(
        private fb: FormBuilder,
        private accountService: AccountService,
        private activityService: ActivityService
    ) { }

    ngOnInit() {
        this.isAdmin = this.accountService.accountValue?.role === Role.Admin;

        this.form = this.fb.group({
            actionType: [''],
            startDate: [''],
            endDate: [''],
            userId: [''],
            includeLogins: [false]
        });

        // Ticking or unticking "Include logins" refreshes the list straight away
        this.form.get('includeLogins')!.valueChanges.subscribe(() => this.applyFilters());

        if (this.isAdmin) {
            this.accountService.getAll()
                .pipe(first())
                .subscribe(accounts => this.accounts = accounts);
        }

        this.load();
    }

    get rangeInvalid() {
        const { startDate, endDate } = this.form.value;
        return !!startDate && !!endDate && startDate > endDate;
    }

    get firstShown() {
        return this.total === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
    }

    get lastShown() {
        return Math.min(this.page * this.pageSize, this.total);
    }

    load() {
        this.loading = true;
        this.error = '';

        this.activityService.getLogs({
            ...this.form.value,
            page: this.page,
            pageSize: this.pageSize
        })
            .pipe(first())
            .subscribe({
                next: result => {
                    this.logs = result.data;
                    this.total = result.total;
                    this.page = result.page;
                    this.totalPages = result.totalPages;
                    this.loading = false;
                },
                error: () => {
                    this.error = 'Could not load the activity log. Please try again.';
                    this.loading = false;
                }
            });
    }

    applyFilters() {
        if (this.rangeInvalid) return;
        this.page = 1;
        this.load();
    }

    resetFilters() {
        this.form.reset({ actionType: '', startDate: '', endDate: '', userId: '', includeLogins: false }, { emitEvent: false });
        this.page = 1;
        this.load();
    }

    goTo(page: number) {
        if (page < 1 || page > this.totalPages || page === this.page) return;
        this.page = page;
        this.load();
    }

    info(type: string): ActionInfo {
        return this.actions.find(a => a.value === type)
            || { value: type, label: type, icon: 'bi-dot', tone: 'file' };
    }

    // Hover text for Admin: where the action came from
    tooltip(log: ActivityLog): string | null {
        if (!log.ipAddress) return null;
        return log.browserInfo
            ? `IP: ${log.ipAddress}\n${log.browserInfo}`
            : `IP: ${log.ipAddress}`;
    }

    trackById(index: number, log: ActivityLog) {
        return log.activityLogId;
    }
}