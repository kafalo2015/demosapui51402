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
import Context from "sap/ui/model/Context";
import { Targets$DisplayEvent } from "sap/ui/core/routing/Targets";
import Target from "sap/ui/core/routing/Target";
import { Button$PressEvent } from "sap/m/Button";

/**
 * @namespace clf.logistique.chargementquais.controller
 */
export default class AppChargementQuaisIconTabBar extends Controller {
    private gv_current_quai_number : number;
    private gv_dialog_validation_charg: Dialog;
    
    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
  //----------------------------------------------------------------------------------------------------------------------------//
  //               LOT 8 : Validation des messages de chargement // Instantiation du fragment du dialogue 
  //                                                                et enregistrement de listener sur les routes de quais        //  
  //----------------------------------------------------------------------------------------------------------------------------//

  //----------------------------------------------------------------------------------------------------------------------------//
  //               LOT 8/9 : Validation des messages de chargement // Instantiation du fragment du dialogue 
  //----------------------------------------------------------------------------------------------------------------------------//
  this.onOpenDialogValidCharg();

  //---------------------------------------------------------------------------------------------------------------------------------------------------------//
  //               LOT 8/9 : Validation des messages de chargement //Enregistrement de listeners sur les quais => Si message de validation, ouverture d'un popup//
  //---------------------------------------------------------------------------------------------------------------------------------------------------------//
// Mettre les handlers sur les targets de quai
 const router = UIComponent.getRouterFor(this);
 //router.getTarget?(["TargetChargementQuai08","TargetChargementQuai09","TargetChargementQuai10", "TargetChargementQuai11","TargetChargementQuai12","TargetChargementQuai13","TargetChargementQuai14","TargetChargementQuai15"])
 router.getTargets()?.attachDisplay((evt: Targets$DisplayEvent)=>{ console.log("P1 HIGH// TEST de l'attach display de l'ensemble des targets")      }); 
 
 let target_quai08: Target = router.getTarget("TargetChargementQuai08") as Target;
 let target_quai09: Target = router.getTarget("TargetChargementQuai09") as Target;
 let target_quai10: Target = router.getTarget("TargetChargementQuai10") as Target;
 let target_quai11: Target = router.getTarget("TargetChargementQuai11") as Target;
 let target_quai12: Target = router.getTarget("TargetChargementQuai12") as Target;
 let target_quai13: Target = router.getTarget("TargetChargementQuai13") as Target;
 let target_quai14: Target = router.getTarget("TargetChargementQuai14") as Target;
 let target_quai15: Target = router.getTarget("TargetChargementQuai15") as Target;

target_quai08.attachDisplay(()=>{ 
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("notificationsQuaisModel")?.getProperty("/quais/0/validation_msg_list");
  // La popup ne doit s'afficher que s'il existe des notifications de validation dans le modèle notificationsQuaisModel pour le quai en question
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String, notification_websocket : Boolean} =  { quai_number_popup:  "QUAI08",  notification_websocket : false };
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                });

target_quai09.attachDisplay(()=>{ 
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("notificationsQuaisModel")?.getProperty("/quais/1/validation_msg_list");
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String, notification_websocket : Boolean}  =  { quai_number_popup:  "QUAI09",  notification_websocket : false };
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                });

target_quai10.attachDisplay(()=>{ 
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("notificationsQuaisModel")?.getProperty("/quais/2/validation_msg_list");
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String,notification_websocket : Boolean} =  { quai_number_popup:  "QUAI10",  notification_websocket : false };
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                });
target_quai11.attachDisplay(()=>{ 
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("notificationsQuaisModel")?.getProperty("/quais/3/validation_msg_list");
  if (t_validation_msg_list.length > 0 )      {   
  let data : {quai_number_popup:String,notification_websocket : Boolean} =  { quai_number_popup:  "QUAI11",  notification_websocket : false };
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }                                               
                            });


target_quai12.attachDisplay(()=>{ 
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("notificationsQuaisModel")?.getProperty("/quais/4/validation_msg_list");
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String,notification_websocket : Boolean} =  { quai_number_popup:  "QUAI12",  notification_websocket : false };
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                });


target_quai13.attachDisplay(()=>{ 
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("notificationsQuaisModel")?.getProperty("/quais/5/validation_msg_list");
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String, notification_websocket : Boolean} =  { quai_number_popup:  "QUAI13",  notification_websocket : false };
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                });        
                                
target_quai14.attachDisplay(()=>{ 
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("notificationsQuaisModel")?.getProperty("/quais/6/validation_msg_list");
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String,notification_websocket : Boolean} =  { quai_number_popup:  "QUAI14",  notification_websocket : false };
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                }); 
                                
target_quai15.attachDisplay(()=>{ 
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("notificationsQuaisModel")?.getProperty("/quais/7/validation_msg_list");
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String,notification_websocket : Boolean} =  { quai_number_popup:  "QUAI15",  notification_websocket : false };
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                });                                 

  // let panelMessage : Panel = this.byId("PanelMessageAppChargementQuais") as Panel;   // TODO=>Mettre le numéro de quai en dynamique
          // Enregistrement d'un handler pour le click sur quai dans Chargement List   
        this.getOwnerComponent()?.getEventBus().subscribe("Default","chargementQuaiButtonEvent",(channel:string,event:string,data: Object) => {           
              this.button_chargementquai_handler();  
            },this); 

     //----------------------------------------------------------------------------------------------------------------------------//
     //             HANDLER validationDialogEvent  [LOT 8 : Validation des messages de chargement]                                 //  
     //----------------------------------------------------------------------------------------------------------------------------//
      this.getOwnerComponent()?.getEventBus().subscribe("Default","validationDialogEvent",(channel:string,event:string,data: Object) => {           

      let current_quai_index_json:number;
      let notification_websocket: Boolean = Object.values(data)[1];
      let quai_number_popupdisplay: string = Object.values(data)[0];
      let quai_number_popupdisplay_number: number = Number(quai_number_popupdisplay.slice(4,6));

      console.log("P1 HIGH POPUP VALIDATION COMPARAISON ENTRE LA VALEUR DU QUAI AFFICHE: " + this.gv_current_quai_number + "et la valeur du quai sur lequel il ya une notification: " + quai_number_popupdisplay_number);
      if ((notification_websocket == false) || (notification_websocket == true && quai_number_popupdisplay_number == this.gv_current_quai_number))   //=> TODO Commenter cette condition (A revoir websocket == false est peut être inutile)
                                                                                                                                                     //(Deux  cas : Affichage du popup en cas de changement de quai/en cas de réception de notification )
      {
          current_quai_index_json =   quai_number_popupdisplay_number - 8 ;
          console.log("P1 HIGH Validation Dialog Event--- Valeur du quai:   " + Object.values(data)[0] + "Valeur de l'indice du quai: " + current_quai_index_json);
           this.gv_dialog_validation_charg.setBindingContext(this.getOwnerComponent()?.getModel("notificationsQuaisModel")?.createBindingContext("/quais/" + current_quai_index_json + "/") as Context,"notificationsQuaisModel");  
           this.gv_dialog_validation_charg.open();
      }
        },this);
      
      }

     //----------------------------------------------------------------------------------------------------------------------------//
     //               Affichage des notifications d'Erreur/Warning ou Succes dans les messages Strip du quaui  => METHODE OBSOLETE                                                                                   //  
     //----------------------------------------------------------------------------------------------------------------------------// 
    public notification_handler(type_msg:string, msg_txt: string,transport:string, um: String, current_quai: string, action :string, user:string ) : void{ 
        //   let IconTabBarControl : IconTabBar = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
        //   let message_chargementum_ok :string;
        //   // Panel d'affichage des messages  
        //   let panelMessage : Panel = this.byId("PanelMessageAppChargementQuais") as Panel;   // TODO=>Mettre le numéro de quai en dynamique
        //   //let panelMessageQuai : Panel;
        //   // Message Strip au niveau des vues de quai
        //   let messageStrip_ref : MessageStrip;
        //   let messageStripErrorQuai : MessageStrip;
        //   let messageStripWarningQuai : MessageStrip;
        //   let messageStripInformationQuai : MessageStrip;
          
        //   console.log("------------------ AppChargementQuaisIconTabBar.controller/NOTIFICATION HANDLER -----------------------------------------------------------------------------------------------------");
        //   console.log("P1 Quai de la notification : " +  current_quai.toLowerCase() + " Quai affiché dans l'IconTabBar: " + IconTabBarControl.getSelectedKey());
        // // Si la page courante correspond au quai de la notification alors on recharge (on teste le quai 10 dans un premier temps)
        // // if ( IconTabBarControl.getSelectedKey() == current_quai){                 //TODO=>Evol LOT 4 : Ce test n''est pas nécessaire les messages strip
        //                                                                            // doivent se mettre à jour meême si on ne se trouve pas sur le quai concerné
        //                                                                            // par la notificaiotn
        //        let tcontent : View[] = IconTabBarControl.getContent() as View[];
        //        let tcontent_views : Control[]
        //        tcontent.forEach((content) => {
        //        tcontent_views = content.getContent() as Control[];
        //         tcontent_views.forEach((control) => {
        //         // code pour remplir le  messageStrip d'erreur et le messageStrip d'information du quai 
        //             console.log(control.getId());
        //           if ( control.getId() == "container-clf.logistique.chargementquais---" + current_quai.toLowerCase() + "--messageStripError" )
        //           {
        //             messageStripErrorQuai = control as MessageStrip;
              
        //            if ( type_msg == 'E' ){
        //             messageStripErrorQuai.setText(msg_txt); 
        //             messageStripErrorQuai.setVisible(true); 
        //             } 
        //           if  ( type_msg == 'W' ) {messageStripErrorQuai.setVisible(false);     }
        //           if  ( type_msg == 'information' ) {messageStripErrorQuai.setVisible(false);     }
        //           } 

        //           if ( control.getId() == "container-clf.logistique.chargementquais---" + current_quai.toLowerCase() + "--messageStripWarning" )
        //           {
        //             messageStripWarningQuai = control as MessageStrip;
        //            // if ( type_msg == 'error' ){

        //            if ( type_msg == 'W' ){
        //              messageStripWarningQuai.setText(msg_txt); 
        //              messageStripWarningQuai.setVisible(true); 
        //             } 
        //           if  ( type_msg == 'E' ) { messageStripWarningQuai.setVisible(false);     }
        //           if  ( type_msg == 'information' ) { messageStripWarningQuai.setVisible(false);     }
        //           }  

        //             if (  control.getId() == "container-clf.logistique.chargementquais---" + current_quai.toLowerCase() + "--messageStripInformation" )
        //             {
        //               messageStripInformationQuai = control as MessageStrip;
        //               if ( type_msg == 'information' )
        //               {
        //               messageStripInformationQuai.setText(msg_txt); 
        //               messageStripInformationQuai.setVisible(true); 
        //               }
        //               if ( type_msg == 'E' ){  messageStripInformationQuai.setVisible(false);     }
        //               if ( type_msg == 'W' ){  messageStripInformationQuai.setVisible(false);   }
        //             }
        //         })
        //       })
        //       // LOT 4 : Chargement des quais  => Code erroné à changer
        //       // Si le quai affiché est concerné par la notification et le message est de type information alors on affiche un Toast et on rafraichit le quai 
        //       //if ( type_msg == 'information' )  //if ( IconTabBarControl.getSelectedKey() == current_quai){
        //        // {
        //         //  MessageToast.show(msg_txt);
        //          // this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {}); 
        //        // }
        //        // LOT 4 : Chargement des quais  => Code erroné à changer
        // //}
        //         // LOT 4 : Chargement des quais 
        //       // Si le quai affiché est concerné par la notification et le message est de type information alors on affiche un Toast et on rafraichit le quai 
        //       if ((action == 'chargement') && (type_msg == 'information' ) ) // TODO => && ( IconTabBarControl.getSelectedKey() == current_quai
        //         {
        //           MessageToast.show(msg_txt);
        //           this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {}); 
        //           this.getOwnerComponent()?.getEventBus().publish("Default", "chargementListEvent", {}); "Rechargement de la liste des chargements prévus"
        //         }
        //        // LOT 4 : Chargement des quais  =  

        //        // Affichage de tous les messages (Information et Erreur) relatifs à l'ensemble des quais
        //         messageStrip_ref = new MessageStrip();
        //         messageStrip_ref.setText(msg_txt);       // Correctif++ 14/08/2025 Correctifs notifications
        //                                                  // Toujours afficher le message dans  la zone Messages quel que soit le type de message (E, W ou S)
        //          // msgStrip.setType(MessageType.Error);
        //          messageStrip_ref.setShowIcon(true);
        //          messageStrip_ref.setShowCloseButton(true);  
        //          console.log("P1 AJOUT d'un message dans la zone MEssages multi quai");
        //          panelMessage.addAggregation("content",messageStrip_ref);

        //          // TODO Notification fin de chargement 
        //          //Si l'action est fin de chargement alors il faut recharger le chargement des quais quel que soit le quai affiché
        //          // Modification LOT 4 'Lancement début de chargementnt'
        //          //if ( action = 'finchargement' )
        //          if ( action == 'finchargement'  ||  action == 'startchargement')
        //          {
        //          console.log("Notification de fin de chargement");
        //          MessageToast.show(msg_txt);
        //          this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {});  //Notification fin de chargement"
        //          }
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
//               Handler de sélection d'un onglet de l'IConTabBar                                                       //  
//----------------------------------------------------------------------------------------------------------------------------//
    public onTabSelect(event: IconTabBar$SelectEvent): void {
          // Récupération de l'identififant de l'onglet sélectionné
          let key = event.getParameter("key");
          const router = UIComponent.getRouterFor(this);
          // Récupération des modèles json nécessaires
          let ChargementQuaiModel : JSONModel = this.getOwnerComponent()?.getModel("chargementModelJson") as JSONModel;
          let notificationsQuaisModel : JSONModel = this.getOwnerComponent()?.getModel("notificationsQuaisModel") as JSONModel;
          let chargementStartModel : JSONModel = this.getOwnerComponent()?.getModel("ChargementStartModel") as JSONModel;
          // Calcul des indices et indice json du quai sélectionné
          let indice_quai : number;
          let indice_json : number;
          indice_quai = Number( key?.slice(4,6));
          indice_json = indice_quai - 8;
          // Stockage du quai actuellement sélectionné en global dans le contrôlleur
          this.gv_current_quai_number = indice_quai;

        //----------------------------- Détection de s'il s'agit de si le quai est en cours de chargement ou non ----------------------------------------------                
         let encours : boolean = ChargementQuaiModel.getObject("/results/" + indice_json + "/chargementEncours");
          if ( encours == true ) 
          {
           /******************    REINITIALISATION DES MESSAGES ERREUR/WARNING LORS DE CHANGEMENT DE QUAI**************************************** */      
            notificationsQuaisModel.setProperty("/chargementstartnotifs/notifwarning/msg_txt","");   
            notificationsQuaisModel.setProperty("/chargementstartnotifs/notifwarning/visible",false);   
        
            // Relance de la récupération des données de chargement avant la navigation sur le quai
            this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {}); 
            if ( key == "QUAI08" )  {  router.getTargets()?.display("TargetChargementQuai08"); }
            if ( key == "QUAI09" )  {  router.getTargets()?.display("TargetChargementQuai09");  }   // Evolution quai 8 et 09
            if ( key == "QUAI10" )  {  router.getTargets()?.display("TargetChargementQuai10");  }
            if ( key == "QUAI11" )  {  router.getTargets()?.display("TargetChargementQuai11");  }
            if ( key == "QUAI12" )  {  router.getTargets()?.display("TargetChargementQuai12");  }
            if ( key == "QUAI13" )  {  router.getTargets()?.display("TargetChargementQuai13");  }
            if ( key == "QUAI14" )  {  router.getTargets()?.display("TargetChargementQuai14");  }
            if ( key == "QUAI15" )  {  router.getTargets()?.display("TargetChargementQuai15");  }
          }
          else   //Si aucun chargement en cours sur le quai alors on affiche un formulaire de lancement de chargement
          {      
          //  REINITIALISATION DU FORMULAIRE DE SAISIE Uniquement si on ne clique pas sur le quai actuellement affiché  
            if ( this.gv_current_quai_number != indice_quai )
            {
                  chargementStartModel.setProperty("/results/tknum",""); 
                  chargementStartModel.setProperty("/results/matri",""); 
            }
                router.getTargets()?.display("TargetStartChargement");
          }
      // this.gv_current_quai_number = indice_quai;
    } 

        async onOpenDialogValidCharg(): Promise<void> {
          this.gv_dialog_validation_charg ??= await this.loadFragment({                                // A noter qu'il existe également une méthode sur la classe Fragement pour instantier un fragment
             name: "clf.logistique.chargementquais.view.fragment.DialogValidChargement"
          }) as Dialog;
           //console.log("P1 HIGH Initialisation de la variable de dialog :" + this.gv_dialog_validation_charg);
            this.gv_dialog_validation_charg.setModel(this.getOwnerComponent()?.getModel("notificationsQuaisModel"),"notificationsQuaisModel");
        }  
      
    public onValidationClose(): void {
      this.gv_dialog_validation_charg.close();
    }

 public onConfirmValidationMsgChargement(event:Button$PressEvent):void {
    console.log("------------------------------------------------------P1 HIGH LOT9 onConfirmValidationMsgChargement Handler: -------------------------------------------------");
    let validation_msg_indicejson:string;
    // Récupération du modèle de notifications des quais (Messages de validation par quai)
    let notificationsQuaisModel : JSONModel = this.getOwnerComponent()?.getModel("notificationsQuaisModel") as JSONModel;
    
    let source_string:string = event.getSource().toString();                             // Pour récupérer l'indice de message de warning , l'élément source du handler utilisé (Autre possibilité -> Utiliser event->GetParameter())
    let current_indicejson_quai :number =  this.gv_current_quai_number - 8;              // Calcul de l'indice json du quai (quai number-8)
    let indice_warningmsg_string : string = source_string.at(source_string.length-1)!;   // Récupération de l'indice du message de Warning
    //----------------------------------------------------------------------------------------------------------------------------------------------------//
    //------------------- LOT8/9 Validation des messages de Warning-> Récupérer le contexte de la validation (QUAI/UM/Checknumber)------------------------//
    //----------------------------------------------------------------------------------------------------------------------------------------------------//
  let validation_msg_codum : string       = notificationsQuaisModel.getProperty("/quais/" + current_indicejson_quai + "/validation_msg_list/" + indice_warningmsg_string + "/codum") ;
  let validation_msg_checkid : string     = notificationsQuaisModel.getProperty("/quais/" + current_indicejson_quai + "/validation_msg_list/" + indice_warningmsg_string + "/checkid") ;
  let validation_msg_checknumber : number = notificationsQuaisModel.getProperty("/quais/" + current_indicejson_quai + "/validation_msg_list/" + indice_warningmsg_string + "/checknumber") ;
  console.log("P1 HIGH LOT9 Récupération du contexte du message de Warning// codum : " +  validation_msg_codum + "-checknumber: " + validation_msg_checknumber + "-checkid: " + validation_msg_checkid);
  console.log("P1 HIGH LOT9 VALIDATION/REFUSER dans boîte de dialogue de validation: " +   event.getSource().getId());
  console.log("P1 HIGH LOT9 VALIDATION/REFUSER dans boîte de dialogue de validation event.getParameters() : " +   event.getParameters());
  // Détection de si l'utilisateur a cliqué sur Ok ou Refuser (ne concerne que les Validations de types Choice)
  let lv_choice:string='';
  if  (event.getSource().getId().includes("ButtonOK"))     {   lv_choice = 'X' ;}
  if  (event.getSource().getId().includes("ButtonReject")) {   lv_choice = '';}
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------Envoi d'un évènement au controlleur pour appel de l'API de Chargement de l'UM-------------------------------------------------------------------------------------------------- 
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    let data : {quai:number, codum :string, checknumber :number, choice:string, checkid:string,sourcestring:string} = { quai: this.gv_current_quai_number, codum : validation_msg_codum,  checknumber : validation_msg_checknumber, choice: lv_choice, checkid: validation_msg_checkid, sourcestring : source_string}
    this.getOwnerComponent()?.getEventBus().publish("Default", "ValidationWarningUMEvent", data);
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //------------------- TODO LOT9  Validation des messages de Warning->Mettre le code de suppression du Warning de la promise de l'API POST--------------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    // let validation_msg_list : Object[] = notificationsQuaisModel.getProperty("/quais/" + current_indicejson_quai + "/validation_msg_list") ;
    // //  validation_msg_list.push({validationtxt: msg_txt})
    // validation_msg_list.splice(Number(source_string.at(source_string.length-1)),1);       // Essai de suppression du premier élément => TODO récupérer l'indice du message à supprimer
    // notificationsQuaisModel.setProperty("/quais/" + this.gv_current_quai_number + "/validation_msg_list", validation_msg_list);
    // notificationsQuaisModel.refresh();
 }
}