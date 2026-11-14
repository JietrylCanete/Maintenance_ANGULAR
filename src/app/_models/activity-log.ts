export interface ActivityLog {
    activityLogId: number;
    actionType: string;
    actionDetails?: string | null;
    timestamp: string;
    requestId?: number | null;
    actorName: string;
    actorRole?: string | null;
    actorEmail?: string | null;
    byMe: boolean;
    ipAddress?: string | null;
    browserInfo?: string | null;
}

export interface ActivityLogPage {
    data: ActivityLog[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ActivityFilters {
    actionType?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
    includeLogins?: boolean;
    page?: number;
    pageSize?: number;
}