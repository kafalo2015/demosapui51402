import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import Event from "sap/ui/base/Event";
import Button from "sap/m/Button";
import NavContainer from "sap/m/NavContainer";
import Page from "sap/m/Page";
import WebSocket, { WebSocket$MessageEvent } from "sap/ui/core/ws/WebSocket";
import UI5Element from "sap/ui/core/Element";


/**
 * @namespace clf.demo.sapui51402.demosapui51402.controller
 */
export default class AppChargementQuais extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
/*
        // METHODE 1 On rajouter la handler du socket au niveau de ce controller
         var _wsNotificationUm: WebSocket;
         let data_Socket : Object = '';
         _wsNotificationUm = this.getOwnerComponent()?.getInterface().getProperty('wsNotificationUm') as WebSocket;

         var that = this;
       
         _wsNotificationUm.attachMessage(data_Socket, function (e: WebSocket$MessageEvent) {   
         //v_webSocket.attachMessage(data_Socket, function (e: WebSocket$MessageEvent) {   // Ancien code
            const params = e.getParameters();
            // const user = params.pcpFields.User;
            //const userName = params.pcpFields.UserName;
            const content = params.data;
             console.log("Réception du message du Web Socket");
 
             MessageToast.show("Nouveau Chargement UM data_socket: " + content  ); 
             console.log("Nouveau Chargement UM WebSocket$MessageEvent: " + content );
             console.log("Relance des chargements après notification Web Socket");            
             //  that.get_chargement_quais();
             that.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {});        
         }); */

        // METHODE2 : On s'abonne à un évènement déclenché par le event handler du Socket dans le componnet controller       
        this.getOwnerComponent()?.getEventBus().subscribe("Default","notificationUMEvent",(channel:string,event:string,data: Object) => {           

            this.notification_handler(Object.values(data)[0],Object.values(data)[1],Object.values(data)[2]);  
            },this);          
        }

    public notification_handler(transport:string, um: String, current_quai: string) : void{ 
        let containerControl : NavContainer;
        containerControl = this.getView()?.byId("navContainerHeader") as NavContainer;
        // Si la page courante correspond au quai de la notification alors on recharge (on teste le quai 10 dans un premier temps)
        console.log("Quai de la nofication : " +  current_quai + " Quai affiché dans le container: " + containerControl.getCurrentPage().getId());
        if ( containerControl.getCurrentPage().getId().includes(current_quai))
        {

        console.log("OK -> La notification concerne le quai affiché actuellement : " +  current_quai + "---" + containerControl.getCurrentPage().getId());
        MessageToast.show("L'UM " + um + " du transport " + transport + " a été chargée sur le quai " + current_quai  ); 
        this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {});
       
        }
    }

    public onAfterRendering(): void {
       
     }


 
       public navigationFinished(event: Event) : void {
              // var toPage = evt.getParameter("to");
               //MessageToast.show("Navigation to page '" + toPage.getTitle() + "' finished");
           }
       

    public handleNav(event: Event): void {
            const navContainerHeader = this.byId("navContainerHeader") as NavContainer;
            //const navContainerUm = this.byId("navContainerUm") as NavContainer;
            //const navContainerPosteNoCharg = this.byId("navContainerPosteNonCharge") as NavContainer;
            //console.log("NavContainerHeader : " + navContainerHeader);  
            //console.log("NavContainerUm : " + navContainerUm);  

            const item = event.getSource() as Button;
            let target = item.data("target");
            //let targetListUm = target + "UMLIST";
            //let targetPosteNoCharge = target + "POSTENOCHARGE";
            
            console.log("Log OnPress : " + target);   
            if (target) {
               // var animation = this.byId("animationSelect").getSelectedKey();
               //navCon.to(this.byId(target));
               navContainerHeader.to(this.byId(target) as Page);
              // navContainerUm.to(this.byId(targetListUm) as Page);
              // navContainerPosteNoCharg .to(this.byId(targetPosteNoCharge) as Page);
               
            } else {
               //navCon.back();
            }
           
        }     


}