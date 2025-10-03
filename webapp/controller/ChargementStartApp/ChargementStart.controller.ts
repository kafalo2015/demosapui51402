import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";

import Button, { Button$PressEvent } from "sap/m/Button";
import MessageToast from "sap/m/MessageToast";
import MessageStrip from "sap/m/MessageStrip";
import UI5Element from "sap/ui/core/Element";



/**
 * @namespace clf.logistique.chargementquais.controller
 */
export default class ChargementStart extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

      // this.getOwnerComponent()?.getEventBus().subscribe("Default","notificationUMEvent",(channel:string,event:string,data: Object) => {           
      //       // EVOL : Notification en fin de chargementTODO ajout de l'action en paramètre
      //       this.notification_handler(Object.values(data)[0],Object.values(data)[1],Object.values(data)[2],Object.values(data)[3],Object.values(data)[4],Object.values(data)[5], Object.values(data)[6]);  
      //       },this); 


      //         // Enregistrement d'un handler pour la fin d'un chargeemnt
      //         this.getOwnerComponent()?.getEventBus().subscribe("Default","InitializeChargementStartMessageStripEvent",(channel:string,event:string,data: Object) => {           
               
      //                   let lv_messageStripInformation : MessageStrip = this.getView()?.byId("messageStripInformation_ViewChargementStart2") as MessageStrip;
      //                   let lv_messageStripWarning     : MessageStrip = this.getView()?.byId("messageStripWarning_ViewChargementStart2")     as MessageStrip;
      //                   let lv_messageStripError       : MessageStrip = this.getView()?.byId("messageStripError_ViewChargementStart2")       as MessageStrip;
      //                   lv_messageStripInformation.setVisible(false);
      //                   lv_messageStripWarning.setVisible(false);
      //                   lv_messageStripError.setVisible(false);
            
      //           },this); 
    }

    public notification_handler(type_msg:string, msg_txt: string,transport:string, um: String, current_quai: string, action :string, user:string ) : void{ 
  //  //--------------- Récupération des messages Strip de vue ChargementStart---------------------------------------
  //   let lv_messageStripInformation : MessageStrip = this.getView()?.byId("messageStripInformation_ViewChargementStart2") as MessageStrip;
  //   let lv_messageStripWarning     : MessageStrip = this.getView()?.byId("messageStripWarning_ViewChargementStart2")     as MessageStrip;
  //   let lv_messageStripError       : MessageStrip = this.getView()?.byId("messageStripError_ViewChargementStart2")       as MessageStrip;
  //   //--------------- Les messages Strip qui correspondent au type de message de la notification sont affichés---------------------------------------
  //   if  (type_msg == 'E' )          { lv_messageStripError.setVisible(true);       lv_messageStripError.setText(msg_txt);}       
  //                              else { lv_messageStripError.setVisible(false);   }
  //   if  (type_msg == 'W' )          { lv_messageStripWarning.setVisible(true);     lv_messageStripWarning.setText(msg_txt);}     
  //                              else { lv_messageStripWarning.setVisible(false);  }
  //   if  (type_msg == 'Information' ){ lv_messageStripInformation.setVisible(true); lv_messageStripInformation.setText(msg_txt);}
  //                              else { lv_messageStripInformation.setVisible(false); }
  //   //--------------- Un message Toast affiche la notification sur l"écran de lancement du chargment ---------------------------------------------------
  //   MessageToast.show(msg_txt, { duration: 4000, width : '300px' });    // Affichage de la notification d'erreur dans la vue de saisie d'un démarrage du chargmenet
    }
    
    public onAfterRendering(): void {
     }  

     public onClickChargementQuai(event: Button$PressEvent): void {
      //   console.log("CLICK SUR BOUTON CHARGEMENT QUAI:" +event.getSource().toString());
      //  // this.getOwnerComponent()?.getInterface().getComponentData().

      //  this.getOwnerComponent()?.getEventBus().publish("Default", "chargementStartEvent", {});

                            //Navigation sur le quai // Mettre un event

      // La navigation sur les vues de quais de fait dans le handler du event linkQuaiPressEvent
              //const router = UIComponent.getRouterFor(this);
              

               //let ChargementStartModel: JSONModel;

               //ChargementStartModel = this.getOwnerComponent()?.getModel("ChargementStartModel");
           
               //  let input_data:any = this.getOwnerComponent()?.getModel("ChargementStartModel");

            // if ( lv_quai == "QUAI8" )  {  router.getTargets()?.display("TargetChargementQuai08");  }
          

     }
     
 
}