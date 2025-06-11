import Controller from "sap/ui/core/mvc/Controller";
import Event from "sap/ui/base/Event";
import JSONModel from "sap/ui/model/json/JSONModel";


/**
 * @namespace clf.demo.sapui51402.demosapui51402.controller
 */
export default class Demoui5chargementjson2 extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

    }

    public onAfterRendering(): void {
       // this.getOwnerComponent()?.getModel("chargementModel")?.refresh();
       // console.log("OnAfterRendering de la vue sur les données BAS:" + this.getOwnerComponent()?.getModel("chargementModel"). );
    
    }
    onShowHello(): void {
        // show a native JavaScript alert
        console.log("Hello World");
     }
     onPress(event: Event): void {
        //obj.ProductName = "test add me";
        //obj.Quantity = 120;
        //obj.Status = "C";

      // var oModel = this.getModel("invoice");
      // var localdata = oModel.getData();
      // localdata.Invoices.push(obj);
      // oModel.setData(localdata); 

      //const chargementobj as Object;
      //chargementobj.um = '13425325';
      console.log("Controller de la vue ChargementJSOn2");
       const oModel = this.getOwnerComponent()?.getModel("chargementQuaiMdl") as JSONModel;
       const localdata = oModel.getData();
    
       console.log(oModel.getData());
       localdata.chargementQuai.chargementUm.push({ "um": "200", "livraison": "4850398586","poste": "000020","article" : "TGA6007SC", "qtite": "442"});
       oModel.setData(localdata); 
      }   
    

}