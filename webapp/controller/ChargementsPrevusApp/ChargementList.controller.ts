import Controller from "sap/ui/core/mvc/Controller";
import { Link$PressEvent } from "sap/m/Link";
import UIComponent from "sap/ui/core/UIComponent";
import Table from "sap/m/Table";
import { Sticky } from "sap/m/library";

/**
 * @namespace clf.demo.sapui51402.demosapui51402.controller
 */
export default class ChargementList extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
     let chargementTable: Table = this.byId("chargementTable") as Table;
     let t_sticky: Sticky[] = new Array(Sticky.ColumnHeaders); 
     chargementTable.setSticky(t_sticky);
    }

    public onAfterRendering(): void {
     }  
     
    public  handleLinkPress(event: Link$PressEvent): void {
      console.log("OnPress sur le link");
      let lv_quai:string = event.getSource().getText();
      console.log("Text du link: " +  lv_quai);
      let data : {quai:String} = {
         quai: lv_quai              
       };
     // La navigation sur les vues de quais de fait dans le handler du event linkQuaiPressEvent
       const router = UIComponent.getRouterFor(this);
      if ( lv_quai == "QUAI8" )  {  router.getTargets()?.display("TargetChargementQuai08");  }
      if ( lv_quai == "QUAI9" )  {  router.getTargets()?.display("TargetChargementQuai09");  }
      if ( lv_quai == "QUAI10" )  {  router.getTargets()?.display("TargetChargementQuai10");  }
      if ( lv_quai == "QUAI11" )  {  router.getTargets()?.display("TargetChargementQuai11");  }
      if ( lv_quai == "QUAI12" )  {  router.getTargets()?.display("TargetChargementQuai12");  }
      if ( lv_quai == "QUAI13" )  {  router.getTargets()?.display("TargetChargementQuai13");  }
      if ( lv_quai == "QUAI14" )  {  router.getTargets()?.display("TargetChargementQuai14");  }
      if ( lv_quai == "QUAI15" )  {  router.getTargets()?.display("TargetChargementQuai15");  }
}
      
}