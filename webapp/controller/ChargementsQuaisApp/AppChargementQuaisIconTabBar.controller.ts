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

  enum application_events_enum {
  chargement_quais_event = "chargementEvent",
  chargement_prevus_event = "chargementListEvent",
  validation_msg_chargement_event = "validationMsgChargementEvent",
   chargement_um_get_event = "ChargementUMGetEvent",
  chargement_um_post_event = "ChargementUmPostEvent",
  chargement_start_get_event = "chargementStartModelGetEvent",
  chargement_end_event = "finChargementEvent",
  notification_websocket_event = "notificationWebSocketEvent",
  validation_dialog_event = "validationDialogEvent",
  changement_quai_event = "changementQuaiEvent",
  }

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

export default class AppChargementQuaisIconTabBar extends Controller {
    private gv_current_quai_number : number;
    private gv_current_quai : string;         //EVOL LOT 17 private gv_current_quai : string
    private gv_dialog_validation_charg: Dialog;
    
    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
  //----------------------------------------------------------------------------------------------------------------------------//
  //               LOT 8/9 : Validation des messages de chargement // Instantiation du fragment du dialogue 
  //----------------------------------------------------------------------------------------------------------------------------//
  this.onOpenDialogValidCharg();
  //---------------------------------------------------------------------------------------------------------------------------------------------------------//
  //               LOT 8/9 : Validation des messages de chargement //Enregistrement de listeners sur les quais => Si message de validation, ouverture d'un popup//
  //---------------------------------------------------------------------------------------------------------------------------------------------------------//
// Mettre les handlers sur les targets de quai
 const router = UIComponent.getRouterFor(this);
// router.getTargets()?.attachDisplay((evt: Targets$DisplayEvent)=>{ console.log("P1 HIGH// TEST de l'attach display de l'ensemble des targets")      }); 
 
 let target_quai08: Target = router.getTarget("targetchargementquai08") as Target;
 let target_quai09: Target = router.getTarget("targetchargementquai09") as Target;
 let target_quai10: Target = router.getTarget("targetchargementquai10") as Target;
 let target_quai11: Target = router.getTarget("targetchargementquai11") as Target;
 let target_quai12: Target = router.getTarget("targetchargementquai12") as Target;
 let target_quai13: Target = router.getTarget("targetchargementquai13") as Target;
 let target_quai14: Target = router.getTarget("targetchargementquai14") as Target;
 let target_quai15: Target = router.getTarget("targetchargementquai15") as Target;
 
 let target_startchargement_quai08: Target = router.getTarget("targetstartchargementquai08") as Target;
 let target_startchargement_quai09: Target = router.getTarget("targetstartchargementquai09") as Target;
 let target_startchargement_quai10: Target = router.getTarget("targetstartchargementquai10") as Target;
 let target_startchargement_quai11: Target = router.getTarget("targetstartchargementquai11") as Target;
 let target_startchargement_quai12: Target = router.getTarget("targetstartchargementquai12") as Target;
 let target_startchargement_quai13: Target = router.getTarget("targetstartchargementquai13") as Target;
 let target_startchargement_quai14: Target = router.getTarget("targetstartchargementquai14") as Target;
 let target_startchargement_quai15: Target = router.getTarget("targetstartchargementquai15") as Target;

target_quai08.attachDisplay(()=>{ 
   this.gv_current_quai = quais_enum.QUAI08;
   this.gv_current_quai_number = 8;                         //LOT 17 => Amélioration robustesse code
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/0/tValidationMsg");
  // La popup ne doit s'afficher que s'il existe des notifications de validation dans le modèle notificationsQuaisModel pour le quai en question
    let data : {quai_number_popup:String} =  { quai_number_popup:   quais_enum.QUAI08};
   this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.changement_quai_event, data);   // EVOLUTION LOT18 Une seule vue pour les quais
  if (t_validation_msg_list.length > 0 ) {  

 
  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.validation_dialog_event, data);
  }
                                });

target_quai09.attachDisplay(()=>{ 
  this.gv_current_quai =  quais_enum.QUAI09;
  this.gv_current_quai_number = 9;                            //LOT 17 => Amélioration robustesse code
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/1/tValidationMsg");
  console.log("ATTACH DISPLAY QUAI09");
   let data : {quai_number_popup:String}  =  { quai_number_popup:   quais_enum.QUAI09};
  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.changement_quai_event, data);   // EVOLUTION LOT18 Une seule vue pour les quais
  if (t_validation_msg_list.length > 0 ) {  
 
  
  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.validation_dialog_event, data);
  }
                                });

target_quai10.attachDisplay(()=>{ 
  this.gv_current_quai_number = 10;                           //LOT 17 => Amélioration robustesse code
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/2/tValidationMsg");
    let data : {quai_number_popup:String} =  { quai_number_popup:   quais_enum.QUAI10};
   this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.changement_quai_event, data);   // EVOLUTION LOT18 Une seule vue pour les quais
  if (t_validation_msg_list.length > 0 ) {  

 
  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.validation_dialog_event, data);
  }
                                });
target_quai11.attachDisplay(()=>{ 
  this.gv_current_quai =  quais_enum.QUAI11;                 //LOT 17 => Amélioration robustesse code
  this.gv_current_quai_number = 11;
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/3/tValidationMsg");

   let data : {quai_number_popup:String} =  { quai_number_popup:   quais_enum.QUAI11};
  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.changement_quai_event, data);   // EVOLUTION LOT18 Une seule vue pour les quais
  if (t_validation_msg_list.length > 0 )      {   
 
  
  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.validation_dialog_event, data);
  }                                               
                            });

target_quai12.attachDisplay(()=>{ 
  this.gv_current_quai =  quais_enum.QUAI12;
  this.gv_current_quai_number = 12;                            //LOT 17 => Amélioration robustesse code
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/4/tValidationMsg");

   let data : {quai_number_popup:String} =  { quai_number_popup:   quais_enum.QUAI12};
    this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.changement_quai_event, data);   // EVOLUTION LOT18 Une seule vue pour les quais
  if (t_validation_msg_list.length > 0 ) {  
 

  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.validation_dialog_event, data);
  }
                                });

target_quai13.attachDisplay(()=>{ 
  this.gv_current_quai =  quais_enum.QUAI13;
  this.gv_current_quai_number = 13;                             //LOT 17 => Amélioration robustesse code
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/5/tValidationMsg");
  let data : {quai_number_popup:String} =  { quai_number_popup:   quais_enum.QUAI13};
    this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.changement_quai_event, data);   // EVOLUTION LOT18 Une seule vue pour les quais
  if (t_validation_msg_list.length > 0 ) {  
  

  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.validation_dialog_event, data);
  }
                                });        
                                
target_quai14.attachDisplay(()=>{ 
  this.gv_current_quai =  quais_enum.QUAI14;
  this.gv_current_quai_number = 14;                           //LOT 17 => Amélioration robustesse code
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/6/tValidationMsg");
  let data : {quai_number_popup:String} =  { quai_number_popup:   quais_enum.QUAI14 };
  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.changement_quai_event, data);   // EVOLUTION LOT18 Une seule vue pour les quais
  if (t_validation_msg_list.length > 0 ) {  
  
  
  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.validation_dialog_event, data);
  }
                                }); 
                                
target_quai15.attachDisplay(()=>{ 
  this.gv_current_quai =  quais_enum.QUAI15;
  this.gv_current_quai_number = 15;                          //LOT 17 => Amélioration robustesse code
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/7/tValidationMsg");
   let data : {quai_number_popup:String} =  { quai_number_popup:   quais_enum.QUAI15};
    this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.changement_quai_event, data);   // EVOLUTION LOT18 Une seule vue pour les quais
  if (t_validation_msg_list.length > 0 ) {  
 

  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.validation_dialog_event, data);
  }
                                });       
                                
   target_startchargement_quai08.attachDisplay(()=>{   this.gv_current_quai =  quais_enum.QUAI08;  this.gv_current_quai_number = 8;  });      //LOT 17 => Amélioration robustesse code
                                                                                                
   target_startchargement_quai09.attachDisplay(()=>{   this.gv_current_quai =  quais_enum.QUAI09;  this.gv_current_quai_number = 9;});        //LOT 17 => Amélioration robustesse code

   target_startchargement_quai10.attachDisplay(()=>{   this.gv_current_quai =  quais_enum.QUAI10;  this.gv_current_quai_number = 10;});       //LOT 17 => Amélioration robustesse code
                                                                                                
   target_startchargement_quai11.attachDisplay(()=>{   this.gv_current_quai =  quais_enum.QUAI11;  this.gv_current_quai_number = 11;});       //LOT 17 => Amélioration robustesse code
                                                                                                
   target_startchargement_quai12.attachDisplay(()=>{   this.gv_current_quai =  quais_enum.QUAI12;  this.gv_current_quai_number = 12;});       //LOT 17 => Amélioration robustesse code
                                                                                                
   target_startchargement_quai13.attachDisplay(()=>{   this.gv_current_quai =  quais_enum.QUAI13;  this.gv_current_quai_number = 13;});       //LOT 17 => Amélioration robustesse code
    
   target_startchargement_quai14.attachDisplay(()=>{   this.gv_current_quai =  quais_enum.QUAI14;  this.gv_current_quai_number = 14;});       //LOT 17 => Amélioration robustesse code 
                                                                                                
   target_startchargement_quai15.attachDisplay(()=>{   this.gv_current_quai =  quais_enum.QUAI15;  this.gv_current_quai_number = 15;});       //LOT 17 => Amélioration robustesse code 

  //----------------------------------------------------------------------------------------------------------------------------//
  //             HANDLER Navigation sur le quai à partir de l'écran des chargements prévus                                                  //  
  //----------------------------------------------------------------------------------------------------------------------------//                                                                                      
      // Enregistrement d'un handler pour le click sur quai dans Chargement List   
    this.getOwnerComponent()?.getEventBus().subscribe("Default","chargementQuaiButtonEvent",(channel:string,event:string,data: Object) => {           
          this.button_chargementquai_handler();  
        },this); 

        
  //----------------------------------------------------------------------------------------------------------------------------//
  //             HANDLER validationDialogEvent  [LOT 8 : Validation des messages de chargement]                                 //  
  //----------------------------------------------------------------------------------------------------------------------------//
    this.getOwnerComponent()?.getEventBus().subscribe("Default",application_events_enum.validation_dialog_event,(channel:string,event:string,data: Object) => {           
      // On reconstitue le numéro de quai à partir du QUAI (QUAI08 ->08, QUAI09->09) // Amélioration posssible fournir le numéro de quai à l'event
      let quai_number: number = Number(Object.values(data)[0].slice(4,6));
      let current_quai_index_json:number=   quai_number - 8 ;
     // console.log("P1 LOT10 Validation des chargements QUAI DE LA NOTIFICATION: " + quai_number + "-QUAI ACTUEL:  " + this.gv_current_quai_number);
       if ( quai_number == this.gv_current_quai_number) 
      {    this.gv_dialog_validation_charg.setBindingContext(this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.createBindingContext("/results/" + current_quai_index_json + "/") as Context,"validationMsgChargementQuaiModelJSON");  
           this.gv_dialog_validation_charg.open();
      }
        },this);


  //----------------------------------------------------------------------------------------------------------------------------//
  //             HANDLER Changement de quai  LOT18 Une seule vue par quai                                                                                     //  
  //----------------------------------------------------------------------------------------------------------------------------//
    this.getOwnerComponent()?.getEventBus().subscribe("Default",application_events_enum.changement_quai_event,(channel:string,event:string,data: Object) => {           
      // On reconstitue le numéro de quai à partir du QUAI (QUAI08->08, QUAI09->09) // Amélioration posssible fournir le numéro de quai à l'event
      let quai_number: number = Number(Object.values(data)[0].slice(4,6));
      let current_quai_index_json:number=   quai_number - 8 ;
         let  IconTabBarControl = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
         let viewQuai: Control[] = IconTabBarControl.getContent();
         console.log("Changement des quais");
          viewQuai[0].setBindingContext(this.getOwnerComponent()?.getModel("chargementModelJson")?.createBindingContext("/results/" + current_quai_index_json + "/") as Context,"chargementModelJson");  
         
         //   /quais/0/   -> Binding sur un quai dans le modèle de notifications
          viewQuai[0].setBindingContext(this.getOwnerComponent()?.getModel("notificationsQuaisModel")?.createBindingContext("/quais/" + current_quai_index_json + "/") as Context,"notificationsQuaisModel");  
      // Attention il faut binder les deux modèles -> Le modèle de chargemetn des quais et le modèle de notification des quais
       //  this.gv_dialog_validation_charg.setBindingContext(this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.createBindingContext("/results/" + current_quai_index_json + "/") as Context,"validationMsgChargementQuaiModelJSON");  
    


        },this);
      

  }


  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  //   Handler clic sur le quai      -> A VERIFIER SI C'EST UTILISE  (serait utilisé pour le lien vers le quai dans l'application 'Chargement prévus" )                     // 
  //  TODO LOT17 -> Il rajouter un test pour vérifier si le quai est cours de chargement ou pas pour pointer sur l'écran de chargement ou l'écran de démarrage de chargement 
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------ //
    public button_chargementquai_handler() : void{ 
       let IconTabBarControl : IconTabBar;
       IconTabBarControl = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
       let selectedKeyQuaiNumber : string  =  IconTabBarControl.getSelectedKey();
      const router = UIComponent.getRouterFor(this);
           if ( selectedKeyQuaiNumber == "" )                  {  router.getTargets()?.display("targetchargementquai08");  }   // Evolution quai 8 et 09
           if ( selectedKeyQuaiNumber ==  quais_enum.QUAI08 )  {  router.getTargets()?.display("targetchargementquai08");  }   // Evolution quai 8 et 09s
           if ( selectedKeyQuaiNumber ==  quais_enum.QUAI09 )  {  router.getTargets()?.display("targetchargementquai09");  }
           if ( selectedKeyQuaiNumber ==  quais_enum.QUAI10 )  {  router.getTargets()?.display("targetchargementquai10");  }
           if ( selectedKeyQuaiNumber ==  quais_enum.QUAI11 )  {  router.getTargets()?.display("targetchargementquai11");  }
           if ( selectedKeyQuaiNumber ==  quais_enum.QUAI12 )  {  router.getTargets()?.display("targetchargementquai12");  }
           if ( selectedKeyQuaiNumber ==  quais_enum.QUAI13 )  {  router.getTargets()?.display("targetchargementquai13");  }
           if ( selectedKeyQuaiNumber ==  quais_enum.QUAI14 )  {  router.getTargets()?.display("targetchargementquai14");  }
           if ( selectedKeyQuaiNumber ==  quais_enum.QUAI15 )  {  router.getTargets()?.display("targetchargementquai15");  }
        }




//----------------------------------------------------------------------------------------------------------------------------//
//               Handler clic sur le quai  (Pour synchroniser le routing avec le quai sélectionné)                            //  
//----------------------------------------------------------------------------------------------------------------------------//
    public onAfterRendering(): void {
      // Ce code pour synchroniser le selected key avec le routing a été retiré momentanaément
    let IconTabBarControl : IconTabBar;       
    IconTabBarControl = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
    IconTabBarControl.setSelectedKey(this.gv_current_quai);
     }
//----------------------------------------------------------------------------------------------------------------------------//
//               Handler de sélection d'un onglet de l'IConTabBar                                                             //  
//----------------------------------------------------------------------------------------------------------------------------//
    public onTabSelect(event: IconTabBar$SelectEvent): void {
      // Récupération de l'identififant de l'onglet sélectionné
      let iconTabBarkey = event.getParameter("key");            //LOT 17 let iconTabBarkey:string -> undefined rajouté
      const router = UIComponent.getRouterFor(this);
      // Récupération des modèles json nécessaires
      let ChargementQuaiModel     : JSONModel = this.getOwnerComponent()?.getModel("chargementModelJson")     as JSONModel;
      let notificationsQuaisModel : JSONModel = this.getOwnerComponent()?.getModel("notificationsQuaisModel") as JSONModel;
      let chargementStartModel    : JSONModel = this.getOwnerComponent()?.getModel("ChargementStartModel")    as JSONModel;
      // Calcul des indices et indice json du quai sélectionné
      
      let indice_quai : number= Number( iconTabBarkey?.slice(4,6));
      let indice_json : number; indice_json = indice_quai - 8;
      // Stockage du quai actuellement sélectionné en global dans le contrôlleur

    //----------------------------- Détection de s'il s'agit de si le quai est en cours de chargement ou non ----------------------------------------------                
      let encours : boolean = ChargementQuaiModel.getObject("/results/" + indice_json + "/chargementEncours");
          if ( encours == true ) 
          {
           /******************    REINITIALISATION DES MESSAGES ERREUR/WARNING LORS DE CHANGEMENT DE QUAI**************************************** */      
            notificationsQuaisModel.setProperty("/chargementstartnotifs/notifwarning/msg_txt","");   
            notificationsQuaisModel.setProperty("/chargementstartnotifs/notifwarning/visible",false);   
            // Relance de la récupération des données de chargement avant la navigation sur le quai
            this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {}); 
            if ( iconTabBarkey ==  quais_enum.QUAI08 )  {  router.getTargets()?.display("targetchargementquai08"); }
            if ( iconTabBarkey ==  quais_enum.QUAI09 )  {  router.getTargets()?.display("targetchargementquai09");  }   // Evolution quai 8 et 09
            if ( iconTabBarkey ==  quais_enum.QUAI10 )  {  router.getTargets()?.display("targetchargementquai10");  }
            if ( iconTabBarkey ==  quais_enum.QUAI11 )  {  router.getTargets()?.display("targetchargementquai11");  }
            if ( iconTabBarkey ==  quais_enum.QUAI12 )  {  router.getTargets()?.display("targetchargementquai12");  }
            if ( iconTabBarkey ==  quais_enum.QUAI13 )  {  router.getTargets()?.display("targetchargementquai13");  }
            if ( iconTabBarkey ==  quais_enum.QUAI14 )  {  router.getTargets()?.display("targetchargementquai14");  }
            if ( iconTabBarkey ==  quais_enum.QUAI15 )  {  router.getTargets()?.display("targetchargementquai15");  }
          }
          else   //Si aucun chargement en cours sur le quai alors on affiche un formulaire de lancement de chargement
          {      
          //  REINITIALISATION DU FORMULAIRE DE SAISIE Uniquement si on ne clique pas sur le quai actuellement affiché  
            if ( this.gv_current_quai_number != indice_quai )
            {
            chargementStartModel.setProperty("/results/tknum",""); 
            chargementStartModel.setProperty("/results/matri",""); 
            notificationsQuaisModel.setProperty("/chargementstartnotifs/notiferror/msg_txt",""); 
            notificationsQuaisModel.setProperty("/chargementstartnotifs/notiferror/visible",false); 
            }
            // Evolution Anomalie Synchroniszation routing et selected key   
            if ( iconTabBarkey == quais_enum.QUAI08 )  {  router.getTargets()?.display("targetstartchargementquai08"); }
            if ( iconTabBarkey == quais_enum.QUAI09 )  {  router.getTargets()?.display("targetstartchargementquai09");  }   // Evolution quai 8 et 09
            if ( iconTabBarkey == quais_enum.QUAI10  ) {  router.getTargets()?.display("targetstartchargementquai10");  }
            if ( iconTabBarkey == quais_enum.QUAI11 )  {  router.getTargets()?.display("targetstartchargementquai11");  }
            if ( iconTabBarkey == quais_enum.QUAI12 )  {  router.getTargets()?.display("targetstartchargementquai12");  }
            if ( iconTabBarkey == quais_enum.QUAI13 )  {  router.getTargets()?.display("targetstartchargementquai13");  }
            if ( iconTabBarkey == quais_enum.QUAI14 )  {  router.getTargets()?.display("targetstartchargementquai14");  }
            if ( iconTabBarkey == quais_enum.QUAI15  ) {  router.getTargets()?.display("targetstartchargementquai15");  }
          }
            this.gv_current_quai_number = indice_quai;
            this.gv_current_quai = iconTabBarkey ?? 'QUAI08';              // LOT 17 Review/Amélioration code -> Enregistement du nom du quai
    } 

  async onOpenDialogValidCharg(): Promise<void> {
    this.gv_dialog_validation_charg ??= await this.loadFragment({                                // A noter qu'il existe également une méthode sur la classe Fragement pour instantier un fragment
        name: "clf.logistique.chargementquais.view.fragment.DialogValidChargement"
    }) as Dialog;
    this.gv_dialog_validation_charg.setModel(this.getOwnerComponent()?.getModel("notificationsQuaisModel"),"notificationsQuaisModel");
  }  
      
  public onValidationClose(): void {
    this.gv_dialog_validation_charg.close();
  }

 public onConfirmValidationMsgChargement(event:Button$PressEvent):void {
  // Récupération du modèle de notifications des quais (Messages de validation par quai)
  let validationMsgChargementQuaiModel : JSONModel = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON") as JSONModel;
  
  let source_string:string                 = event.getSource().toString();                // Pour récupérer l'indice de message de validation(Warning ou choice) , l'élément source du handler utilisé (Autre possibilité -> Utiliser event->GetParameter())
  let current_indicejson_quai :number      = this.gv_current_quai_number - 8;             // Calcul de l'indice json du quai (quai number-8)
  let indice_validationmsg_string : string = source_string.at(source_string.length-1)!;   // Récupération de l'indice du message de Validation 
  //----------------------------------------------------------------------------------------------------------------------------------------------------//
  //------------------- LOT8/9 Validation des messages de Warning-> Récupérer le contexte de la validation (QUAI/UM/Checknumber)------------------------//
  //----------------------------------------------------------------------------------------------------------------------------------------------------//
  let validation_msg_codum : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/exidv") ;
  let validation_msg_msgid : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/msgId") ;
  let validation_msg_aenam : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/aenam") ;
  let validation_msg_errdt : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/errdt") ;
  let validation_msg_errzt : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/errzt") ;
  // Détection de si l'utilisateur a cliqué sur Ok ou Refuser (ne concerne que les Validations de types Choice)
  let lv_choice:string='';
  if  (event.getSource().getId().includes("ButtonOK"))     {   lv_choice = 'X' ;}
  if  (event.getSource().getId().includes("ButtonReject")) {   lv_choice = '';}
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------Envoi d'un évènement au controlleur pour appel de l'API de Chargement de l'UM-------------------------------------------------------------------------------------------------- 
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  let lv_quai= this.gv_current_quai;
// LOT15 BEGIN 
    let data : {quai:string|undefined, codum :string, msgid:string, aenam:string, errdt:string, errzt :string, choice:string} =
     { quai: lv_quai, codum : validation_msg_codum,  msgid: validation_msg_msgid, aenam : validation_msg_aenam, errdt: validation_msg_errdt, errzt: validation_msg_errzt, choice : lv_choice}
    this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.chargement_um_post_event, data);
// LOT Scan Manuel Anomalie rescan après validation BEGIN
   let data2 : {quai:string|undefined} = { quai:  lv_quai } 
   this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.chargement_um_get_event,  data2);
// LOT Scan Manuel Anomalie rescan après validation END
 }

}