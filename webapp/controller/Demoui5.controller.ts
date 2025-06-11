import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace clf.demo.sapui51402.demosapui51402.controller
 */
export default class TestRestChargementList extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

    }
    onShowHello(): void {
        // show a native JavaScript alert
       // alert("Hello World");
       MessageToast.show("POC SAPUI5 NEW")
     }
  

}