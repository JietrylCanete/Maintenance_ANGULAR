import { Component } from '@angular/core';

import { AccountService } from '@app/_services';
import { Role } from '@app/_models';

@Component({
    templateUrl: 'layout.component.html'
})
export class LayoutComponent {
    Role = Role;
    account = this.accountService.accountValue;

    constructor(private accountService: AccountService) { }
}