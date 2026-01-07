import Controller from "sap/ui/core/mvc/Controller";
import Table from "sap/m/Table";
import { Sticky } from "sap/m/library";
import Dialog from "sap/m/Dialog";
import Context from "sap/ui/model/Context";
import Button, { Button$PressEvent } from "sap/m/Button";
import ManagedObject from "sap/ui/base/ManagedObject";
import { ComboBox$ChangeEvent, ComboBox$SelectionChangeEvent } from "sap/m/ComboBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import ContextBinding from "sap/ui/model/ContextBinding";

/**
 * @namespace clf.logistique.chargementquais.controller
 */
export default class ChargementQuais extends Controller {

  private dialog: Dialog;
  private dialogUmStock: Dialog;
  //------------------------------------------
  // LOT 13: Fin de chargement    // Attention ne pas forcement mettre le load fragment de le init du controller mais plutôt dans le handler du bouton
  //------------------------------------------
  private dialogMotifsNoCharg: Dialog;

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

     this.onOpenDialog();
     this.onLoadFragmentUmStock();
     //------------------------------------------
     // LOT 13: Fin de chargement    // Attention ne pas forcement mettre le load fragment de le init du controller mais plutôt dans le handler du bouton
     //------------------------------------------
     this.onLoadFragmentMotifsNonChargement();
      }

    public onAfterRendering(): void {
       
    }

     public onSelectDialogUmFauxCam(event: Button$PressEvent): void {
      console.log("Event press UM postes non chargés :" + event.getSource());
      let lv_quai:string = "01";
      console.log("event onSelectDialogUmFauxCam .getSource().toString()" + event.getSource().toString());
      // TODO => Créer un loop sur l'ensemble des quais pour remplir les indices de binding 
      if (event.getSource().toString().includes("quai8") === true )  { lv_quai = '0' ;  
                                                                       console.log("onSelectDialogUmFauxCam SOURCE BUTTON = QUAI8"); };
      if (event.getSource().toString().includes("quai9") === true )  { lv_quai = '1'};
      if (event.getSource().toString().includes("quai10") === true ) { lv_quai = '2'};
      if (event.getSource().toString().includes("quai11") === true ) { lv_quai = '3'};
      if (event.getSource().toString().includes("quai12") === true ) { lv_quai = '4'};
      if (event.getSource().toString().includes("quai13") === true ) { lv_quai = '5'};
      if (event.getSource().toString().includes("quai14") === true ) { lv_quai = '6'};
      if (event.getSource().toString().includes("quai15") === true ) { lv_quai = '7'};

      let lv_length : number = event.getSource().toString().length;
      let postenocharge_indice = event.getSource().toString().charAt(lv_length-1);
       console.log("postenocharge_indice" + postenocharge_indice);
       this.dialog.setBindingContext(this.getOwnerComponent()?.getModel("chargementModelJson")?.createBindingContext("/results/" + lv_quai + "/tPosteNocharge/" + postenocharge_indice + "/") as Context,"chargementModelJson")
       this.dialog.open();
    }

      public onSelectDialogUmStockPress(event: Button$PressEvent): void {
          console.log(event.getSource().getParent()?.getBindingContext("chargementModelJson")?.getProperty("codart")  );
          let lv_material : string = event.getSource().getParent()?.getBindingContext("chargementModelJson")?.getProperty("codart") 
          let data : {material:String} = { material: lv_material }               
          this.getOwnerComponent()?.getEventBus().publish("Default", "LoadMaterialUmStockListEvent", data);
          this.dialogUmStock.open();
         }


         //---------------------------------------------------------------------
         //LOT 13 : Handler du bouton de validation de fin de chargement
         //---------------------------------------------------------------------
         public onPressButtonFinCharg(event: Button$PressEvent): void {
         // TODO -> appel de récupération des motifs de non chargement
         //console.log(event.getSource().getParent()?.getBindingContext("chargementModelJson")?.getProperty("codart")  );
        //let lv_material : string = event.getSource().getParent()?.getBindingContext("chargementModelJson")?.getProperty("codart") 


         //console.log("P1 HIGH LOT 13 POPUP Motifs non chargement:" + event.getSource().getParent()?.getBindingPath() );
         console.log("P1 HIGH LOT 13 POPUP Motifs non chargement Valeur du transport du quai" + this.getOwnerComponent()?.getModel("chargementModelJson")?.getProperty("/results/4/numtransport", undefined));
        // let lv_quai : string = event.getSource().getParent()?.getBindi.getProperty("quai");
         //let lv_quai_view : ManagedObject = event.getSource().getParent().;
      
          let  lv_source_id_length = event.getSource().getId().length;
          
          //console.log("P1 HIGH LOT 13 POPUP Motifs non chargement Valeur du transport du quai" +  ) ;
      
          let  lv_quai_number: number = Number(event.getSource().getId().substring( lv_source_id_length-2, lv_source_id_length));
          let  lv_indicejson_quai: number = lv_quai_number-8;
          
        let lv_numtransport:string = this.getOwnerComponent()?.getModel("chargementModelJson")?.getProperty("/results/" + lv_indicejson_quai.toString() + "/numtransport", undefined)

        console.log("P1 HIGH LOT 13 POPUP Motifs non chargement Valeur du transport= " +  lv_numtransport+  "/QUAI=" + lv_quai_number); 
        // console.log("P1 HIGH LOT 13 POPUP Motifs non chargement: Valeur du quai = " + lv_quai + "/Valeur de transport= " + lv_numtransport);
          // TODO => Récupérer le quai et le numéro de transport dans le contexte
          let data : {quai:string, transport:string} = { quai: lv_quai_number.toString(), transport: lv_numtransport }               
           this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEndMotifsNchEvent", data);
          this.dialogMotifsNoCharg.open();
         }

      public onconfirmMotifsNch(event: Button$PressEvent): void {
        // console.log("LOT13 P1 HIGH POST des motifs de non chargement");
        // let  lv_source_id_length = event.getSource().getId().length;
        // let  lv_quai_number: number = Number(event.getSource().getId().substring( lv_source_id_length-2, lv_source_id_length));
        // let  lv_indicejson_quai: number = lv_quai_number-8;
        // let lv_numtransport:string = this.getOwnerComponent()?.getModel("chargementModelJson")?.getProperty("/results/" + lv_indicejson_quai.toString() + "/numtransport", undefined)
        // console.log("P1 HIGH LOT 13 POST Motifs non chargement Valeur du transport= " +  lv_numtransport+  "/QUAI=" + lv_quai_number); 
        //let data : {quai:string, transport:string} = { quai: lv_quai_number.toString(), transport: lv_numtransport }               
        this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEndMotifsNchPostEvent");
      }


       public onMotifNchCmbBoxSelectionChange(event: ComboBox$SelectionChangeEvent): void 
        {
          console.log("LOT13 P1 Handler onMotifNchCmbBoxSelectionChange() ITEM:" + event.getParameter("selectedItem")?.getKey());
          console.log("LOT13 P1 Handler onMotifNchCmbBoxSelectionChange() Binding path:" + event.getSource().getParent()?.getBindingContext("finChargementQuaiModelJSON"));
           // Récupération du modèle de notifications des quais (Messages de validation par quai)
          // let context : Context = event.getSource().getParent()?.getBindingContext("finChargementQuaiModelJSON");
           let finChargementQuaiModelJSON : JSONModel = this.getOwnerComponent()?.getModel("finChargementQuaiModelJSON") as JSONModel;
           finChargementQuaiModelJSON.setProperty( event.getSource().getParent()?.getBindingContext("finChargementQuaiModelJSON") + "/codmot", event.getParameter("selectedItem")?.getKey());
           finChargementQuaiModelJSON.setProperty( event.getSource().getParent()?.getBindingContext("finChargementQuaiModelJSON") + "/libmot", event.getParameter("selectedItem")?.getProperty("text"));
        }

        public onMotifNchCmbBoxChange(event: ComboBox$ChangeEvent): void 
        {
          // let item  = event.getParameter("itemPressed");
          //           console.log("LOT13 P1 Handler onMotifNchCmbBoxSelectionChange() ITEM:" + item);
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
          //this.dialog.setModel(this.getOwnerComponent()?.getModel("MaterialUmStockListModel"),"MaterialUmStockListModel");
        }  
        async onLoadFragmentMotifsNonChargement(): Promise<void> {
          this.dialogMotifsNoCharg ??= await this.loadFragment({
             name: "clf.logistique.chargementquais.view.fragment.DialogMotifsNonCharg"                               //TODO LOT13  Créer un nouveau fragment pour la boîte de dialogue de saisie des motifs de non chargement
          }) as Dialog;
          //this.dialog.setModel(this.getOwnerComponent()?.getModel("MaterialUmStockListModel"),"MaterialUmStockListModel");
        }   

}