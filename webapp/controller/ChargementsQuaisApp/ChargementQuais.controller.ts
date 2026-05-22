import Controller from "sap/ui/core/mvc/Controller";
import Table from "sap/m/Table";
import { Sticky } from "sap/m/library";
import Dialog from "sap/m/Dialog";
import Context from "sap/ui/model/Context";
import Button, { Button$PressEvent } from "sap/m/Button";
import ComboBox, { ComboBox$ChangeEvent, ComboBox$SelectionChangeEvent } from "sap/m/ComboBox";
import JSONModel from "sap/ui/model/json/JSONModel";
import Input, { Input$SubmitEvent } from "sap/m/Input";
// Importation de l'enum
import {  application_events_enum, chargement_um_context} from "../../model/Enums";
import {  IMotifsNchGetPayload, IMotifsNchPostPayload, IChargementUmPayload, IUmStockForMaterialPayload} from "../../model/Interfaces";
import ColumnListItem from "sap/m/ColumnListItem";
import  Component  from "../../Component";

/**
 * @namespace clf.logistique.chargementquais.controller
 */

export default class ChargementQuais extends Controller {

  // TODO -> Mettre les noms des modèles dans un Enum plutôt qu'en dur

  private dialogFauxCam!: Dialog;                // TODO => Renommer en Dialogue FauxCam 
  private dialogUmStock!: Dialog;         // Dialogue des UMS en stock pour un article
  //------------------------------------------
  // LOT 13: Fin de chargement    // Attention ne pas forcement mettre le load fragment de le init du controller mais plutôt dans le handler du bouton
  //------------------------------------------
  private dialogMotifsNoCharg!: Dialog;   // Dialogue de saisie de motifs de non chargement
  private dialogScanManuelUm !: Dialog;   // LOT15 : Chargement manuel Scan

    /*eslint-disable @typescript-eslint/no-empty-function*/
public onInit(): void {         
  let t_sticky: Sticky[] = new Array(Sticky.ColumnHeaders,Sticky.HeaderToolbar); 
    //LOT 21 -> Amélioration GEMINI

  let lt_PostesNonCharges_quai_all: Table = this.byId("TablePostesNonCharges_quai_all") as Table;
  let lt_ChargementUM_quai_all: Table     = this.byId("tableChargementUM_quai_all") as Table;

   if ( lt_PostesNonCharges_quai_all != undefined ) {  lt_PostesNonCharges_quai_all.setSticky(t_sticky); }
   if ( lt_ChargementUM_quai_all != undefined )     {      lt_ChargementUM_quai_all.setSticky(t_sticky); }

//LOT 21 -> Amélioration GEMINI

 //------------------------------------------
 // Ouverture des fragments de boite de dialogue
//------------------------------------------
    this.onLoadFragmentFauxCam();                         //TODO => REnommer en onLoadFragmentFauxCam
    this.onLoadFragmentUmStock();
     //------------------------------------------
     // LOT 13: Fin de chargement    // Attention ne pas forcement mettre le load fragment de le init du controller mais plutôt dans le handler du bouton
     //------------------------------------------
    this.onLoadFragmentMotifsNonChargement();
    this.onLoadFragmentScanManuelUm();   //LOT 15 -> Chargement Manuel Scan

  const oEventBus = this.getOwnerComponent()?.getEventBus();

  // BEGIN LOT20/21 Amélioration GEMINI Nouvelle technique de Subsribe/Unsubsribe
  oEventBus?.subscribe("Default", application_events_enum.chargement_end_event, this._onClosedialogMotifsNoCharg, this);
  oEventBus?.subscribe("Default", application_events_enum.close_manualscanpopup_event, this._close_manualscanpopup_event, this);
  // BEGIN LOT20/21 Amélioration GEMINI
}

public onExit(): void {
  
  const oEventBus = this.getOwnerComponent()?.getEventBus();

  if (oEventBus) {
      // Suppression des abonnements
      oEventBus.unsubscribe("Default", application_events_enum.chargement_end_event, this._onClosedialogMotifsNoCharg, this);
      oEventBus.unsubscribe("Default", application_events_enum.close_manualscanpopup_event,  this._close_manualscanpopup_event , this);
      console.log("Handlers EventBus nettoyés avec succès.");
  }
      // ... Suprresion des boîtes de dialogue ...
  this.dialogFauxCam?.destroy();
  this.dialogUmStock?.destroy();
  this.dialogMotifsNoCharg?.destroy();
  this.dialogScanManuelUm?.destroy();
}

// 1. Handler pour le fermer la boîte de dialogue des motifs de non chargement
private _onClosedialogMotifsNoCharg(channel: string, event: string, data: any): void {
  if (this.dialogMotifsNoCharg && this.dialogMotifsNoCharg.isOpen()) {
    this.dialogMotifsNoCharg.close();
  }
}

// 2. Handler pour la fermeture de la boîte de dialogue de Scan Manuel
private _close_manualscanpopup_event(channel: string, event: string, data: any): void {
  if (this.dialogScanManuelUm && this.dialogScanManuelUm.isOpen()) {
   this.dialogScanManuelUm.close();
  }
}

public onAfterRendering(): void {}

public onSelectDialogUmFauxCam(event: Button$PressEvent): void {
// CODE GEMINI pour binder la boîte de dialogue de Faux Camion sur les poste non chargés 
// Voir pourquoi les méthodes précédents n'étaient pas les bonnes ?
// 1. Récupérer l'élément (bouton) qui a déclenché l'événement
    var oButton = event.getSource();
    
// 2. Récupérer le contexte de la ligne (le chemin vers l'objet dans ton JSONModel)

    // GEMINI [A Capitaliser] Exemple de binding d'une boîte de dialogue vers une ligne de contexte donnée (La ligne de poste du bouton Faux Camion)
    const oBindingContext  = oButton.getBindingContext("chargementModelJson");
    const sPath   = oBindingContext?.getPath();                                       // Exemple: /tPosteNocharge/5
    console.log("Path du binding context ="  + sPath);

    // 4. L'Étape MAGIQUE : On lie la Dialog au chemin spécifique de la ligne cliquée
    this.dialogFauxCam.bindElement({
        path: sPath!,
        model: "chargementModelJson"
    });

    this.dialogFauxCam.open();
//CODE GEMINI
  }

public onSelectDialogUmStockPress(event: Button$PressEvent): void {
  let lv_material : string = event.getSource().getParent()?.getBindingContext("chargementModelJson")?.getProperty("codart") 
  const oPayload: IUmStockForMaterialPayload = {
    material : lv_material
};
  this.getOwnerComponent()?.getEventBus().publish("Default", "LoadMaterialUmStockListEvent", oPayload);
  this.dialogUmStock.open();
  }

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------//
  //           LOT 13 : Handler du bouton de validation de fin de chargement                                                                                      //
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------//
  public onPressButtonFinCharg(event: Button$PressEvent): void {
      //====================================  Deux méthodes possibles pour récupérer l'IconTabbar (getview.getParent() ou getElementById avec le chemin complet de l'iconTabBar): les deux méthodes fonctionnnenet =======================================================================
     // Amélioration GEMINI LOT 21 BEGIN -> Récupération à partir d'un custom data du bouton
     const sQuai = event.getSource().data("quai");  // GEMINI[Capitalisatoin] -Est -ce qu' il était également possible de récupérer le quai en utilisant la méthode getBindingContext? 
                                                    // Deux technniques possibles : Récupérer le quai avec un custom data au niveau du bouton ou récupérer les quai en faisant un getBindingContext sur le bouton
   // Amélioration GEMINI LOT 21 END -> Récupération à partir d'un custom data du bouton
     
     // Amélioration GEMINI LOT 21 BEGIN  -> Récupération de l'index d'un quai donnée : QUAI 08, QUAI09,ect
       const quai_index = this._getQuaiIndex(sQuai);
      // Amélioration GEMINI LOT 21 END

    // B-Récupération du numéro de transport du quai à partir de l'index json du quai  
    // GEMINI [TODO] La récupère le numéro de transport d'un quai donné. Je voudrais faire une fonction pour récupérer l'ensemble des infos d'un quai donn"
    // GeMINI  quai_get_data(libellé_quai :string) -> return numtransport + autres champs du quai
    // GEMININ [QUESTION SUBSIDIAIRE] Comment connaître les méta data d'un modèle donné.  Par exemple au niveau du quai dans le modèle chargementModelJson j'ai la propriété numtransport
    // Comment connaître les autres propriétées accessibles sans avoir besoin de voir le modèle JSON dans un navigateur internet?
    let lv_numtransport:string = this.getOwnerComponent()?.getModel("chargementModelJson")?.getProperty(`/results/${quai_index}/numtransport`, undefined)
   //GEMINI  BEGIN [Amélioration] Typage du payload des event 

  // Instanciation du modèle à la volée au premier sur le bouton Fin de chargement
     if ( this.getOwnerComponent()?.getModel("finChargementQuaiModelJSON") == undefined)
      {   this.getOwnerComponent()?.setModel(new JSONModel().setDefaultBindingMode("TwoWay"), "finChargementQuaiModelJSON");}

  // Payload pour l'appel event + API des motifs de non chargement
    const oPayload: IMotifsNchGetPayload = {
    quai : sQuai,
    transport: lv_numtransport
    }
   //GEMINI  END [Amélioration] Typage du payload des event  

    // Récupération des motifs de non chargement dans l'API REST              
    this.getOwnerComponent()?.getEventBus().publish("Default",application_events_enum.chargemen_end_motifsNch_get_event , oPayload);
    // Ouverture de la boîte de dialogue de saisie des motifs de non chargement
    this.dialogMotifsNoCharg.open();
    ((this.byId("tableMotifsNcharg") as Table).getItems() as ColumnListItem[]).forEach(item  => (item.getCells()[0]  as ComboBox).setValueState("None"));  //GEMINI [A Capitaliser] -> Accès A Table//Tableau ColumnListItem[]//item.getCells()[indicecell]
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------//
  //          LOT 13 : Confirmation fin de chargement                                                                                                              //
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------//
  public onconfirmMotifsNch(event: Button$PressEvent): void {
    // Envoi d'un event pour appel de l'API de fin de chargement 
    // .... Modèle FinChargement....
    let finChargementQuaiModel :any = this.getOwnerComponent()?.getModel("finChargementQuaiModelJSON") as JSONModel;
    // ... Récupération du composant parent....
    const oComponent = this.getOwnerComponent() as Component;
    // ... Récupération des données du formulaire de saisie des motifs de non chargement ....
    const input_data: IMotifsNchPostPayload =  finChargementQuaiModel.getData() as IMotifsNchPostPayload;
    
    const oPayload: IMotifsNchPostPayload = {
        quai1 :  oComponent.gv_current_quai,  // Ancien code: input_data.quai1        
                                              // Il faut soit le récupérer dans le modèle soit dans la variable globale du component gv_current_quai
        quai_number :  oComponent.gv_current_quai_number,  //input_data.quai1
        tknum:         input_data.tknum,          // GEMINI[CHECK] Deux possibilités pour alimenter le numéor de transport :
                                                  // 1) Prendre le numéro dans le modèle finChargementQuaiModelJSON après le Get
                                                  // 2) Récupérer le numéro dans le modèle JSON chargementModelJson à l'index correspondant au quai
                                                  // GEMINI [TODO] Fonction de récupération des toutes les infos d'un quai]
        tMotifNocharg: input_data.tMotifNocharg,  // GEMINI[Check] Vérifier que le typage de la propriété tMotifNocharg de l'interface IMotifsNchPostPayload est correct.
    }
    console.log("QUAI = " + oPayload.quai1 + "QUAINUMBER = "  + oPayload.quai_number + "TKNUM=" + oPayload.tknum);
    console.table(oPayload);    // Affichage du payload pour vérifier que les données saisies sont bien capturées dans le payload
   // ... Event/API Post motifs de non chargement.... 
    this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.chargemen_end_motifsNch_post_event, oPayload);
  }
 //--------------------------------------------------------------------------------------------------------------------------
 //           LOT 13 : Fin de chargement//Sélection des motifs de non chargement
 //---------------------------------------------------------------------------------------------------------------------------
  public onMotifNchCmbBoxSelectionChange(event: ComboBox$SelectionChangeEvent): void 
  { 
    //GEMINI[Amélioration] Dans beaucoup de méthodes du contrôlleurs je récupère une références sur les modèles. Est-ce que je pourrais mutualiser l'accès à ces références dans la méthode init?
    let finChargementQuaiModelJSON : JSONModel = this.getOwnerComponent()?.getModel("finChargementQuaiModelJSON") as JSONModel;
    finChargementQuaiModelJSON.setProperty(event.getSource().getParent()?.getBindingContext("finChargementQuaiModelJSON") + "/codmot", event.getParameter("selectedItem")?.getKey());
    finChargementQuaiModelJSON.setProperty(event.getSource().getParent()?.getBindingContext("finChargementQuaiModelJSON") + "/libmot", event.getParameter("selectedItem")?.getText());
    let cmbbox = event.getParameter("selectedItem")?.getParent() as ComboBox;
    cmbbox.setValueState("Success");
    //TO REVIEW END
  }

  //---------------------------------------------------------------------------------------------------------------------------------//
  //                LOT 15 : Appel de la boîte de dialogue Chargement manuel scan                                                     //
  //---------------------------------------------------------------------------------------------------------------------------------//
public onScanManuelUm(event: Button$PressEvent): void {
//=======================================Déclaration des modèles utilisés dans le handler===============================================
  let notificationsQuaiModel : JSONModel = this.getOwnerComponent()?.getModel("notificationsQuaisModel") as JSONModel;
//=======================================Récupération du libellé du quai à partir de la vue===============================================
  // BEGIN Amélioration GEMINI LOT 20/21 => Récupération du quai à partir d'un custom date du bouton Scan Manuel
  const sQuai = event.getSource().data("quai");
  // END Amélioration GEMINI LOT 20/21 => Récupération du quai à partir d'un custom date du bouton Scan Manuel

  // Amélioration GEMINI LOT 21 BEGIN  -> Récupération de l'index d'un quai donnée : QUAI 08, QUAI09,ect
    const quai_index = this._getQuaiIndex(sQuai);
  // Amélioration GEMINI LOT 21 END
  
  let data : {quai:string} = { quai:  sQuai} 
  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.chargement_um_get_event,  data);
  //Suppression des messages d'erreurs des scans manuels précédents
  // GEMINI BEGIN [TODO] Faire une fonction pour la réinitialisation des notifications
  notificationsQuaiModel.setProperty(`/quais/${quai_index}/notifs/notifsuccess_scanmanuelum/msg_txt`, "") ;
  notificationsQuaiModel.setProperty(`/quais/${quai_index}/notifs/notifsuccess_scanmanuelum/visible`, false) ;
  notificationsQuaiModel.setProperty(`/quais/${quai_index}/notifs/notiferror_scanmanuelum/msg_txt`, "") ;
  notificationsQuaiModel.setProperty(`/quais/${quai_index}/notifs/notiferror_scanmanuelum/visible`, false) ;
  // GEMINI END [TODO] Faire une fonction pour la réinitialisation des notifications
  //Faire pointer la boîte de dialogue sur le noeud correspondant au quai en cours
  this.dialogScanManuelUm.setBindingContext(this.getOwnerComponent()?.getModel("notificationsQuaisModel")?.createBindingContext(`/quais/${quai_index}/`) as Context,"notificationsQuaisModel");  
  //E- Ouverture de la boîte de dialogue dialogScanManuelUm
  this.dialogScanManuelUm.open();
  // Essayer de mettre le focus sur le champ de saisie
  }

  //----------------------------------------------------------------------------------------------------------------------------------------------------//
  //------------------- LOT 15 BEGIN SCAN MANUEL DES UMS  ----------------------------------------------------------------------------------------------//  
  //----------------------------------------------------------------------------------------------------------------------------------------------------//
 public onSubmitUm(event:Input$SubmitEvent):void {
  //===================================Déclaration des modèles utilisés dans le Handler=================================================================//
  let ChargementUmModel: JSONModel =   this.getOwnerComponent()?.getModel( "ChargementUmModel") as JSONModel;
  let notificationsQuaisModel : JSONModel  = this.getOwnerComponent()?.getModel("notificationsQuaisModel") as JSONModel;   // LOT 22 Indicateur Visuel rFID
  //===================================Récupération des valeurs du modèle =================================================================//
  let input_data:any = ChargementUmModel.getData();   // CHECK GEMINI -> Pourquoi appeler la méthode getData() d'un JSON Modèle avant de faire un post sur le même modèle
 // Amélioration GEMINI LOT 20/21 Typage des payload des APIS POST
  const oComponent = this.getOwnerComponent() as Component;

 // Dans ton fragment ou contrôleur de départ :
const oPayload: IChargementUmPayload = {
    context : chargement_um_context.chargement_um_post,
    quai    : oComponent.gv_current_quai,                  //Ancien code input_data.quai1  -> plutôt récupérer le quai via variable globale du controlleur
    codum   : input_data.codum,
   
};
  console.log("----------P1 HIGH LOT 15 Appel du post de chargement UM-----VALEUR DU QUAI= " + input_data.quai1  + " Valeur de l'UM= " + input_data.codum);
  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.chargement_um_post_event, oPayload);
 // bEGIN Recommandation GEMINI LOT 21 -> Vider le code UM après chaque Scan
  ChargementUmModel?.setProperty("/codum", "");
  // END Recommandation GEMINI LOT 21 -> Vider le code UM après chaque Scan

     let aQuais = notificationsQuaisModel.getProperty("/quais");
  // Trouver dynamiquement l'indice du quai par son nom (ex: "QUAI08")
     let iIndexQuai = aQuais.findIndex((oQuai: any) => oQuai.quai === oComponent.gv_current_quai);
     notificationsQuaisModel.setProperty(`/quais/${iIndexQuai}/isRfidLoading`, false);   //-> Repasser l'indicateur de chargment RFID à X chargement manuel
  // LOt 22 -> L'indicateur Visual de Chargement RFID doit être fermé en cas de chargement manuel [En toute rigueur il faudrait le faire dans le then de l'api plus en aval]

  ///
 }
  
 async onLoadFragmentFauxCam(): Promise<void> {
  this.dialogFauxCam ??= await this.loadFragment({
      name: "clf.logistique.chargementquais.view.fragment.DialogUmFaucam"
  }) as Dialog;
  this.dialogFauxCam.setModel(this.getOwnerComponent()?.getModel("chargementModelJson"),"chargementModelJson");
   //this.dialogFauxCam.addDependent();
   }  
  async onLoadFragmentUmStock(): Promise<void> {
    this.dialogUmStock ??= await this.loadFragment({
      name: "clf.logistique.chargementquais.view.fragment.DialogUmStock"
  }) as Dialog;
  //this.dialog.setModel(this.getOwnerComponent()?.getModel("MaterialUmStockListModel"),"MaterialUmStockListModel");   // Pas besoin de fournir le modèle à la boîte de dialogue
   }  

  async onLoadFragmentMotifsNonChargement(): Promise<void> {
    this.dialogMotifsNoCharg ??= await this.loadFragment({
        name: "clf.logistique.chargementquais.view.fragment.DialogMotifsNonCharg"                             
    }) as Dialog;
    //this.dialog.setModel(this.getOwnerComponent()?.getModel("MaterialUmStockListModel"),"MaterialUmStockListModel");  // Pas besoin de fournir le modèle à la boîte de dialogue
    }   

// LOT15 BEGIN Chargement manuel scan 
public  async onLoadFragmentScanManuelUm(): Promise<void> {
  this.dialogScanManuelUm ??= await this.loadFragment({
      name: "clf.logistique.chargementquais.view.fragment.DialogScanManuelUm"                               
  }) as Dialog;
  //this.dialog.setModel(this.getOwnerComponent()?.getModel("MaterialUmStockListModel"),"MaterialUmStockListModel");  // Pas besoin de fournir le modèle à la boîte de dialogue

// LOT 21 Amélioration GEMINI BEGIN => Focus sur le champ de saisie UM au moment de l'ouverture de la boîte de dialogue
// On attache le focus à l'événement "afterOpen"
// Il s'exécutera AUTOMATIQUEMENT à chaque fois que vous ferez .open()
  this.dialogScanManuelUm.attachAfterOpen(() => {
      const oInput = this.byId("idInputScanUm") as Input;
      oInput?.focus();
  });  
// LOT 21 Amélioration GEMINI END
}  

// LOT15 END Chargement manuel scan 
public onDialogMotifsClose(): void {
  this.dialogMotifsNoCharg.close();
}
// LOT15 BEGIN Chargement manuel scan 
public onDialogValidScanUMClose(): void {
  this.dialogScanManuelUm.close();
}
// LOT15 END Chargement manuel scan 

// BEGIN AMELIORATION GEMINI LOT 20/21 =>  Méthode utilitaire pour trouver l'index d'un quai à partir de son libelle dans le modèle chargementModelJson
private _getQuaiIndex(sQuai: string, sModelName: string = "chargementModelJson"): number {
  // const aResults = this.getOwnerComponent()?.getModel(sModelName)?.getProperty("/results") || 
  //                  this.getOwnerComponent()?.getModel(sModelName)?.getProperty("/quais");   // QUESTION GEMINI: je ne comprends pourquoi cettte deuxième condition pour aResults?
  
  const aResults = this.getOwnerComponent()?.getModel(sModelName)?.getProperty("/results"); 
  return aResults ? aResults.findIndex((q: any) => q.quai === sQuai) : -1;
}
// END AMELIORATION GEMINI LOT 20/21 =>  Méthode utilitaire pour trouver l'index d'un quai à partir de son libelle dans le modèle chargementModelJson
}