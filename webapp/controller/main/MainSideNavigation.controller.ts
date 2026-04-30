import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import Dialog from "sap/m/Dialog";
import SideNavigation, { SideNavigation$ItemSelectEvent } from "sap/tnt/SideNavigation";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace clf.logistique.chargementquais.controller
 */
export default class MainSideNavigation extends Controller {

  private dialog!: Dialog;

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
    /* Code pour ouvrir une boîte de Dialogue de Chargement au moment de la sélection d'une Date dans le Date Picker (OBSOLETE) 
    // Ce type de code sera peut être à remettre en place au moment du rafraichissement de la liste des quais si l'appli mets du temps
    //  à retourner des résultats 
       this.onOpenDialog();*/

  // Enregistrement d'un handler pour la fin d'un chargement   // TODO 11/25 -> Voir à quoi ce handler sert?
  this.getOwnerComponent()?.getEventBus().subscribe("Default","SidenavigationsetSelectedItemEvent",(channel:string,event:string,data: Object) => {           
           let SideNavigationControl : SideNavigation = this.getView()?.byId("sideNavigation") as SideNavigation;
           SideNavigationControl.setSelectedItem("container-clf.logistique.chargementquais---App--item_quai_all");
    },this);  

    }
    public onAfterRendering(): void {     
       
     }

    // async onOpenDialog(): Promise<void> {
    //   this.dialog ??= await this.loadFragment({
    //      name: "clf.demo.sapui51402.demosapui51402.view.Busy"
    //   }) as Dialog;
     // this.dialog.open();
    // }  

    onCloseDialog(): void {
      // note: We don't need to chain to the pDialog promise, since this event-handler
      // is only called from within the loaded dialog itself.
      //(this.byId("busyDialog") as Dialog)?.close();
    }    

     public onCollapseExpandPress() {
      const oSideNavigation = this.byId("sideNavigation") as SideNavigation;
      let bExpanded:boolean = oSideNavigation.getExpanded();
      oSideNavigation.setExpanded(!bExpanded);
    }

  public itemSelect(event:SideNavigation$ItemSelectEvent)  {
   //  console.log("P1 VERY HIGH/------------------------------------------ CONTROLLEUR MainSideNavigation->METHODE Item select------------------------------------------------------ ");
     const router = UIComponent.getRouterFor(this);
     let ChargementQuaiModel : JSONModel = this.getOwnerComponent()?.getModel("chargementModelJson") as JSONModel;
  
    if ( event.getParameter("item")?.getKey() == "item_quai_all" )           //TODO-> Utiliser plutôt l'ID 
    { 
      let indice_json : number = 0;      // Indice JSON du quai 8 (indice = 0  [Numéeo de QUAI -8])                                                                       // Le quai 8 est affiché lorsque l'utilisateur clique sur Chargements par quais et l'indice json du quai 8 est 0
      let encours : boolean = ChargementQuaiModel.getObject("/results/" + indice_json + "/chargementEncours");
       //-------------------- END On récupère dans le modèle si le quai 8 est cours de chargement -----------------------------------------------------------------------------------------------------------------------------//
       if (encours == true)                                                                                   // Si le quai 8 est en cours de chargement alors on affiche la vue du quai 8 sinon on affiche le formulaire de démarrage de chargement
        {         router.navTo("RouteChargementQuai", {quainumber: "8"});  }   
       else
        { router.navTo("RouteChargementStart", {quainumber: "8"});}
    }
      
     if (  event.getParameter("item")?.getKey() == "item_chargement_list" ) { router.navTo("RouteChargementList");}
    
  }

}