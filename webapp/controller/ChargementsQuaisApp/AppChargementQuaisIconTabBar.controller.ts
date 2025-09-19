import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import IconTabBar, { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import UIComponent from "sap/ui/core/UIComponent";
import Control from "sap/ui/core/Control";
import MessageStrip from "sap/m/MessageStrip";
import View from "sap/ui/core/mvc/View";
import Panel from "sap/m/Panel";
import SideNavigation, { SideNavigation$ItemSelectEvent } from "sap/tnt/SideNavigation";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace clf.logistique.chargementquais.controller
 */
export default class AppChargementQuaisIconTabBar extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
  // METHODE : On s'abonne à un évènement déclenché par le event handler du Socket dans le componnet controller       
        this.getOwnerComponent()?.getEventBus().subscribe("Default","notificationUMEvent",(channel:string,event:string,data: Object) => {           
            // EVOL : Notification en fin de chargementTODO ajout de l'action en paramètre
            this.notification_handler(Object.values(data)[0],Object.values(data)[1],Object.values(data)[2],Object.values(data)[3],Object.values(data)[4],Object.values(data)[5], Object.values(data)[6]);  
            },this);   

          // Enregistrement d'un handler pour le click sur quai dans Chargement List   
        this.getOwnerComponent()?.getEventBus().subscribe("Default","chargementQuaiButtonEvent",(channel:string,event:string,data: Object) => {           
              this.button_chargementquai_handler();  
            },this); 
        }
     //----------------------------------------------------------------------------------------------------------------------------//
     //               Affichage des notifications d'Erreur/Warning ou Succes dans les messages Strip du quaui                                                                                     //  
     //----------------------------------------------------------------------------------------------------------------------------// 
    public notification_handler(type_msg:string, msg_txt: string,transport:string, um: String, current_quai: string, action :string, user:string ) : void{ 
          let IconTabBarControl : IconTabBar = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
          let message_chargementum_ok :string;
          // Panel d'affichage des messages  
          let panelMessage : Panel = this.byId("PanelMessageAppChargementQuais") as Panel;   // TODO=>Mettre le numéro de quai en dynamique
          //let panelMessageQuai : Panel;
          // Message Strip au niveau des vues de quai
          let messageStrip_ref : MessageStrip;
          let messageStripErrorQuai : MessageStrip;
          let messageStripWarningQuai : MessageStrip;
          let messageStripInformationQuai : MessageStrip;
          
          console.log("------------------ AppChargementQuaisIconTabBar.controller/NOTIFICATION HANDLER -----------------------------------------------------------------------------------------------------");
          console.log("P1 Quai de la notification : " +  current_quai.toLowerCase() + " Quai affiché dans l'IconTabBar: " + IconTabBarControl.getSelectedKey());
        // Si la page courante correspond au quai de la notification alors on recharge (on teste le quai 10 dans un premier temps)
        // if ( IconTabBarControl.getSelectedKey() == current_quai){                 //TODO=>Evol LOT 4 : Ce test n''est pas nécessaire les messages strip
                                                                                   // doivent se mettre à jour meême si on ne se trouve pas sur le quai concerné
                                                                                   // par la notificaiotn
               let tcontent : View[] = IconTabBarControl.getContent() as View[];
               let tcontent_views : Control[]
               tcontent.forEach((content) => {
               tcontent_views = content.getContent() as Control[];
                tcontent_views.forEach((control) => {
                // code pour remplir le  messageStrip d'erreur et le messageStrip d'information du quai 
                    console.log(control.getId());
                  if ( control.getId() == "container-clf.logistique.chargementquais---" + current_quai.toLowerCase() + "--messageStripError" )
                  {
                    messageStripErrorQuai = control as MessageStrip;
              
                   if ( type_msg == 'E' ){
                    messageStripErrorQuai.setText(msg_txt); 
                    messageStripErrorQuai.setVisible(true); 
                    } 
                  if  ( type_msg == 'W' ) {messageStripErrorQuai.setVisible(false);     }
                  if  ( type_msg == 'information' ) {messageStripErrorQuai.setVisible(false);     }
                  } 

                  if ( control.getId() == "container-clf.logistique.chargementquais---" + current_quai.toLowerCase() + "--messageStripWarning" )
                  {
                    messageStripWarningQuai = control as MessageStrip;
                   // if ( type_msg == 'error' ){

                   if ( type_msg == 'W' ){
                     messageStripWarningQuai.setText(msg_txt); 
                     messageStripWarningQuai.setVisible(true); 
                    } 
                  if  ( type_msg == 'E' ) { messageStripWarningQuai.setVisible(false);     }
                  if  ( type_msg == 'information' ) { messageStripWarningQuai.setVisible(false);     }
                  }  

                    if (  control.getId() == "container-clf.logistique.chargementquais---" + current_quai.toLowerCase() + "--messageStripInformation" )
                    {
                      messageStripInformationQuai = control as MessageStrip;
                      if ( type_msg == 'information' )
                      {
                      messageStripInformationQuai.setText(msg_txt); 
                      messageStripInformationQuai.setVisible(true); 
                      }
                      if ( type_msg == 'E' ){  messageStripInformationQuai.setVisible(false);     }
                      if ( type_msg == 'W' ){  messageStripInformationQuai.setVisible(false);   }
                    }
                })
              })
              // LOT 4 : Chargement des quais  => Code erroné à changer
              // Si le quai affiché est concerné par la notification et le message est de type information alors on affiche un Toast et on rafraichit le quai 
              //if ( type_msg == 'information' )  //if ( IconTabBarControl.getSelectedKey() == current_quai){
               // {
                //  MessageToast.show(msg_txt);
                 // this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {}); 
               // }
               // LOT 4 : Chargement des quais  => Code erroné à changer
        //}
                // LOT 4 : Chargement des quais 
              // Si le quai affiché est concerné par la notification et le message est de type information alors on affiche un Toast et on rafraichit le quai 
              if ((action == 'chargement') && (type_msg == 'information' ) ) // TODO => && ( IconTabBarControl.getSelectedKey() == current_quai
                {
                  MessageToast.show(msg_txt);
                  this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {}); 
                  this.getOwnerComponent()?.getEventBus().publish("Default", "chargementListEvent", {}); "Rechargement de la liste des chargements prévus"
                }
               // LOT 4 : Chargement des quais  =  

               // Affichage de tous les messages (Information et Erreur) relatifs à l'ensemble des quais
                messageStrip_ref = new MessageStrip();
                messageStrip_ref.setText(msg_txt);       // Correctif++ 14/08/2025 Correctifs notifications
                                                         // Toujours afficher le message dans  la zone Messages quel que soit le type de message (E, W ou S)
                //   msgStrip.setType(MessageType.Error);
                 messageStrip_ref.setShowIcon(true);
                 messageStrip_ref.setShowCloseButton(true);  
                 console.log("P1 AJOUT d'un message dans la zone MEssages multi quai");
                 panelMessage.addAggregation("content",messageStrip_ref);

                 // TODO Notification fin de chargement 
                 //Si l'action est fin de chargement alors il faut recharger le chargement des quais quel que soit le quai affiché
                 // Modification LOT 4 'Lancement début de chargementnt'
                 //if ( action = 'finchargement' )
                 if ( action == 'finchargement'  ||  action == 'startchargement')
                 {
                 console.log("Notification de fin de chargement");
                 MessageToast.show(msg_txt);
                 this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {});  //Notification fin de chargement"
                 }
    }
      //----------------------------------------------------------------------------------------------------------------------------//
     //               Handler clic sur le quai                                                                                     //  
     //----------------------------------------------------------------------------------------------------------------------------//
    public button_chargementquai_handler() : void{ 
        let IconTabBarControl : IconTabBar;
        IconTabBarControl = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
       let selectedKeyQuaiNumber : string  =  IconTabBarControl.getSelectedKey();
       console.log(" button_chargementquai_handler() : " + selectedKeyQuaiNumber);
         const router = UIComponent.getRouterFor(this);
           if ( selectedKeyQuaiNumber == "" )        {  router.getTargets()?.display("TargetChargementQuai08");  }   // Evolution quai 8 et 09
           if ( selectedKeyQuaiNumber == "QUAI08" )  {  router.getTargets()?.display("TargetChargementQuai08");  }   // Evolution quai 8 et 09s
           if ( selectedKeyQuaiNumber == "QUAI09" )  {  router.getTargets()?.display("TargetChargementQuai09");  }
           if ( selectedKeyQuaiNumber == "QUAI10" )  {  router.getTargets()?.display("TargetChargementQuai10");  }
           if ( selectedKeyQuaiNumber == "QUAI11" )  {  router.getTargets()?.display("TargetChargementQuai11");  }
           if ( selectedKeyQuaiNumber == "QUAI12" )  {  router.getTargets()?.display("TargetChargementQuai12");  }
           if ( selectedKeyQuaiNumber == "QUAI13" )  {  router.getTargets()?.display("TargetChargementQuai13");  }
           if ( selectedKeyQuaiNumber == "QUAI14" )  {  router.getTargets()?.display("TargetChargementQuai14");  }
           if ( selectedKeyQuaiNumber == "QUAI15" )  {  router.getTargets()?.display("TargetChargementQuai15");  }
        }

     //----------------------------------------------------------------------------------------------------------------------------//
     //               Handler clic sur le quai  (Pour synchroniser le routing avec le quai sélectionné)                                                                                   //  
     //----------------------------------------------------------------------------------------------------------------------------//
    public onAfterRendering(): void {
      let IconTabBarControl : IconTabBar;
      IconTabBarControl = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;

     let content_string : any  = this.byId("idIconTabBarQuais")?.getAggregation("content")?.toString();
     let content_string_table : string[] = content_string.split("---",2 );
     console.log("IcontabBar content_string" + content_string_table[1]);
     console.log("IconTabBar Selected Key" + IconTabBarControl.getSelectedKey());
     IconTabBarControl.setSelectedKey(content_string_table[1].toUpperCase());
     }
//----------------------------------------------------------------------------------------------------------------------------//
//               Handler de sélection d'un d'un onglet de l'IConTabBar                                                       //  
//----------------------------------------------------------------------------------------------------------------------------//
    public onTabSelect(event: IconTabBar$SelectEvent): void {
        let key = event.getParameter("key");
        const router = UIComponent.getRouterFor(this);

       //LOT 6 : Démarrage du chargement à partir du quai
       
              let ChargementQuaiModel : JSONModel = this.getOwnerComponent()?.getModel("chargementModelJson") as JSONModel;
              let indice_quai : number;
              let indice_json : number;

               indice_quai = Number( key?.slice(4,6));
               indice_json = indice_quai - 8;

            //TargetStartChargementQuai10

        console.log("P1 Indice JSON du quai:  " + indice_quai);      
        console.log("P1 valeur du modèle du chargement  " + ChargementQuaiModel.getObject("/results/" + indice_json + "/chargementEncours"));
         let encours : boolean = ChargementQuaiModel.getObject("/results/" + indice_json + "/chargementEncours");
        console.log("Key of IconTabBar selected item = " + key );

         // if ( encours == true ) A remettre Après dev Modèle de Notifications
          {
            if ( key == "QUAI08" )   {  router.getTargets()?.display("TargetChargementQuai08");  }   // Evolution quai 8 et 09
            if ( key == "QUAI09" )   {  router.getTargets()?.display("TargetChargementQuai09");  }   // Evolution quai 8 et 09
            if ( key == "QUAI10" )  {  router.getTargets()?.display("TargetChargementQuai10");  }
            if ( key == "QUAI11" )  {  router.getTargets()?.display("TargetChargementQuai11");  }
            if ( key == "QUAI12" )  {  router.getTargets()?.display("TargetChargementQuai12");  }
            if ( key == "QUAI13" )  {  router.getTargets()?.display("TargetChargementQuai13");  }
            if ( key == "QUAI14" )  {  router.getTargets()?.display("TargetChargementQuai14");  }
            if ( key == "QUAI15" )  {  router.getTargets()?.display("TargetChargementQuai15");  }
          }
              // else
              // {

              //     router.getTargets()?.display("TargetStartChargement");

              // }

    } 

}