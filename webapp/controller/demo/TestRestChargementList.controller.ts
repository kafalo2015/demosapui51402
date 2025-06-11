import Controller from "sap/ui/core/mvc/Controller";


/**
 * @namespace clf.demo.sapui51402.demosapui51402.controller
 */
export default class TestRestChargementList extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

    }

    public onAfterRendering(): void {
        this.getOwnerComponent()?.getModel("chargementModel")?.refresh();
       // console.log("OnAfterRendering de la vue sur les données BAS:" + this.getOwnerComponent()?.getModel("chargementModel"). );
    
    }
    

}