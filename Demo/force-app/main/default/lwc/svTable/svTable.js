import { LightningElement, track } from 'lwc';
import getAccountData from '@salesforce/apex/BlazeMeterSVService.getAccountData';

export default class SvTable extends LightningElement {
    @track accountId = '';
    @track data = [];
    @track columns = [];
    @track error;

    // Default datatable columns
    defaultColumns = [
        { label: 'Account Id', fieldName: 'accountId' },
        { label: 'Account Name', fieldName: 'accountName' },
        { label: 'First Name', fieldName: 'firstName' },
        { label: 'Last Name', fieldName: 'lastName' },
        { label: 'Email', fieldName: 'email' },
        { label: 'Street', fieldName: 'street' },
        { label: 'Cost of Contract', fieldName: 'contractCost' },
        { label: 'UK Rate', fieldName: 'poundRate' },
    ];

    // Handle input change
    handleAccountIdChange(event) {
        this.accountId = event.target.value;
    }

    // Submit button
    handleSubmit() {
        if (!this.accountId) {
            this.error = 'Please enter an Account ID';
            return;
        }
        this.error = undefined;
        this.loadData(this.accountId);
    }

    // Refresh button
    handleRefresh() {
        if (!this.accountId) {
            this.error = 'No Account ID to refresh. Please enter one.';
            return;
        }
        this.error = undefined;
        this.loadData(this.accountId);
    }

    // Call Apex and flatten GBP rate
    loadData(accountId) {
        getAccountData({ accountId })
            .then(result => {
                // Flatten poundRate.GBP into poundRate field
                this.data = result.map(row => {
                    return {
                        ...row,
                        poundRate: row.poundRate && row.poundRate.data ? row.poundRate.data.GBP : null
                    };
                });
                this.columns = this.defaultColumns;
            })
            .catch(error => {
                this.error = error.body ? error.body.message : error.message;
                this.data = [];
                this.columns = [];
            });
    }
}