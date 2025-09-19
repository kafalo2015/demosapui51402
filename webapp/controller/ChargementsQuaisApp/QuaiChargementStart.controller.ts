import Controller from "sap/ui/core/mvc/Controller";
import Table from "sap/m/Table";
import { Sticky } from "sap/m/library";
import Dialog from "sap/m/Dialog";
import Context from "sap/ui/model/Context";
import Button, { Button$PressEvent } from "sap/m/Button";
import IconTabBar, { IconTabBar$SelectEvent } from "sap/m/IconTabBar";

/**
 * @namespace clf.logistique.chargementquais.controller
 */
export default class QuaiChargementStart extends Controller {


    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {         
  
      }

    public onAfterRendering(): void {
       
    }
      public onClickChargementQuai(event: Button$PressEvent): void {
        console.log("CLICK SUR BOUTON CHARGEMENT QUAI:" +event.getSource().toString());
       // this.getOwnerComponent()?.getInterface().getComponentData().
       console.log("P1 Récupération du quai : "  + this.getView()?.getParent());
      let iconTahBar : IconTabBar =  this.getView()?.getParent() as IconTabBar;
      console.log("P1 SELECTED KEY OF QUAI : " + iconTahBar.getSelectedKey());
      let data : {quai:String} = { quai: iconTahBar.getSelectedKey() }
      this.getOwnerComponent()?.getEventBus().publish("Default", "chargementStartEvent", data);
     }
    
}