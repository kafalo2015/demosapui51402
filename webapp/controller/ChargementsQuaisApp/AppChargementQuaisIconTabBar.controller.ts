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
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import NavContainer from "sap/m/NavContainer";
import Router from "sap/ui/core/routing/Router";

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

        router.getRoute("RouteChargementQuai")!.attachPatternMatched(this.onObjectMatched, this);
  //let target_startchargement_quai_all: Target = router.getTarget("targetstartchargementquaiall") as Target;

//target_quai_all.attachDisplay((evt)=>{ 
//TODO LOT 18 -> Remettre la logique d'ouverture de la boîte de dialogeu de validation des messages de chargement

  //  this.gv_current_quai = quais_enum.QUAI08;
  //  this.gv_current_quai_number = 8;                         //LOT 17 => Amélioration robustesse code
  // let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/0/tValidationMsg");
  // // La popup ne doit s'afficher que s'il existe des notifications de validation dans le modèle notificationsQuaisModel pour le quai en question
  //   let data : {quai_number_popup:String} =  { quai_number_popup:   quais_enum.QUAI08};
  //  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.changement_quai_event, data);   // EVOLUTION LOT18 Une seule vue pour les quais
  // if (t_validation_msg_list.length > 0 ) {  
  // this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.validation_dialog_event, data);
  // //}
  //    let lv_data : object | undefined = evt.getParameter("data");
  //     //TODO LOT18 Rajouter le code pour l'ouverture de la boîte de dialogue de validation des chargements
    
        // let data_json_string  : any = evt.getParameter("data");
        //let data_object : {quaiid:string} = JSON.parse(data_json_string);   
        // this.gv_current_quai = data_json_string.quaiid ;
        // console.log("P1 LOT 18 Valeur de l'argument quai dans attachDisplay = "  +  data_json_string.quaiid );

          // let params = evt.getParameters();
          //   let content : any = params.data;
          //   let content_json : {quaiid:string} = JSON.parse(content);   
            //  let data : {type_msg:String, msg_txt:String,transport:String, um:String, quai:String,action:String,user:string, time : Date, checkid:string} = {
            //     type_msg: content_json.type_msg,
            //     msg_txt: content_json.msg_txt,
            //     transport: content_json.um,
            //     um: content_json.um, 
            //     quai: content_json.quai,
            //     action: content_json.action,
            //     user: content_json.user,
            //     time: content_json.time,
            //     checkid:  content_json.checkid                   
            //   };

      // let data_event_publish : {quai_number_popup:string} =  { quai_number_popup:    data_json_string.quaiid};
       
        // this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.changement_quai_event, data_event_publish);   // EVOLUTION LOT18 Une seule vue pour les quai
                              //  });

   // LOT 18 END -> Simplification du routing (une seule route et une seule target pour l'ensemble des quais)
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
    // this.getOwnerComponent()?.getEventBus().subscribe("Default",application_events_enum.changement_quai_event,(channel:string,event:string,data: Object) => {           
    //   // On reconstitue le numéro de quai à partir du QUAI (QUAI08->08, QUAI09->09) // Amélioration posssible fournir le numéro de quai à l'event
    //   let quai_number: number = Number(Object.values(data)[0].slice(4,6));
    //   let current_quai_index_json:number=   quai_number - 8 ;
    //      let  IconTabBarControl = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
    //      let viewQuai: Control[] = IconTabBarControl.getContent();
    //      console.log("Changement des quais");
    //       viewQuai[0].setBindingContext(this.getOwnerComponent()?.getModel("chargementModelJson")?.createBindingContext("/results/" + current_quai_index_json + "/") as Context,"chargementModelJson");  
         
    //      //   /quais/0/   -> Binding sur un quai dans le modèle de notifications
    //       viewQuai[0].setBindingContext(this.getOwnerComponent()?.getModel("notificationsQuaisModel")?.createBindingContext("/quais/" + current_quai_index_json + "/") as Context,"notificationsQuaisModel");  
    //   // Attention il faut binder les deux modèles -> Le modèle de chargemetn des quais et le modèle de notification des quais
    //    //  this.gv_dialog_validation_charg.setBindingContext(this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.createBindingContext("/results/" + current_quai_index_json + "/") as Context,"validationMsgChargementQuaiModelJSON");  
    //     },this);
  }
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  //   Handler clic sur le quai      -> A VERIFIER SI C'EST UTILISE  (serait utilisé pour le lien vers le quai dans l'application 'Chargement prévus" )                     // 
  //  TODO LOT17 -> Il rajouter un test pour vérifier si le quai est cours de chargement ou pas pour pointer sur l'écran de chargement ou l'écran de démarrage de chargement 
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------ //
    public button_chargementquai_handler() : void{ 
       let IconTabBarControl : IconTabBar;
       IconTabBarControl = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
       let selectedKeyQuaiNumber : string  =  IconTabBarControl.getSelectedKey();

       let quai_number : number= Number( selectedKeyQuaiNumber?.slice(4,6));
      const router = UIComponent.getRouterFor(this);

      // LOT 18 BEGIN Simplification routing [Uilisation de navTo au lieu  target display]
             router.navTo("RouteChargementQuai", {quainumber: quai_number});    // Evolution quai 8 et 09s
           
        // LOT 18 BEGIN Simplification routing [Uilisation de navTo au lieu  target display]
          }

//LOT 18 SIMPLIFICATION ROUTING BEGIN
   onObjectMatched(event: Route$PatternMatchedEvent): void {

//TODO LOT18 -> Soit faire le binding avec bindelement soit appeleer l'event chargement quai qui fait le binding
const lv_quainumber = window.decodeURIComponent( (event.getParameter("arguments") as any).quainumber)    //TODO LOT18 A quoi sert le decodeURIComponent
console.log("P1 LOT18 Route ChargementQuais matched - Récupération du paramètre quaiid =" +  lv_quainumber );
let lv_quai = "QUAI" + lv_quainumber
    let data_event_publish : {quai_number_popup:string} =  { quai_number_popup:    lv_quai};
    console.log("P1 LOT18 Route ChargementQuais matched - Récupération du paramètre quai =" +  lv_quai );
   

          
     const IconTabBarControl : IconTabBar = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
    console.log("P1 onAfterRendering IcontabControler = " + this.gv_current_quai );
   
     this.gv_current_quai = lv_quai;
    this.gv_current_quai_number = Number(lv_quainumber);
     IconTabBarControl.setSelectedKey(this.gv_current_quai);

    // TODO LOT 18/19 => Essayer de stocker le numéro de quai également au niveau du component controller
    //this.getOwnerComponent().gv_current_quai;

// TODO BEGIN LOT 19 Possibilité de binder avec cette méthode => A TEST
  // this.getView().bindElement({
        //     path: "/" + window.decodeURIComponent( (event.getParameter("arguments") as any).invoicePath),
        //     model: "invoice"
        // });

// 2. Faire le binding directement ici (Lot 18/19)
        this._performContextBinding(lv_quainumber);
        // Faire un binding au lieu de lanceer un évèneemnt(Eviter de lancer un évènement si le handler eest dans la même vue)

    //this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.changement_quai_event, data_event_publish);  
    // TODO END LOT 19 Possibilité de binder avec cette méthode => A TEST
      }
    //LOT 18 SIMPLIFICATION ROUTING END


private _performContextBinding_old(sQuaiNum: string): void {
        const iIndex = Number(sQuaiNum) - 8;
        //const oView = this.getView();
        const oContent = (this.byId("idIconTabBarQuais") as IconTabBar).getContent()[0];

        if (oContent) {
            // Binding du modèle de données
            oContent.bindElement({
                path: `/results/${iIndex}/`,
                model: "chargementModelJson"
            });
            // Binding du modèle de notifications
            oContent.bindElement({
                path: `/quais/${iIndex}/`,
                model: "notificationsQuaisModel"
            });
        }
    }

//----------------------------------------------------------------------------------------------------------------------------//
//               VERSION OPTIMISEE DU BNDING       (recherche de l'indice du quai)                                                                           //  
//----------------------------------------------------------------------------------------------------------------------------//
    private _performContextBinding(sQuaiNum: string): void {
    const sFullQuaiName = "QUAI" + sQuaiNum;
    const oModelNotif : JSONModel = this.getOwnerComponent()?.getModel("notificationsQuaisModel") as JSONModel;
    const oModelData: JSONModel = this.getOwnerComponent()?.getModel("chargementModelJson") as JSONModel;
    
    // 1. Trouver l'index réel dans le modèle de notifications
    const aQuaisNotif = oModelNotif.getProperty("/quais") as any[];
    const iIndexNotif = aQuaisNotif.findIndex(obj => obj.quai === sFullQuaiName);

    // 2. Trouver l'index réel dans le modèle de données (chargement)
    const aQuaisData = oModelData.getProperty("/results") as any[];
    const iIndexData = aQuaisData.findIndex(obj => obj.quai === sFullQuaiName);

    const oContent = (this.byId("idIconTabBarQuais") as IconTabBar).getContent()[0];

    if (oContent) {
        // Binding dynamique basé sur la recherche réelle
        if (iIndexData !== -1) {
            oContent.bindElement({
                path: `/results/${iIndexData}/`,
                model: "chargementModelJson"
            });
        }
        
        if (iIndexNotif !== -1) {
            oContent.bindElement({
                path: `/quais/${iIndexNotif}/`,
                model: "notificationsQuaisModel"
            });
        }
    }
}




//----------------------------------------------------------------------------------------------------------------------------//
//               Handler clic sur le quai  (Pour synchroniser le routing avec le quai sélectionné)                            //  
//----------------------------------------------------------------------------------------------------------------------------//
    public onAfterRendering(): void {
      // Ce code pour synchroniser le selected key avec le routing a été retiré momentanaément
    // let IconTabBarControl : IconTabBar;       
    // IconTabBarControl = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
    // console.log("P1 onAfterRendering IcontabControler = " + this.gv_current_quai );
    // IconTabBarControl.setSelectedKey(this.gv_current_quai);
     }
//----------------------------------------------------------------------------------------------------------------------------//
//               Handler de sélection d'un onglet de l'IConTabBar                                                             //  
//----------------------------------------------------------------------------------------------------------------------------//
    public onTabSelect(event: IconTabBar$SelectEvent): void {
      // Récupération de l'identififant de l'onglet sélectionné
      let iconTabBarkey = event.getParameter("key") as string;            //LOT 17 let iconTabBarkey:string -> undefined rajouté
      const router : Router = UIComponent.getRouterFor(this);
      // Récupération des modèles json nécessaires
      let ChargementQuaiModel     : JSONModel = this.getOwnerComponent()?.getModel("chargementModelJson")     as JSONModel;
      let notificationsQuaisModel : JSONModel = this.getOwnerComponent()?.getModel("notificationsQuaisModel") as JSONModel;
      let chargementStartModel    : JSONModel = this.getOwnerComponent()?.getModel("ChargementStartModel")    as JSONModel;
      // Calcul des indices et indice json du quai sélectionné
      let quai_number : number= Number( iconTabBarkey?.slice(4,6));
      let indice_json : number; indice_json = quai_number - 8;
      // Stockage du quai actuellement sélectionné en global dans le contrôlleur

    //----------------------------- Détection de s'il s'agit de si le quai est en cours de chargement ou non ----------------------------------------------                
      let encours : boolean = ChargementQuaiModel.getObject("/results/" + indice_json + "/chargementEncours");
          
    if ( encours == true ) 
    {
      /******************    REINITIALISATION DES MESSAGES ERREUR/WARNING LORS DE CHANGEMENT DE QUAI**************************************** */      
      notificationsQuaisModel.setProperty("/chargementstartnotifs/notifwarning/msg_txt","");   
      notificationsQuaisModel.setProperty("/chargementstartnotifs/notifwarning/visible",false); 
      
      // LOT18 BEGIN -> simplification routing
      // Relance de la récupération des données de chargement avant la navigation sur le quai
      this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {}); 
          // LO18 BEGIN [Déclenchement de transition]
    //       let lv_IconTabBarControl = this.getView()?.byId("navContainerQuais") as NavContainer;
    // // On force la navigation interne avec transition
    // // Cela déclenchera l'effet visuel même si c'est la même vue technique
    //  lv_IconTabBarControl.to(this.getView()?.byId("quai_all") as any, "flip"); 
     // LO18 END [Déclenchement de transition]


     // Amélioration GEMINI pour déclechement transition BEGIN
//     let oNavContainer = this.byId("navContainerQuais") as NavContainer;
// oNavContainer.to("quai_all", "flip"); 
     // Amélioration GEMINI pour déclechement transition END
    router.navTo("RouteChargementQuai", {quainumber: quai_number} );

    // LOT 19 => Le forcage de la navigation ne fonctionne pas car la fonction navTo n'est pas appelable avec ces paramètres  
    // Router.navTo("RouteChargementQuai", {
    //         quainumber: quai_number
    //     }, {
    //         transition: "slide", // Ou "flip" selon votre manifest
    //         clearControlAggregation: true // CRUCIAL pour le Lot 19 (réutilisation de vue)
    //     });

// router.navTo("RouteChargementQuai", {
//     quainumber: quai_number
// }, {
//     restoreContext: false,
//     reload: true // Force le rafraîchissement visuel
// });

    }
    else   //Si aucun chargement en cours sur le quai alors on affiche un formulaire de lancement de chargement
    {      
      //  REINITIALISATION DU FORMULAIRE DE SAISIE Uniquement si on ne clique pas sur le quai actuellement affiché  
      if ( this.gv_current_quai_number != quai_number )
      {
        chargementStartModel.setProperty("/results/tknum",""); 
        chargementStartModel.setProperty("/results/matri",""); 
        notificationsQuaisModel.setProperty("/chargementstartnotifs/notiferror/msg_txt",""); 
        notificationsQuaisModel.setProperty("/chargementstartnotifs/notiferror/visible",false); 
      }

    router.navTo("RouteChargementStart", {quainumber: quai_number}); 
    }
    this.gv_current_quai_number = quai_number;
    this.gv_current_quai = iconTabBarkey;              // LOT 17 Review/Amélioration code -> Enregistement du nom du quai
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
  let current_indicejson_quai :number      = this.gv_current_quai_number - 8;             // Calcul de l'indice json du quai (quai number-8) //TO Récupérer l'indice de l'élément avec QUAI + quainumber
  
   // AMELIORATION GEMINI 03/04/2026 ->TODO A TESTER
  // let indice_validationmsg_string : string = source_string.at(source_string.length-1)!;   // Récupération de l'indice du message de Validation 
  
 
  // //----------------------------------------------------------------------------------------------------------------------------------------------------//
  // //------------------- LOT8/9 Validation des messages de Warning-> Récupérer le contexte de la validation (QUAI/UM/Checknumber)------------------------//
  // //----------------------------------------------------------------------------------------------------------------------------------------------------//
  // let validation_msg_codum : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/exidv") ;
  // let validation_msg_msgid : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/msgId") ;
  // let validation_msg_aenam : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/aenam") ;
  // let validation_msg_errdt : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/errdt") ;
  // let validation_msg_errzt : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/errzt") ;

    const oContext = (event.getSource() as any).getBindingContext("validationMsgChargementQuaiModelJSON");
    const oData = oContext.getObject();
    
    let validation_msg_codum = oData.exidv;
    let validation_msg_msgid = oData.msgId;
    let validation_msg_aenam = oData.aenam;
    let validation_msg_errdt = oData.errdt;
    let validation_msg_errzt = oData.errzt;
    // AMELIORATION GEMINI 03/04/2026
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