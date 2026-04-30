import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import IconTabBar, { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import Dialog from "sap/m/Dialog";
import Context from "sap/ui/model/Context";
import { Button$PressEvent } from "sap/m/Button";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Router from "sap/ui/core/routing/Router";
import VBox from "sap/m/VBox";
import MessageBox from "sap/m/MessageBox";
import Log from "sap/base/Log";
import { application_events_enum,chargement_um_context} from "../../model/Enums";
import { IChargementUmValidationPayload, IRouteParams, IChargementMsgValidation} from "../../model/Interfaces";
import Component from "../../Component";
// Importation de l'enum

/**
 * @namespace clf.logistique.chargementquais.controller
 */



export default class AppChargementQuaisIconTabBar extends Controller {
    private gv_current_quai_number !: number;      //GEMINI[TODO] => REmplacer le !:number (pour éviter les erreurs de compilation) par une solution plus élégante
    private gv_current_quai !: string;             // Quai affiché dans l'IconTabBar : Stockage du quai au format QUAI08,QUAI09,QUAI10,ect
    private gv_dialog_validation_charg!: Dialog;   // Boîte de dialogue de Validation de chargement des UMs du transport
    
    /*eslint-disable @typescript-eslint/no-empty-function*/
  public onInit(): void {
  //----------------------------------------------------------------------------------------------------------------------------//
  //               LOT 8/9 : Validation des messages de chargement// Instantiation du fragment du dialogue                      //
  //----------------------------------------------------------------------------------------------------------------------------//
  //this.onOpenDialogValidCharg();    / ANO TESTs UNITAIRES 28/04/2026 => Ouverture de la boîte de dialogue à la volée dans le handler d'ouvertue de boîte de dialogue
  // ==================================LOT 18 BEGIN -> Simplification du routing (une seule route et une seule target pour l'ensemble des quais)=============================================//
    const router = UIComponent.getRouterFor(this);
    router.getRoute("RouteChargementQuai")!.attachPatternMatched(this.onObjectMatched, this);
  //===================================LOT 18 END -> Simplification du routing (une seule route et une seule target pour l'ensemble des quais)===============================================//
    const oEventBus = this.getOwnerComponent()?.getEventBus();
    oEventBus?.subscribe("Default","chargementQuaiButtonEvent",this._onChargementQuaiButton,this); 
  //----------------------------------------------------------------------------------------------------------------------------//
  //             HANDLER validationDialogEvent  [LOT 8 : Validation des messages de chargement]  
  //----------------------------------------------------------------------------------------------------------------------------//
    this.getOwnerComponent()?.getEventBus().subscribe("Default",application_events_enum.validation_dialog_event,(channel:string,event:string,data: Object) => {           
      // On reconstitue le numéro de quai à partir du QUAI (QUAI08 ->08, QUAI09->09) // Amélioration posssible fournir le numéro de quai à l'event
      
      // GEMINI BEGIN [Amélioration] Créer une interface de payload (data) pouro cet event
     // let quai_number: number = Number(Object.values(data)[0].slice(4,6));
      const payload = data as IChargementMsgValidation;   // GEMINI [Check] Il faut que l'interface continenne le champ quai au format number 
                                                          // GEMINI [TODO] Passer ce payload à chaque publish de cet event

      // GEMINI END [Amélioration] Créer une interface de payload (data) pouro cet event
      
      // BEGIN  Amélioration GEMINI LOT 21 => Ne plus utiliser de nombre magique -> Trouver l'indice json du quai à partir de son appelation QUAI08, QUAI09, ect
       const oModelData: JSONModel = this.getOwnerComponent()?.getModel("chargementModelJson") as JSONModel;
       const aQuaisData = oModelData.getProperty("/results") as any[];
       const current_quai_index_json = aQuaisData.findIndex(obj => obj.quai === (Object.values(data)[0]));   //Object.values(data)[0] contient le libellé du quai (QUAI08, QUAI09,ect)
      //et current_quai_index_json:number=   quai_number - 8 ;
      // END  Amélioration GEMINI LOT 21 => Ne plus utiliser de nombre magique -> Trouver l'indice json du quai à partir de son appelation QUAI08, QUAI09, ect
       if (  payload.quai_number == this.gv_current_quai_number) // La boîte de dialogue ne doit s'ouvrir que si la validation concerne le quai en cours d'affichage
      {    
        //console.log("P1 Ouverture de la boîte de dialogue Current_quai_index_json = " +  current_quai_index_json); 
        this.onOpenDialogValidCharg();   // ANO TESTs UNITAIRES 28/04/2026 => S'assurer que la boîte de dialogue (Fragment ) est instancié avant le binding
        this.gv_dialog_validation_charg.setBindingContext(this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.createBindingContext("/results/" + current_quai_index_json + "/") as Context,"validationMsgChargementQuaiModelJSON");  
            // On laisse un micro-délai pour que le rendu de la page se termine
    setTimeout(() => {
        this.gv_dialog_validation_charg.open();
    }, 50);
        console.log("Après ouverture boite de dialogue") ;
      }
        },this);

//oEventBus?.subscribe("Default", application_events_enum.validation_dialog_event, this._onValidationDialogEvent, this);   // Ne fonctionne pas -> A retester
  }
  
  // Handler pour le bouton de chargement
private _onChargementQuaiButton(channel: string, event: string, data: any): void {
    this.button_chargementquai_handler();
}

// 2. Handler pour l'ouverture de la popup de validation                                             -> A décommenter pour changer la technique de subscribe/unsubscribe
// private _onValidationDialogEvent(channel: string, event: string, data: any): void {
// On reconstitue le numéro de quai à partir du QUAI (QUAI08 ->08, QUAI09->09) // Amélioration posssible fournir le numéro de quai à l'event
    //   let quai_number: number = Number(Object.values(data)[0].slice(4,6));
    //   let current_quai_index_json:number=   quai_number - 8 ;
    //   console.log("P1 LOT10 Validation des chargements QUAI DE LA NOTIFICATION: " + quai_number + "-QUAI ACTUEL:  " + this.gv_current_quai_number);
    //    if ( quai_number == this.gv_current_quai_number) 
    //   {    
    //     console.log("P1 Ouverture de la boîte de dialogue Current_quai_index_json = " +  current_quai_index_json); 
    //     this.gv_dialog_validation_charg.setBindingContext(this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.createBindingContext("/results/" + current_quai_index_json + "/") as Context,"validationMsgChargementQuaiModelJSON");  
    //     console.log("Avant ouverture boite de dialogue") ;
    //     console.log(this.gv_dialog_validation_charg) ;
    //         // On laisse un micro-délai pour que le rendu de la page se termine
    // setTimeout(() => {
    //     this.gv_dialog_validation_charg.open();
    // }, 50);
    //     console.log("Après ouverture boite de dialogue") ;
    //   }
// }
  
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  //   Handler clic sur le quai      -> A VERIFIER SI C'EST UTILISE  (serait utilisé pour le lien vers le quai dans l'application 'Chargement prévus" )                     // 
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------ //
    public button_chargementquai_handler() : void{ 
      let IconTabBarControl : IconTabBar;
      IconTabBarControl = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
      let selectedKeyQuaiNumber : string  =  IconTabBarControl.getSelectedKey();
    // BEGIn GEMINI [TODO] Attention remplacer tous les "QUAI08"?.slice(4,6)  par  replace("QUAI", "") pour transformer le libellé du quai en quai_number
    let quai_number : number= Number( selectedKeyQuaiNumber?.slice(4,6));    
    // END GEMINI [TODO] Attention remplacer tous les "QUAI08"?.slice(4,6)  par  replace("QUAI", "") pour transformer le libellé du quai en quai_number
    
      const router = UIComponent.getRouterFor(this);

      // LOT 18 BEGIN Simplification routing [Uilisation de navTo au lieu  target display]
      router.navTo("RouteChargementQuai", {quainumber: quai_number});    // Evolution quai 8 et 09s
      // LOT 18 BEGIN Simplification routing [Uilisation de navTo au lieu  target display]
          }

//LOT 18 SIMPLIFICATION ROUTING BEGIN
public onObjectMatched(event: Route$PatternMatchedEvent): void {

//TODO LOT18 -> Soit faire le binding avec bindelement soit appeleer l'event chargement quai qui fait le binding
// Amélioration GEMINI BEGIN 09/04/2026
// TODO ->
// interface IRouteParams {
//     quainumber: string;
// }

// onObjectMatched(event: Route$PatternMatchedEvent): void {
//     const oArgs = event.getParameter("arguments") as unknown as IRouteParams;
//     const sQuaiNum = oArgs.quainumber;
//     // ...
// }
console.log("P1 Handler onObjectMatched event.getSource() =" +  Object.values(event.getParameters())[0]);

//==================================Déclaration des modèles à utiliser ==========================================================================================
const oModelData: JSONModel = this.getOwnerComponent()?.getModel("chargementModelJson") as JSONModel;

// 1. Récupérer l'objet "arguments" du routeur
//const lv_quainumber = window.decodeURIComponent( (event.getParameter("arguments") as any).quainumber)          //TODO LOT18 A quoi sert le decodeURIComponent
let lv_quainumber = window.decodeURIComponent( (event.getParameter("arguments") as IRouteParams).quainumber)    //TODO LOT18 A quoi sert le decodeURIComponent

// if (!lv_quainumber) {
//     // La chaîne est "", null, ou undefined
// console.log("La valeur du quai est la suivante pour RouteHome"  +  lv_quainumber);
// lv_quainumber = "8";
// }

// Amélioration GEMINI BEGIN LOT 21  => On redirige vers le quai 8 si le numéro saisit dans l'URL n'est pas correct
const iQuaiNum = Number(lv_quainumber);
// Amélioration GEMINI LOT 21 BEGIN 
if (isNaN(iQuaiNum) ||  iQuaiNum > 15 ||  iQuaiNum < 8) {
    MessageBox.error(`Le quai ${lv_quainumber} n'est pas répertorié.`, {
        title: "Quai Inconnu",
        actions: [MessageBox.Action.CLOSE],
        onClose: () => {
            // Redirection vers le quai par défaut (ex: Quai 08) ou la liste
            const router = UIComponent.getRouterFor(this);
            router.navTo("RouteChargementQuai", { quainumber: "8" }, true);
        }
    });
    return; // On arrête l'exécution pour éviter le crash du binding
  }
// Amélioration GEMINI LOT 21 END
// On rajoute un 0 devant le numéro de quai si le numéro de quai est inférieur à 10 (car les quais doivent être au format QUAI08,QUAI09)
  if ( ( iQuaiNum < 10 ) && lv_quainumber.length == 1 ) { lv_quainumber = "0" + lv_quainumber;}
  const IconTabBarControl : IconTabBar = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
  //console.log("P1 onAfterRendering IcontabControler = " + this.gv_current_quai );
  
  // BEGIN GEMINI [TODO] Attention il faut également mettre les variables du component controller car le code dans le module EventRegistrationService.ts s'appuie dessus
  // this.gv_current_quai = "QUAI" + lv_quainumber;
  // this.gv_current_quai_number = Number(lv_quainumber);
  const oComponent = this.getOwnerComponent() as Component;
  oComponent.gv_current_quai =this.gv_current_quai = "QUAI" + lv_quainumber;
  oComponent.gv_current_quai_number = this.gv_current_quai_number = Number(lv_quainumber);
  // END GEMINI [TODO] Attention il faut également mettre les variables du component controller
  
  IconTabBarControl.setSelectedKey(this.gv_current_quai);       // Synchronisation du quai de l'Icontabbar avec le quai indiqué dans l'URL

// 2. Faire le binding directement ici (Lot 18/19)
    this._performContextBinding( this.gv_current_quai);
  //===============Deux possibilitées Appel de la popup dans cette méthode ou appel dans le attach display de la route ======================================//
    //const oModelData: JSONModel = this.getOwnerComponent()?.getModel("chargementModelJson") as JSONModel;
    const aQuaisData = oModelData.getProperty("/results") as any[];
    const iIndexData = aQuaisData.findIndex(obj => obj.quai === ( this.gv_current_quai));

  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/" + iIndexData + "/tValidationMsg");
  // // La popup ne doit s'afficher que s'il existe des notifications de validation dans le modèle notificationsQuaisModel pour le quai en question
   // GEMINI BEGIN  [Amélioration] Payload pour les data des event
   const payload : IChargementMsgValidation =  { quai_number:   Number( this.gv_current_quai.slice(4,6))};
  console.log("P1 Payload" + payload.quai_number)
   // GEMINI END  [Amélioration] Payload pour les data des event
  if (t_validation_msg_list.length > 0 ) {  
   console.log("P1 LOT18  Appel de la boîte de dialogue de validation") ;
  this.getOwnerComponent()?.getEventBus().publish("Default",  application_events_enum.validation_dialog_event, payload);
  }
}

//----------------------------------------------------------------------------------------------------------------------------//
//               VERSION OPTIMISEE DU BNDING       (recherche de l'indice du quai)                                                                           //  
//----------------------------------------------------------------------------------------------------------------------------//
  private _performContextBinding(sQuai: string): void {

    const oModelNotif : JSONModel = this.getOwnerComponent()?.getModel("notificationsQuaisModel") as JSONModel;
    const oModelData: JSONModel = this.getOwnerComponent()?.getModel("chargementModelJson") as JSONModel;
    
    // 1. Trouver l'index réel dans le modèle de notifications
    const aQuaisNotif = oModelNotif.getProperty("/quais") as any[];
    const iIndexNotif = aQuaisNotif.findIndex(obj => obj.quai === (sQuai));

    // 2. Trouver l'index réel dans le modèle de données (chargement)
    const aQuaisData = oModelData.getProperty("/results") as any[];
    const iIndexData = aQuaisData.findIndex(obj => obj.quai === (sQuai));

    const oContent = (this.byId("idIconTabBarQuais") as IconTabBar).getContent()[0];

// BEGIN AMELIORATION GEMINI LOT 21 
    // 2. Vérification de l'existence des données dans le modèle de chargements
    if (iIndexData === -1) {
      //Avantage : Vous pouvez filtrer ces logs dans la console du navigateur.
      //Astuce : En production, SAP limite souvent le niveau de log. Vous pouvez l'activer dynamiquement via l'URL en ajoutant sap-ui-logLevel=ERROR.

            //  Log.warning(`Erreur de Binding : Le quai ${(sQuai} est absent du modèle de données.`, 
            //   "Détails techniques : sQuaiNum=" + (sQuai, 
            //   "clf.logistique.chargementquais.ChargementsQuaisApp.AppChargementQuaisIconTabBar");

        // Option A: Message d'erreur et redirection
        MessageBox.error(`Les données pour le ${sQuai} sont introuvables.`, {
            onClose: () => {
                // Redirection vers la liste des chargements prévus par exemple
                UIComponent.getRouterFor(this).navTo("RouteChargementPrevus"); 
            }
        });
        return;                                                              // A noter si pas de données pour un quai donné alors on sort de la méthode
    }

// END AMELIORATION GEMINI LOT 21 
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
     }
//----------------------------------------------------------------------------------------------------------------------------//
//               Handler de sélection d'un onglet de l'IConTabBar                                                             //  
//----------------------------------------------------------------------------------------------------------------------------//
    public onTabSelect(event: IconTabBar$SelectEvent): void {
      // Récupération de l'identififant de l'onglet sélectionné
      let iconTabBarkey = event.getParameter("key") as string;            //LOT 17 let iconTabBarkey:string -> undefined rajouté
      const router : Router = UIComponent.getRouterFor(this);
      //========================= Récupération des modèles json nécessaires====================================================///
      let ChargementQuaiModel     : JSONModel = this.getOwnerComponent()?.getModel("chargementModelJson")     as JSONModel;
      let notificationsQuaisModel : JSONModel = this.getOwnerComponent()?.getModel("notificationsQuaisModel") as JSONModel;
      let chargementStartModel    : JSONModel = this.getOwnerComponent()?.getModel("ChargementStartModel")    as JSONModel;
      //=========================== Calcul des indices et indice json du quai sélectionné======================================///
      let quai_number : number= Number( iconTabBarkey?.slice(4,6));              // Le numéro de quai est calculé à partir de la clé de l'onglet de l'IconTabBar QUAI ->8, QUAI09->9

      const aResults = ChargementQuaiModel.getProperty("/results") as any[];

    // BEGIN Amélioration GEMINI LOT 21 [Chargement en cours] 
      if (!aResults) {
          MessageToast.show("Chargement des données en cours...");
          return;
      }
       // BEGIN Amélioration GEMINI LOT 21 

      const quai_index = aResults.findIndex(q => q.quai ===  iconTabBarkey );    // On recherche l'indice de QUAI10, QUAI11 dans la liste des quais
  
    //----------------------------- Détection de s'il s'agit de si le quai est en cours de chargement ou non ----------------------------------------------                
   //  let encours : boolean = ChargementQuaiModel.getObject('/results/${indice_json}/chargementEncours');    // Utiliser les strings templates au lieu de concaténation string
      const encours = ChargementQuaiModel.getProperty(`/results/${quai_index}/chargementEncours`);
          
    if ( encours == true ) 
    {
      /******************    REINITIALISATION DES MESSAGES ERREUR/WARNING LORS DE CHANGEMENT DE QUAI**************************************** */      
      notificationsQuaisModel.setProperty("/chargementstartnotifs/notifwarning/msg_txt","");   
      notificationsQuaisModel.setProperty("/chargementstartnotifs/notifwarning/visible",false); 
      
      // LOT18 BEGIN -> simplification routing
      // Relance de la récupération des données de chargement avant la navigation sur le quai
      this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {}); 
      // BEGIN Amélioration GEMINI 09-04-2026 

     // 1. Récupérer le wrapper d'animation
     const oWrapper = this.byId("animWrapper") as VBox;

    if (oWrapper) {
        // 2. Retirer la classe si elle existe déjà (pour reset l'animation)
        //oWrapper.removeStyleClass("quai-slide-out");    //quai-slide-in
    // On récupère la direction : slide vers la gauche si le numéro diminue, vers la droite sinon

  const iDuration = 900; // On prend une marge de sécurité par rapport aux 400ms CSS

if (quai_number < this.gv_current_quai_number) {
    // SCÉNARIO : On recule (ex: Quai 5 -> Quai 4)
    oWrapper.removeStyleClass("quai-slide-in-right quai-slide-in-left");
    oWrapper.addStyleClass("quai-slide-out-right"); // Sort vers la droite

    setTimeout(() => {
        //this.gv_current_quai_number = quai_number;
        // Ici tu mets à jour ton modèle JSON/OData
         oWrapper.removeStyleClass("quai-slide-out-right");
         oWrapper.addStyleClass("quai-slide-in-left"); // Arrive de la gauche
    }, iDuration);

} else if (quai_number > this.gv_current_quai_number) {
    // SCÉNARIO : On avance (ex: Quai 4 -> Quai 5)
    oWrapper.removeStyleClass("quai-slide-in-right quai-slide-in-left");
    oWrapper.addStyleClass("quai-slide-out-left"); // Sort vers la gauche

    setTimeout(() => {
        //this.gv_current_quai_number = quai_number;
         oWrapper.removeStyleClass("quai-slide-out-left");
         oWrapper.addStyleClass("quai-slide-in-right"); // Arrive de la droite
    }, iDuration);
}   
  
}              
           
     // Amélioration GEMINI pour déclechement transition END
    // 2. On attend un petit délai avant de changer l'URL pour ne pas casser l'anim
       setTimeout(() => {
           router.navTo("RouteChargementQuai", { quainumber: quai_number  });
       },1000);
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
    this.gv_current_quai = iconTabBarkey;              // iconTabBarkey contient QUAI08, QUAI09, QUAI10,ect
    } 

  async onOpenDialogValidCharg(): Promise<void> {
    this.gv_dialog_validation_charg ??= await this.loadFragment({                                // A noter qu'il existe également une méthode sur la classe Fragement pour instantier un fragment
        name: "clf.logistique.chargementquais.view.fragment.DialogValidChargement"
    }) as Dialog;
  //=============================== GEMINI=> Demander à Gemini à quoi cela cela sert d'utilier les méthodes addDependent et setModel sur un Fragement  
    //this.gv_dialog_validation_charg.setModel(this.getOwnerComponent()?.getModel("notificationsQuaisModel"),"notificationsQuaisModel"); Pas utile normalement
  // TRÈS IMPORTANT : Connecte le dialogue à la vue pour l'i18n et les modèles
    this.getView()?.addDependent(this.gv_dialog_validation_charg);
  }  
      
  public onValidationClose(): void {
    this.gv_dialog_validation_charg.close();
  }

 public onConfirmValidationMsgChargement(event:Button$PressEvent):void {
  // Récupération du modèle de notifications des quais (Messages de validation par quai)
     let validationMsgChargementQuaiModel : JSONModel = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON") as JSONModel;

    const oContext = (event.getSource() as any).getBindingContext("validationMsgChargementQuaiModelJSON");
    const oData = oContext.getObject();
    
    let validation_msg_codum = oData.exidv;
    let validation_msg_msgid = oData.msgId;
    let validation_msg_aenam = oData.aenam;
    let validation_msg_errdt = oData.errdt;
    let validation_msg_errzt = oData.errzt;
    // AMELIORATION GEMINI 03/04/2026
  // Détection de si l'utilisateur a cliqué sur Ok ou Refuser (ne concerne que les Validations de types Choice)
  // GEMINI BEGIN [Correctif] Le paramètre choice est de type boolean sauf à cet endroit. J'ai corrigé pour que la variable soit de type boolean
  //let lv_choice:string='';
   let lv_choice : boolean = false;   // Correctif ++
  
  if  (event.getSource().getId().includes("ButtonOK"))     {   lv_choice = true ;}    //lv_choice = 'X'
  if  (event.getSource().getId().includes("ButtonReject")) {   lv_choice = false;}
  // GEMINI END [Correctif]
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------Envoi d'un évènement au controlleur pour appel de l'API de Chargement de l'UM-------------------------------------------------------------------------------------------------- 
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //let lv_quai= this.gv_current_quai;
// LOT15 BEGIN 
// GEMINI BEGIN 22/04/2026 [amélioration] Amélioration du typage du payload de l'API
    //let data : {quai:string|undefined, codum :string, msgid:string, aenam:string, errdt:string, errzt :string, choice:string} =
    // { quai: this.gv_current_quai, codum : validation_msg_codum,  msgid: validation_msg_msgid, aenam : validation_msg_aenam, errdt: validation_msg_errdt, errzt: validation_msg_errzt, choice : lv_choice}
 
      let ChargementUmValidationPayload :     IChargementUmValidationPayload =
     { context: chargement_um_context.validation_chargement_um_post ,quai: this.gv_current_quai, codum : validation_msg_codum,  msgid: validation_msg_msgid, aenam : validation_msg_aenam, errdt: validation_msg_errdt, errzt: validation_msg_errzt, choice : lv_choice}
    
     //this.getOwnerComponent()?.getEventBus().publish("Default",  application_events_enum.chargement_um_post_event, data);  //Correctif GEMINI--
     this.getOwnerComponent()?.getEventBus().publish("Default",  application_events_enum.chargement_um_post_event, ChargementUmValidationPayload);
// GEMINI END 22/04/2026 [amélioration] Amélioration du typage du payload de l'API
     // LOT Scan Manuel Anomalie rescan après validation BEGIN              -> Remise dans le then du POST [Recommandation GEMINI]
  // let data2 : {quai:string|undefined} = { quai:  lv_quai } 
   //this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.chargement_um_get_event,  data2);
// LOT Scan Manuel Anomalie rescan après validation END
 }

public onExit(): void {
  // Amélioration GEMINI LOT 21  BEGIN   => Unsubsribe des handler d'évènements
  const oEventBus = this.getOwnerComponent()?.getEventBus();

  if (oEventBus) {
      // Suppression des abonnements
      oEventBus.unsubscribe("Default", "chargementQuaiButtonEvent", this._onChargementQuaiButton, this);
      // TODO LOT20/21 CHECK GEMINI Penser à unsubscrible le handler de l'event application_events_enum.validation_dialog_event
      console.log("Handlers EventBus nettoyés avec succès.");
  } 

  this.gv_dialog_validation_charg?.destroy();
   // Amélioration GEMINI LOT 21  END
 }

}