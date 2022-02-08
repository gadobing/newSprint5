import { LightningElement ,api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getMemberCardDetails from '@salesforce/apex/CCI_ViewMemberIdCardController.getMemberCardDetails';
export default class Cci_ViewMemberIdCard extends LightningElement {   
    cardDetails;
    strData;
    error;
    customMessage ='';
    showLoading = true;
    @api recordId;
    @track isModalOpen = false;
    handleClick(event) {
        this.isModalOpen = true;
        if(this.cardDetails === undefined || (this.cardDetails != undefined && this.cardDetails.statusCode !=200)){
            this.showLoading =true;
            console.log('@@getMemberCardDetails');//12972630W05t
            console.log('@@recordId',this.recordId);//0017j00000ghZNHAA2
            getMemberCardDetails({ memberId: this.recordId })
                .then(result => {
                    
                    this.showLoading =false;
                    console.log('@@result',result.statusCode);
                    console.log('@@@result',result.status);

                    if(result.statusCode == 200 ){
                    this.cardDetails = result;
                    this.strData = 'data:'+this.cardDetails.format+ ';'+this.cardDetails.encoding+','+this.cardDetails.content;
                    console.log('result',result);
                
                    }
                    else if(result.statusCode == 404){
                        const evt = new ShowToastEvent({
                            title: 'Error',
                            message: 'No ID card found on this MemmberId!',
                            variant: 'error',
                            mode: 'sticky'
                        });
                        this.dispatchEvent(evt);
                        this.isModalOpen = false;
                    }
                    else if(result.statusCode != 200){
                        const evt = new ShowToastEvent({
                            title: 'Error',
                            message: 'Something went wrong please try again after some time(Error Code= '+result.statusCode+',Message = '+result.status+')!',
                            variant: 'error',
                            mode: 'sticky'
                        });
                        this.dispatchEvent(evt);
                        this.isModalOpen = false;
                    }
                    else{}
                    if(this.cardDetails === undefined || this.cardDetails== null ){
                        this.customMessage ='No result found' ;
                    }
                    this.error = undefined;
                })
                .catch(error => {
                    this.error = error;
                    console.log('error',error);

                    const evt = new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(evt);
                    this.isModalOpen = false;
                });
        }    

    }
   
    openModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }

}