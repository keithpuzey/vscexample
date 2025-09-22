import { LightningElement, track } from 'lwc';
import getAccountData from '@salesforce/apex/BlazeMeterSVService.getAccountData';

export default class SvTable extends LightningElement {
    @track accountId = '12345'; // default account on load
    @track data = [];
    @track isMobile = false;
    @track columns = [];
    @track error;
    @track lastUpdatedDate;

    // Dynamic columns with initial widths and wrapText
    defaultColumns = [
        { label: 'Account Id', fieldName: 'accountId', wrapText: true, initialWidth: 120 },
        { label: 'Account Name', fieldName: 'accountName', wrapText: true, initialWidth: 180 },
        { label: 'First Name', fieldName: 'firstName', wrapText: true, initialWidth: 120 },
        { label: 'Last Name', fieldName: 'lastName', wrapText: true, initialWidth: 120 },
        { label: 'Email', fieldName: 'email', wrapText: true, initialWidth: 220 },
        { label: 'Street', fieldName: 'street', wrapText: true, initialWidth: 200 },
        { label: 'Cost of Contract', fieldName: 'contractCost', wrapText: true, initialWidth: 160 },
        { label: 'UK Rate', fieldName: 'poundRate', wrapText: true, initialWidth: 100 }
    ];

    connectedCallback() {
        this.checkIfMobile();
        window.addEventListener('resize', () => this.checkIfMobile());

        // Load default account on page load
        this.loadData(this.accountId);
    }

    checkIfMobile() {
        this.isMobile = window.innerWidth <= 768;
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
                // Map UK Rate to formatted GBP string
                this.data = result.map(item => {
                    const gbpRate = item.poundRate?.data?.GBP ?? null;
                    return {
                        ...item,
                        poundRate: gbpRate !== null
                            ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(gbpRate)
                            : ''
                    };
                });

                this.columns = this.defaultColumns;
                this.lastUpdatedDate = new Date().toLocaleString();
                this.error = undefined;
            })
            .catch(error => {
                this.error = error.body ? error.body.message : error.message;
                this.data = [];
                this.columns = [];
            });
    }
}