import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';
import { ActivityFilters, ActivityLogPage } from '@app/_models';

const baseUrl = `${environment.apiUrl}/activity`;

@Injectable({ providedIn: 'root' })
export class ActivityService {

    constructor(private http: HttpClient) { }

    getLogs(filters: ActivityFilters) {
        let params = new HttpParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value));
            }
        });

        return this.http.get<ActivityLogPage>(baseUrl, { params });
    }
}