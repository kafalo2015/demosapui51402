import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";

import Button, { Button$PressEvent } from "sap/m/Button";



/**
 * @namespace clf.logistique.chargementquais.controller
 */
export default class ChargementStart extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
    }

    public onAfterRendering(): void {
     }  

     public onClickChargementQuai(event: Button$PressEvent): void {
        console.log("CLICK SUR BOUTON CHARGEMENT QUAI:" +event.getSource().toString());
       // this.getOwnerComponent()?.getInterface().getComponentData().

       this.getOwnerComponent()?.getEventBus().publish("Default", "chargementStartEvent", {});

                            //Navigation sur le quai // Mettre un event

      // La navigation sur les vues de quais de fait dans le handler du event linkQuaiPressEvent
              //const router = UIComponent.getRouterFor(this);
              

               //let ChargementStartModel: JSONModel;

               //ChargementStartModel = this.getOwnerComponent()?.getModel("ChargementStartModel");
           
               //  let input_data:any = this.getOwnerComponent()?.getModel("ChargementStartModel");

            // if ( lv_quai == "QUAI8" )  {  router.getTargets()?.display("TargetChargementQuai08");  }
          

     }
     
 
}