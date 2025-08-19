import { LightningElement, track } from 'lwc';
import updateContractValue from '@salesforce/apex/UpdateContractController.updateContractValue';

export default class UpdateContract extends LightningElement {
    @track accountId = '';
    @track contractValue = '';
    @track response;
    @track error;

    handleAccountIdChange(event) {
        this.accountId = event.target.value;
    }

    handleContractValueChange(event) {
        this.contractValue = event.target.value;
    }

    handleSubmit() {
        this.response = undefined;
        this.error = undefined;

        updateContractValue({ 
            accountId: this.accountId,
            value: this.contractValue
        })
        .then(result => {
            this.response = result;
        })
        .catch(err => {
            this.error = err.body ? err.body.message : err.message;
        });
    }
}