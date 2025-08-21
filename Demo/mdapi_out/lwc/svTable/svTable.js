import { LightningElement, track } from 'lwc';
import getAccountData from '@salesforce/apex/BlazeMeterSVService.getAccountData';

export default class SvTable extends LightningElement {
    @track accountId = '';
    @track data = [];
    @track isMobile = false;
    @track columns = [];
    @track error;

    defaultColumns = [
        { label: 'Account Id', fieldName: 'accountId' },
        { label: 'Account Name', fieldName: 'accountName' },
        { label: 'First Name', fieldName: 'firstName' },
        { label: 'Last Name', fieldName: 'lastName' },
        { label: 'Email', fieldName: 'email' },
        { label: 'Street', fieldName: 'street' },
        { label: 'Cost of Contract', fieldName: 'contractCost' },
        { label: 'UK Rate', fieldName: 'poundRate' }
    ];

    connectedCallback() {
        this.isMobile = window.innerWidth <= 768;
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
        });
    }

    handleAccountIdChange(event) {
        this.accountId = event.target.value;
    }

    handleSubmit() {
        if (!this.accountId) {
            this.error = 'Please enter an Account ID';
            return;
        }
        this.error = undefined;
        this.loadData(this.accountId);
    }

    handleRefresh() {
        if (!this.accountId) {
            this.error = 'No Account ID to refresh. Please enter one.';
            return;
        }
        this.error = undefined;
        this.loadData(this.accountId);
    }

    loadData(accountId) {
        getAccountData({ accountId })
            .then(result => {
                // Map the data to add a unique 'id' field for the key-field attribute.
                // Also, flatten the poundRate field as before.
                this.data = result.map((row, index) => {
                    return {
                        ...row,
                        // Create a unique ID for each row to satisfy the datatable's key-field requirement.
                        id: `row-${index}-${row.accountId}`, 
                        poundRate: row.poundRate?.data?.GBP ?? null
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