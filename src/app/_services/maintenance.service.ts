import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { MaintenanceRequest, MaintenanceAttachment } from '@app/_models';

const baseUrl = `${environment.apiUrl}/maintenance`;

@Injectable({ providedIn: 'root' })
export class MaintenanceService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<MaintenanceRequest[]>(baseUrl);
    }

    getById(RequestId: number) {
        return this.http.get<MaintenanceRequest>(`${baseUrl}/${RequestId}`);
    }

    create(params: any) {
        return this.http.post<any>(baseUrl, params);
    }

    getAttachments(RequestId: number) {
        return this.http.get<MaintenanceAttachment[]>(
            `${baseUrl}/${RequestId}/attachments`
        );
    }

    uploadAttachment(RequestId: number, file: File) {
        const formData = new FormData();
        formData.append('image', file);

        return this.http.post<any>(
            `${baseUrl}/${RequestId}/attachments`,
            formData
        );
    }

    updateStatus(id: number, status: string) {
    return this.http.patch(
        `${baseUrl}/${id}/status`,
        { status }
    );
    }
    
    getAssigned() {
    return this.http.get<MaintenanceRequest[]>(`${baseUrl}/assigned`);
    }

    assign(id: number, assignedTo: number) {
    return this.http.patch(`${baseUrl}/${id}/assign`, { assignedTo });
}

}