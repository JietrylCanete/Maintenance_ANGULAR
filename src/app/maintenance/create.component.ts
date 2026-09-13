import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MaintenanceService } from '@app/_services';

@Component({
    templateUrl: 'create.component.html'
})
export class CreateComponent {

    loading = false;
    submitted = false;
    error = '';

    selectedFile: File | null = null;

    form = this.formBuilder.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        location: ['', Validators.required]
    });

    constructor(
        private formBuilder: FormBuilder,
        private maintenanceService: MaintenanceService,
        private router: Router
    ) { }

    get f() {
        return this.form.controls;
    }

    onFileSelected(event: any) {
        const file = event.target.files?.[0];

        if (file) {
            this.selectedFile = file;
        }
    }

    onSubmit() {
        this.submitted = true;
        this.error = '';

        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        const request = {
            title: this.form.value.title,
            description: this.form.value.description,
            location: this.form.value.location
        };

        this.maintenanceService.create(request)
            .subscribe({
                next: response => {

                    const requestId =
                        response.request?.RequestId ||
                        response.RequestId;

                    if (!requestId) {
                        this.error = 'Request was created but no RequestId was returned.';
                        this.loading = false;
                        return;
                    }

                    if (this.selectedFile) {
                        this.maintenanceService
                            .uploadAttachment(requestId, this.selectedFile)
                            .subscribe({
                                next: () => {
                                    this.router.navigate(['/maintenance']);
                                },
                                error: error => {
                                    console.error(error);
                                    this.error = 'Request was created, but the image upload failed.';
                                    this.loading = false;
                                }
                            });
                    } else {
                        this.router.navigate(['/maintenance']);
                    }
                },
                error: error => {
                    console.error(error);
                    this.error = error.error?.message || 'Failed to create maintenance request.';
                    this.loading = false;
                }
            });
    }
}