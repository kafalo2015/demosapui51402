import Controller from "sap/ui/core/mvc/Controller";
import Table from "sap/m/Table";
import { Sticky } from "sap/m/library";
import Dialog from "sap/m/Dialog";
import Context from "sap/ui/model/Context";
import Button, { Button$PressEvent } from "sap/m/Button";
import ComboBox, { ComboBox$ChangeEvent, ComboBox$SelectionChangeEvent } from "sap/m/ComboBox";
import JSONModel from "sap/ui/model/json/JSONModel";
import { Input$SubmitEvent } from "sap/m/Input";
import IconTabBar from "sap/m/IconTabBar";

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
  chargemen_end_motifsNch_event ="chargementEndMotifsNchEvent",
  chargemen_end_motifsNch_post_event = "chargementEndMotifsNchPostEvent",
  chargement_end_event = "finChargementEvent",
  notification_websocket_event = "notificationWebSocketEvent",
  validation_dialog_event = "validationDialogEvent",
  close_manualscanpopup_event = 'CloseManualScanPopupEvent'
}
export default class ChargementQuais extends Controller {

  private dialog: Dialog;
  private dialogUmStock: Dialog;         // Dialogue des UMS en stock pour un article
  //------------------------------------------
  // LOT 13: Fin de chargement    // Attention ne pas forcement mettre le load fragment de le init du controller mais plutôt dans le handler du bouton
  //------------------------------------------
  private dialogMotifsNoCharg: Dialog;   // Dialogue de saisie de motifs de non chargement
  private dialogScanManuelUm : Dialog;   // LOT15 : Chargement manuel Scan

    /*eslint-disable @typescript-eslint/no-empty-function*/
  public onInit(): void {         
    let t_sticky: Sticky[] = new Array(Sticky.ColumnHeaders,Sticky.HeaderToolbar); 
    let lt_PostesNonCharges_quai08: Table = this.byId("TablePostesNonCharges_quai08") as Table;
    let lt_ChargementUM_quai08: Table = this.byId("tableChargementUM_quai08") as Table;
    let lt_PostesNonCharges_quai09: Table = this.byId("TablePostesNonCharges_quai09") as Table;
    let lt_ChargementUM_quai09: Table = this.byId("tableChargementUM_quai09") as Table;
    let lt_PostesNonCharges_quai10: Table = this.byId("TablePostesNonCharges_quai10") as Table;
    let lt_ChargementUM_quai10: Table = this.byId("tableChargementUM_quai10") as Table;
    let lt_PostesNonCharges_quai11: Table = this.byId("TablePostesNonCharges_quai11") as Table;
    let lt_ChargementUM_quai11: Table = this.byId("tableChargementUM_quai11") as Table;
    let lt_PostesNonCharges_quai12: Table = this.byId("TablePostesNonCharges_quai12") as Table;
    let lt_ChargementUM_quai12: Table = this.byId("tableChargementUM_quai12") as Table;
    let lt_PostesNonCharges_quai13: Table = this.byId("TablePostesNonCharges_quai13") as Table;
    let lt_ChargementUM_quai13: Table = this.byId("tableChargementUM_quai13") as Table;
    let lt_PostesNonCharges_quai14: Table = this.byId("TablePostesNonCharges_quai14") as Table;
    let lt_ChargementUM_quai14: Table = this.byId("tableChargementUM_quai14") as Table;
    let lt_PostesNonCharges_quai15: Table = this.byId("TablePostesNonCharges_quai15") as Table;
    let lt_ChargementUM_quai15: Table = this.byId("tableChargementUM_quai15") as Table;

    if ( lt_PostesNonCharges_quai08 != undefined ) {  lt_PostesNonCharges_quai08.setSticky(t_sticky); }
    if ( lt_ChargementUM_quai08 != undefined ) {      lt_ChargementUM_quai08.setSticky(t_sticky); }
    if ( lt_PostesNonCharges_quai09 != undefined ) {  lt_PostesNonCharges_quai09.setSticky(t_sticky); }
    if ( lt_ChargementUM_quai09 != undefined ) {      lt_ChargementUM_quai09.setSticky(t_sticky); }
    if ( lt_PostesNonCharges_quai10 != undefined ) {  lt_PostesNonCharges_quai10.setSticky(t_sticky); }
    if ( lt_ChargementUM_quai10 != undefined ) {      lt_ChargementUM_quai10.setSticky(t_sticky); }
    if ( lt_PostesNonCharges_quai11 != undefined ) {  lt_PostesNonCharges_quai11.setSticky(t_sticky); }
    if ( lt_ChargementUM_quai11 != undefined ) {      lt_ChargementUM_quai11.setSticky(t_sticky); }
    if ( lt_PostesNonCharges_quai12 != undefined ) {  lt_PostesNonCharges_quai12.setSticky(t_sticky); }
    if ( lt_ChargementUM_quai12 != undefined ) {      lt_ChargementUM_quai12.setSticky(t_sticky); }
    if ( lt_PostesNonCharges_quai13 != undefined ) {  lt_PostesNonCharges_quai13.setSticky(t_sticky); }
    if ( lt_ChargementUM_quai13 != undefined ) {      lt_ChargementUM_quai13.setSticky(t_sticky); }
    if ( lt_PostesNonCharges_quai14 != undefined ) {  lt_PostesNonCharges_quai14.setSticky(t_sticky); }
    if ( lt_ChargementUM_quai14 != undefined ) {      lt_ChargementUM_quai14.setSticky(t_sticky); }
    if ( lt_PostesNonCharges_quai15 != undefined ) {  lt_PostesNonCharges_quai15.setSticky(t_sticky); }
    if ( lt_ChargementUM_quai15 != undefined ) {      lt_ChargementUM_quai15.setSticky(t_sticky); }

 //------------------------------------------
 // Ouverture des fragments de boite de dialogue
//------------------------------------------
    this.onOpenDialog();
    this.onLoadFragmentUmStock();
     //------------------------------------------
     // LOT 13: Fin de chargement    // Attention ne pas forcement mettre le load fragment de le init du controller mais plutôt dans le handler du bouton
     //------------------------------------------
    this.onLoadFragmentMotifsNonChargement();
    this.onLoadFragmentScanManuelUm();   //LOT 15 -> Chargement Manuel Scan

  //------------------------------------------------------------------------------------------------------------------------------//
  //          HANDLER fin de chargement  => Pour fermer la boîte de dialogue de saisie des motifs de non chargement            //                                                                                    //  
  //------------------------------------------------------------------------------------------------------------------------------//
    this.getOwnerComponent()?.getEventBus().subscribe("Default",application_events_enum.chargement_end_event,(channel:string,event:string,data: Object) => {           
      this.dialogMotifsNoCharg.close();
        },this);

  //------------------------------------------------------------------------------------------------------------------------------//
  //           LOT15:  HANDLER pour fermer la boîte de dialogue de scan manuel d'UM                                                //                                                                                    //  
  //------------------------------------------------------------------------------------------------------------------------------//
    this.getOwnerComponent()?.getEventBus().subscribe("Default", application_events_enum.close_manualscanpopup_event,(channel:string,event:string,data: Object) => {           
      this.dialogScanManuelUm.close();
        },this);
  }

  public onAfterRendering(): void {
    }

  public onSelectDialogUmFauxCam(event: Button$PressEvent): void {
      let iconTahBar : IconTabBar =  this.getView()?.getParent() as IconTabBar;
      let  lv_quai: string = iconTahBar.getSelectedKey();
      let  lv_quai_number: number = Number(lv_quai.substring( lv_quai.length-2, lv_quai.length));
      let  lv_indicejson_quai: number = lv_quai_number-8;
      let lv_length : number = event.getSource().toString().length;
      let postenocharge_indice = event.getSource().toString().charAt(lv_length-1);
      //console.log("postenocharge_indice" + postenocharge_indice);
      this.dialog.setBindingContext(this.getOwnerComponent()?.getModel("chargementModelJson")?.createBindingContext("/results/" + lv_indicejson_quai + "/tPosteNocharge/" + postenocharge_indice + "/") as Context,"chargementModelJson")
      this.dialog.open();
  }

public onSelectDialogUmStockPress(event: Button$PressEvent): void {
  //console.log(event.getSource().getParent()?.getBindingContext("chargementModelJson")?.getProperty("codart")  );
  let lv_material : string = event.getSource().getParent()?.getBindingContext("chargementModelJson")?.getProperty("codart") 
  let data : {material:String} = { material: lv_material }               
  this.getOwnerComponent()?.getEventBus().publish("Default", "LoadMaterialUmStockListEvent", data);
  this.dialogUmStock.open();
  }

  //--------------------------------------------------------------------------------------------------------------------------
  //LOT 13 : Handler du bouton de validation de fin de chargement
  //---------------------------------------------------------------------------------------------------------------------------
  public onPressButtonFinCharg(event: Button$PressEvent): void {
      let iconTahBar : IconTabBar =  this.getView()?.getParent() as IconTabBar;
      let  lv_quai: string = iconTahBar.getSelectedKey();
      let  lv_quai_number: number = Number(lv_quai.substring( lv_quai.length-2, lv_quai.length));
      let  lv_indicejson_quai: number = lv_quai_number-8;
    
    // B-Récupération du numéro de transport du quai à partir de l'index json du quai  
    let lv_numtransport:string = this.getOwnerComponent()?.getModel("chargementModelJson")?.getProperty("/results/" + lv_indicejson_quai.toString() + "/numtransport", undefined)
   // console.log("P1 HIGH LOT 13 POPUP Motifs non chargement Valeur du transport= " +  lv_numtransport+  "/QUAI=" + lv_quai_number); 
    let data : {quai:string, transport:string} = { quai:  lv_quai, transport: lv_numtransport } 
    // Récupération des motifs de non chargement dans l'API REST              
    this.getOwnerComponent()?.getEventBus().publish("Default",application_events_enum.chargemen_end_motifsNch_event , data);
    // Ouverture de la boîte de dialogue de saisie des motifs de non chargement
    this.dialogMotifsNoCharg.open();
  }

  //--------------------------------------------------------------------------------------------------------------------------
  //          LOT 13 : Confirmation fin de chargement
  //---------------------------------------------------------------------------------------------------------------------------
  public onconfirmMotifsNch(event: Button$PressEvent): void {
    // Envoi d'un event pour appel de l'API de fin de chargement                
    this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.chargemen_end_motifsNch_post_event);
  }
 //--------------------------------------------------------------------------------------------------------------------------
 //           LOT 13 : Fin de chargement//Sélection des motifs de non chargement
 //---------------------------------------------------------------------------------------------------------------------------
  public onMotifNchCmbBoxSelectionChange(event: ComboBox$SelectionChangeEvent): void 
  { 
    //TO REVIEW BEGIN
    let finChargementQuaiModelJSON : JSONModel = this.getOwnerComponent()?.getModel("finChargementQuaiModelJSON") as JSONModel;
    finChargementQuaiModelJSON.setProperty( event.getSource().getParent()?.getBindingContext("finChargementQuaiModelJSON") + "/codmot", event.getParameter("selectedItem")?.getKey());
    finChargementQuaiModelJSON.setProperty( event.getSource().getParent()?.getBindingContext("finChargementQuaiModelJSON") + "/libmot", event.getParameter("selectedItem")?.getText());
    let cmbbox = event.getParameter("selectedItem")?.getParent() as ComboBox;
    cmbbox.setValueState("Success");
    //TO REVIEW END
  }

  //---------------------------------------------------------------------
  //LOT 15 : Appel de la boîte de dialogue Chargement manuel scan
  //---------------------------------------------------------------------
  public onScanManuelUm(event: Button$PressEvent): void {
  let iconTahBar : IconTabBar =  this.getView()?.getParent() as IconTabBar;                      //CODE REVIEW
  let  lv_quai: string = iconTahBar.getSelectedKey();
  let  lv_quai_number: number = Number(lv_quai.substring(lv_quai.length-2, lv_quai.length));
  let  lv_indicejson_quai: number = lv_quai_number-8;
    
  let data : {quai:string} = { quai:  lv_quai } 
  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.chargement_um_get_event,  data);
  //Suppression des messages d'erreurs des scans manuels précédents
  let validationMsgChargementQuaiModel : JSONModel = this.getOwnerComponent()?.getModel("notificationsQuaisModel") as JSONModel;
  validationMsgChargementQuaiModel.setProperty("/quais/" + lv_indicejson_quai + "/notifs/notifsuccess_scanmanuelum/msg_txt", "") ;
  validationMsgChargementQuaiModel.setProperty("/quais/" + lv_indicejson_quai + "/notifs/notifsuccess_scanmanuelum/visible", false) ;

  validationMsgChargementQuaiModel.setProperty("/quais/" + lv_indicejson_quai + "/notifs/notiferror_scanmanuelum/msg_txt", "") ;
  validationMsgChargementQuaiModel.setProperty("/quais/" + lv_indicejson_quai + "/notifs/notiferror_scanmanuelum/visible", false) ;
  //Faire pointer la boîte de dialogue sur le noeud correspondant au quai en cours
  this.dialogScanManuelUm.setBindingContext(this.getOwnerComponent()?.getModel("notificationsQuaisModel")?.createBindingContext("/quais/" + lv_indicejson_quai + "/") as Context,"notificationsQuaisModel");  
  //E- Ouverture de la boîte de dialogue dialogScanManuelUm
  this.dialogScanManuelUm.open();
  // Essayer de mettre le focus sur le champ de saisie
  //this.byId("InputUmScan")?.focus();
    }

  //----------------------------------------------------------------------------------------------------------------------------------------------------//
  //------------------- LOT 15 BEGIN SCAN MANUEL DES UMS  ----------------------------------------------------------------------------------------------//  
  //----------------------------------------------------------------------------------------------------------------------------------------------------//
 public onSubmitUm(event:Input$SubmitEvent):void {
  let ChargementUmModel: JSONModel =   this.getOwnerComponent()?.getModel( "ChargementUmModel") as JSONModel;
  let input_data:any = ChargementUmModel.getData();
  let data : {quai:string, codum :string, msgid:string, aenam:string, errdt:string, errzt :string, choice:string} =
     { quai: input_data.quai1, codum : input_data.codum,  msgid: '', aenam : '', errdt: '', errzt: '', choice : ''}
  console.log("----------P1 HIGH LOT 15 Appel du post de chargement UM-----VALEUR DU QUAI= " + input_data.quai1  + " Valeur de l'UM= " + input_data.codum);
  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.chargement_um_post_event, data);
  let data2 : {quai:string} = { quai:  input_data.quai1 } 
  this.getOwnerComponent()?.getEventBus().publish("Default", application_events_enum.chargement_um_get_event,  data2);
 }
  
 async onOpenDialog(): Promise<void> {
  this.dialog ??= await this.loadFragment({
      name: "clf.logistique.chargementquais.view.fragment.DialogUmFaucam"
  }) as Dialog;
  this.dialog.setModel(this.getOwnerComponent()?.getModel("chargementModelJson"),"chargementModelJson");
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

}