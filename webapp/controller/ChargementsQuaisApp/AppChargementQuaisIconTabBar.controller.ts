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
import Dialog from "sap/m/Dialog";

/**
 * @namespace clf.logistique.chargementquais.controller
 */
export default class AppChargementQuaisIconTabBar extends Controller {


    private gv_current_quai_number : number;
    private gv_dialog_validation_charg: Dialog;
    
    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

  let panelMessage : Panel = this.byId("PanelMessageAppChargementQuais") as Panel;   // TODO=>Mettre le numéro de quai en dynamique
    
  
  //----------------------------------------------------------------------------------------------------------------------------//
  //               LOT 8 : Validation des messages de chargement                                                                 //  
  //----------------------------------------------------------------------------------------------------------------------------//
this.onOpenDialogValidCharg();

  //panelMessage.bindAggregation()
  // METHODE : On s'abonne à un évènement déclenché par le event handler du Socket dans le componnet controller       
        // this.getOwnerComponent()?.getEventBus().subscribe("Default","notificationUMEvent",(channel:string,event:string,data: Object) => {           
        //     // EVOL : Notification en fin de chargementTODO ajout de l'action en paramètre
        //     this.notification_handler(Object.values(data)[0],Object.values(data)[1],Object.values(data)[2],Object.values(data)[3],Object.values(data)[4],Object.values(data)[5], Object.values(data)[6]);  
        //     },this);   

          // Enregistrement d'un handler pour le click sur quai dans Chargement List   
        this.getOwnerComponent()?.getEventBus().subscribe("Default","chargementQuaiButtonEvent",(channel:string,event:string,data: Object) => {           
              this.button_chargementquai_handler();  
            },this); 

     //----------------------------------------------------------------------------------------------------------------------------//
     //                LOT 8 : Validation des messages de chargement                                                                                 //  
     //----------------------------------------------------------------------------------------------------------------------------//
      this.getOwnerComponent()?.getEventBus().subscribe("Default","validationDialogEvent",(channel:string,event:string,data: Object) => {           
            //this.notification_handler(Object.values(data)[0],Object.values(data)[1],Object.values(data)[2],Object.values(data)[3],Object.values(data)[4],Object.values(data)[5]);  
          //------------------------ OSOLETE BEGIN--------------------------------------------
          // let messageValidationChargementModel : JSONModel =  this.getOwnerComponent()?.getModel("messageValidationChargementModel") as JSONModel;
          // console.log("P1 HIGH vALEUR DE VALIDATION TXT : " + Object.values(data)[0])
          // if (messageValidationChargementModel.setProperty("/validationchargementmessage", Object.values(data)[0]) == true)
          // {
          //     console.log("P1 MAJ du modèle de validation de chargemnt avec la dernier message de WARNING :" + messageValidationChargementModel.getProperty("/validationchargementmessage") );;

          // }
          //------------------------ OSOLETE END--------------------------------------------

           // TODO => Avant d'ouvrir la boîte de dialoque il faaut modifier le context binding pour pointer sur le contexte d'un quai donné
          
           // S'inspirer de ce qui a été fait dans la boite de dialogue des UMS en faux camion
          // console.log("Event press UM postes non chargés :" + event.getSource());
          //       let lv_quai:string = "01";
          //       console.log("event onSelectDialogUmFauxCam .getSource().toString()" + event.getSource().toString());
          //       // TODO => Créer un loop sur l'ensemble des quais pour remplir les indices de binding 
          //       if (event.getSource().toString().includes("quai8") === true )  { lv_quai = '0' ;  
          //                                                                        console.log("onSelectDialogUmFauxCam SOURCE BUTTON = QUAI8"); };
          //       if (event.getSource().toString().includes("quai9") === true )  { lv_quai = '1'};
          //       if (event.getSource().toString().includes("quai10") === true ) { lv_quai = '2'};
          //       if (event.getSource().toString().includes("quai11") === true ) { lv_quai = '3'};
          //       if (event.getSource().toString().includes("quai12") === true ) { lv_quai = '4'};
          //       if (event.getSource().toString().includes("quai13") === true ) { lv_quai = '6'};
          //       if (event.getSource().toString().includes("quai14") === true ) { lv_quai = '6'};
          //       if (event.getSource().toString().includes("quai15") === true ) { lv_quai = '7'};
          
          //       let lv_length : number = event.getSource().toString().length;
          //       let postenocharge_indice = event.getSource().toString().charAt(lv_length-1);
          //        console.log("postenocharge_indice" + postenocharge_indice);
          //        this.dialog.setBindingContext(this.getOwnerComponent()?.getModel("chargementModelJson")?.createBindingContext("/results/" + lv_quai + "/tPosteNocharge/" + postenocharge_indice + "/") as Context,"chargementModelJson")
          //        this.dialog.open();





            this.gv_dialog_validation_charg.open();
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
                 // msgStrip.setType(MessageType.Error);
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
              
              let notificationsQuaisModel : JSONModel = this.getOwnerComponent()?.getModel("notificationsQuaisModel") as JSONModel;
              let chargementStartModel : JSONModel = this.getOwnerComponent()?.getModel("ChargementStartModel") as JSONModel;
              let indice_quai : number;
              let indice_json : number;

               indice_quai = Number( key?.slice(4,6));

              
               indice_json = indice_quai - 8;

            //TargetStartChargementQuai10
        
        //----------------------------- Détection de s'il s'agit de si le quai est en cours de chargement ou non ----------------------------------------------                
        console.log("P1 Indice JSON du quai:  " + indice_quai);      
        console.log("P1 valeur du modèle du chargement  " + ChargementQuaiModel.getObject("/results/" + indice_json + "/chargementEncours"));
         let encours : boolean = ChargementQuaiModel.getObject("/results/" + indice_json + "/chargementEncours");
        //----------------------------- Détection de s'il s'agit de si le quai est en cours de chargement ou non -----------------------------------------------
       
         console.log("Key of IconTabBar selected item = " + key );

          if ( encours == true ) 
          {
       
          
           /******************    REINITIALISATION DES MESSAGES ERREUR/WARNING LORS DE CHANGEMENT DE QUAI**************************************** */      
            notificationsQuaisModel.setProperty("/chargementstartnotifs/notifwarning/msg_txt","");   
            notificationsQuaisModel.setProperty("/chargementstartnotifs/notifwarning/visible",false);   
        
            // Relance de la récupération des données de chargement avant la navigation sur le quai
            this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {}); 
            if ( key == "QUAI08" )   {  
              router.getTargets()?.display("TargetChargementQuai08"); }
              //Réinitialisation des messages d'erreurs de de warning (pour ne pas voir les messages qui concernent un autre quai)
             
            if ( key == "QUAI09" )   {  router.getTargets()?.display("TargetChargementQuai09");  }   // Evolution quai 8 et 09
            if ( key == "QUAI10" )  {  router.getTargets()?.display("TargetChargementQuai10");  }
            if ( key == "QUAI11" )  {  router.getTargets()?.display("TargetChargementQuai11");  }
            if ( key == "QUAI12" )  {  router.getTargets()?.display("TargetChargementQuai12");  }
            if ( key == "QUAI13" )  {  router.getTargets()?.display("TargetChargementQuai13");  }
            if ( key == "QUAI14" )  {  router.getTargets()?.display("TargetChargementQuai14");  }
            if ( key == "QUAI15" )  {  router.getTargets()?.display("TargetChargementQuai15");  }

             
          }
               else
               {      
          /******************    REINITIALISATION DU FORMULAIRE DE SAISIE**************************************** */ 
          // Uniquement si on ne clique pas sur le quai actuellement affiché  
                console.log("P1 HIGH gv_current_quai_number:" + this.gv_current_quai_number + " indice_quai:" + indice_quai  );   
                if ( this.gv_current_quai_number != indice_quai )
                {
                      chargementStartModel.setProperty("/results/tknum",""); 
                      chargementStartModel.setProperty("/results/matri",""); 
                }
                   router.getTargets()?.display("TargetStartChargement");
               }
       this.gv_current_quai_number = indice_quai;
    } 

        async onOpenDialogValidCharg(): Promise<void> {
          this.gv_dialog_validation_charg ??= await this.loadFragment({                                // A noter qu'il existe également une méthode sur la classe Fragement pour instantier un fragment
             name: "clf.logistique.chargementquais.view.fragment.DialogValidChargement"
          }) as Dialog;

           // TODO =>  Mettre le modèle de notification en modèle du fragment (ou modèle du dialogue)
           // this.gv_dialog_validation_charg.setModel(this.getOwnerComponent()?.getModel("chargementModelJson"),"chargementModelJson");
         // this.dialog.open();    // TODO => L'ouverture de la boîte de dialogue se fera au moment de la réception de la notification
        }  
    
        onCloseDialog(): void {
          // note: We don't need to chain to the pDialog promise, since this event-handler
          // is only called from within the loaded dialog itself.
        //   (this.byId("busyDialog") as Dialog)?.close();
      } 
      
       public onTestValidationButtonPress(): void {
        
        // let messageValidationChargementModel : JSONModel =  this.getOwnerComponent()?.getModel("messageValidationChargementModel") as JSONModel;
        // let msg_txt =  messageValidationChargementModel.getProperty("/validationchargementmessage");

        //       let data : {validation_msg:String} = {
        //         validation_msg:  msg_txt
                                  
        //       };
        //                    this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);  //Notification fin de chargement"
      } 


public onValidationReject(): void {

  this.gv_dialog_validation_charg.close();
}


}