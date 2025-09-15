import Controller from "sap/ui/core/mvc/Controller";
import { DatePicker$ChangeEvent } from "sap/m/DatePicker";
import UIComponent from "sap/ui/core/UIComponent";
import { Table$RowSelectionChangeEvent } from "sap/ui/table/Table";
import Dialog from "sap/m/Dialog";
import SideNavigation, { SideNavigation$ItemSelectEvent } from "sap/tnt/SideNavigation";

/**
 * @namespace clf.logistique.chargementquais.controller
 */
export default class MainSideNavigation extends Controller {

  private dialog: Dialog;

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
    /* Code pour ouvrir une boîte de Dialogue de Chargement au moment de la sélection d'une Date dans le Date Picker (OBSOLETE) 
    // Ce type de code sera peut être à remettre en place au moment du rafraichissement de la liste des quais si l'appli mets du temps
    //  à retourner des résultats 
       this.onOpenDialog();*/

  // Enregistrement d'un handler pour la fin d'un chargeemnt
  this.getOwnerComponent()?.getEventBus().subscribe("Default","SidenavigationsetSelectedItemEvent",(channel:string,event:string,data: Object) => {           
   
           let SideNavigationControl : SideNavigation = this.getView()?.byId("sideNavigation") as SideNavigation;
           //let content_string : any  = this.byId("sideNavigation")?.getAggregation("item")?.;
           //let content_string_table : string[] = content_string.split("---",2 );
           //console.log("sideNavigation content_string  " + content_string);
           //console.log("sideNavigation content_string table " + content_string_table[1]);
           console.log("sideNavigation Selected Key" + SideNavigationControl.getSelectedItem());
          SideNavigationControl.setSelectedItem("container-clf.logistique.chargementquais---App--item_quai_all");
    },this);  

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
     console.log("SideNavigation$ItemSelectEvent: " +  event.getParameter("item")?.getId() );
     const router = UIComponent.getRouterFor(this);
  if ( event.getParameter("item")?.getText() == "Chargements par quais" ){  console.log("Chargement du quai 08  ")   ; router.getTargets()?.display("TargetChargementQuai08");  }   // Ajout Quai08,09++ 
  if (  event.getParameter("item")?.getText() == "Suivi Chargement" ) { console.log("Rechargement de la list ")   ;router.getTargets()?.display("TargetChargementList");}
  if (  event.getParameter("item")?.getId() == "container-clf.logistique.chargementquais---App--item_startchargement" ) { console.log("Démarrage Chargement ")   ;
                                                                                                                           this.getOwnerComponent()?.getEventBus().publish("Default", "chargementStartModelGetEvent", {}); //LOT4 => Rajouter un Get sur StartChargmentModel
    
                                                                                                                         router.getTargets()?.display("TargetChargementStart");}
    }

  

}