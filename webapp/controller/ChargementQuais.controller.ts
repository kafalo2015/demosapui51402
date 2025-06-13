import Controller from "sap/ui/core/mvc/Controller";
import Table from "sap/m/Table";
import { Sticky } from "sap/m/library";
import Dialog from "sap/m/Dialog";
import Context from "sap/ui/model/Context";
import Button, { Button$PressEvent } from "sap/m/Button";

/**
 * @namespace clf.demo.sapui51402.demosapui51402.controller
 */
export default class ChargementQuais extends Controller {

  private dialog: Dialog;
  private dialogUmStock: Dialog;

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
      }

    public onAfterRendering(): void {
       
    }

     public onSelectDialogPress(event: Button$PressEvent): void {
      console.log("Event press UM postes non chargés :" + event.getSource());
      let lv_quai:string = "01";
      // TODO => Créer un loop sur l'ensemble des quais pour remplir les indices de binding 
      if (event.getSource().toString().includes("quai8") === true )  { lv_quai = '0'};
      if (event.getSource().toString().includes("quai9") === true )  { lv_quai = '1'};
      if (event.getSource().toString().includes("quai10") === true ) { lv_quai = '2'};
      if (event.getSource().toString().includes("quai11") === true ) { lv_quai = '3'};
      if (event.getSource().toString().includes("quai12") === true ) { lv_quai = '4'};
      if (event.getSource().toString().includes("quai13") === true ) { lv_quai = '6'};
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

     async onOpenDialog(): Promise<void> {
          this.dialog ??= await this.loadFragment({
             name: "clf.demo.sapui51402.demosapui51402.view.fragment.DialogUmFaucam"
          }) as Dialog;
          this.dialog.setModel(this.getOwnerComponent()?.getModel("chargementModelJson"),"chargementModelJson");
        }  
      async onLoadFragmentUmStock(): Promise<void> {
          this.dialogUmStock ??= await this.loadFragment({
             name: "clf.demo.sapui51402.demosapui51402.view.fragment.DialogUmStock"
          }) as Dialog;
          //this.dialog.setModel(this.getOwnerComponent()?.getModel("MaterialUmStockListModel"),"MaterialUmStockListModel");
        }  
}