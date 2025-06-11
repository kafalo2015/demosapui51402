import Controller from "sap/ui/core/mvc/Controller";
import { DatePicker$ChangeEvent } from "sap/m/DatePicker";
import UIComponent from "sap/ui/core/UIComponent";
import { Table$RowSelectionChangeEvent } from "sap/ui/table/Table";
import Dialog from "sap/m/Dialog";
import SideNavigation, { SideNavigation$ItemSelectEvent } from "sap/tnt/SideNavigation";

/**
 * @namespace clf.demo.sapui51402.demosapui51402.controller
 */
export default class MainSidePanel extends Controller {

  private dialog: Dialog;

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
    /* Code pour ouvrir une boîte de Dialogue de Chargement au moment de la sélection d'une Date dans le Date Picker (OBSOLETE) 
    // Ce type de code sera peut être à remettre en place au moment du rafraichissement de la liste des quais si l'appli mets du temps
    //  à retourner des résultats 
       this.onOpenDialog();

  // Enregistrement d'un handler pour la fin d'un chargeemnt
  this.getOwnerComponent()?.getEventBus().subscribe("Default","chargementFinishedEvent",(channel:string,event:string,data: Object) => {           

    this.dialog.close();
    console.log("Fermeture du Busy Dialog de chargement")
    },this);  */

    }
    public onAfterRendering(): void {
       
     }

    async onOpenDialog(): Promise<void> {
      this.dialog ??= await this.loadFragment({
         name: "clf.demo.sapui51402.demosapui51402.view.Busy"
      }) as Dialog;
     // this.dialog.open();
    }  

    onCloseDialog(): void {
      // note: We don't need to chain to the pDialog promise, since this event-handler
      // is only called from within the loaded dialog itself.
      (this.byId("busyDialog") as Dialog)?.close();
  }    

  public handleChange(event: DatePicker$ChangeEvent): void {
  /* Code pour rafraîchir les données lorsqu'on change de date (OBSOLETE)  
  console.log("Date Sélection dans handleChange :" + this.getOwnerComponent()?.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement"))
  this.dialog.open();
  this.getOwnerComponent()?.getEventBus().publish("Default", "chargementListEvent", {});
  this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {}); */
    }     
    
     public onselectionChange(event:Table$RowSelectionChangeEvent)
     {
     }

     public onCollapseExpandPress() {
      const oSideNavigation = this.byId("sideNavigation") as SideNavigation;
      let bExpanded:boolean = oSideNavigation.getExpanded();
      oSideNavigation.setExpanded(!bExpanded);
    }

    public itemSelect(event:SideNavigation$ItemSelectEvent)  {
     console.log("SideNavigation$ItemSelectEvent: " +  event.getParameter("item")?.getText() );
     const router = UIComponent.getRouterFor(this);
  if ( event.getParameter("item")?.getText() == "Chargement des quais" ){  console.log("Chargement du quai 08  ")   ; router.getTargets()?.display("TargetChargementQuai08");  }   // Ajout Quai08,09++ 
  if (  event.getParameter("item")?.getText() == "Suivi Chargement" ) { console.log("Rechargement de la list ")   ;router.getTargets()?.display("TargetChargementList");}
 // if ( event.getParameter("item")?.getText() == "Quai 10" ){ console.log("Chargement du quai 10  ")   ; router.getTargets()?.display("TargetChargementQuai10"); }
 // if ( event.getParameter("item")?.getText() == "Quai 11" ){ router.getTargets()?.display("TargetChargementQuai11"); }
 // if ( event.getParameter("item")?.getText() == "Quai 12" ){ router.getTargets()?.display("TargetChargementQuai12"); }
 // if ( event.getParameter("item")?.getText() == "Quai 13" ){ router.getTargets()?.display("TargetChargementQuai13"); }
 // if ( event.getParameter("item")?.getText() == "Quai 14" ){ router.getTargets()?.display("TargetChargementQuai14"); }
 // if ( event.getParameter("item")?.getText() == "Quai 15" ){ router.getTargets()?.display("TargetChargementQuai15"); }
    }

  

}