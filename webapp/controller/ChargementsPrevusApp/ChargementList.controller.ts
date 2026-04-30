import Controller from "sap/ui/core/mvc/Controller";
import { Link$PressEvent } from "sap/m/Link";
import UIComponent from "sap/ui/core/UIComponent";
import Table from "sap/m/Table";
import { Sticky } from "sap/m/library";

/**
 * @namespace clf.logistique.chargementquais.controller
 */

  enum quais_enum {
  QUAI08 = "QUAI08",
  QUAI09 = "QUAI09",
  QUAI10 = "QUAI10",
  QUAI11 = "QUAI11",
  QUAI12 = "QUAI12",
  QUAI13 = "QUAI13",
  QUAI14 = "QUAI14",
  QUAI15 = "QUAI15",
  }
export default class chargementlist extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
     let chargementTable: Table = this.byId("chargementTable") as Table;
     let t_sticky: Sticky[] = new Array(Sticky.ColumnHeaders); 
     chargementTable.setSticky(t_sticky);
    }

    public onAfterRendering(): void {
     }  
     
    public  handleLinkPress(event: Link$PressEvent): void {
      let lv_quai:string = event.getSource().getText();
      //console.log("Text du link: " +  lv_quai);
      // let data : {quai:String} = {
      //    quai: lv_quai              
      //  };
     // La navigation sur les vues de quais de fait dans le handler du event linkQuaiPressEvent
      const router = UIComponent.getRouterFor(this);
      const lv_quai_number : string =  lv_quai?.slice(4,6);
      router.navTo("RouteChargementQuai", {quainumber: lv_quai_number})   
}
      
}