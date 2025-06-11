import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import Event from "sap/ui/base/Event";
import Button from "sap/m/Button";
import NavContainer from "sap/m/NavContainer";
import Page from "sap/m/Page";
import { DatePicker$ChangeEvent } from "sap/m/DatePicker";
import UIComponent from "sap/ui/core/UIComponent";
import { Table$RowSelectionChangeEvent } from "sap/ui/table/Table";
import Dialog from "sap/m/Dialog";
import SideNavigation from "sap/tnt/SideNavigation";


/**
 * @namespace clf.demo.sapui51402.demosapui51402.controller
 */
export default class Main extends Controller {

  private dialog: Dialog;

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
      this.onOpenDialog();


  // Enregistrement d'un handler pour la fin d'un chargeemnt
  this.getOwnerComponent()?.getEventBus().subscribe("Default","chargementFinishedEvent",(channel:string,event:string,data: Object) => {           

    this.dialog.close();
    console.log("Fermeture du Busy Dialog de chargement")
    },this); 

    }
    public onAfterRendering(): void {
       
     }

     public onNavigationFinished(event: Event) : void {
       // var toPage = evt.getParameter("to");
        //MessageToast.show("Navigation to page '" + toPage.getTitle() + "' finished");
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
        console.log("Date Sélection dans handleChange :" + this.getOwnerComponent()?.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement"))
      // Attaches an event handler to the event with the given identifier on the given event channel            
/*getOwnerComponent().getEventBus().subscribe("Default", "myEventId", () => {
    
});
// Fires an event using the specified settings and notifies all attached event handlers.
this.getOwnerComponent().getEventBus().publish("Default", "myEventId", {});*/
 // this.getOwnerComponent()?.getEventBus().subscribe("Default","chargementEvent",() => { });
let valuedatepicker :string;
valuedatepicker = event.getParameter("value") as any;
console.log("Valeur du date picking sans binding" + valuedatepicker);

// Essai ouverture fragment
  this.dialog.open();
  this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {});
  //setTimeout(() => {
  //  this.dialog.close();
  //}, 5000);
  
 
    }     

    handleNav(event: Event): void {
            const navCon = this.byId("navContainerMain") as NavContainer;
            const item = event.getSource() as Button;
            const target = item.data("target");
           // if (target) {     
              // navCon.to(this.byId(target) as Page);
            //} else {
               // navCon.back();
            //}
         // Navigation par routing au lieu du navCon.to()    -> Voir comment récupérer le router à partir du controlleur de la vue
         // Attention ne pas confondre la méthode router.navTo() et getTargets().display(target)

         // TODO->Ce code doit être modifé

         const router = UIComponent.getRouterFor(this);
         console.log("Target : " + target);
         if ( target == "pageChargList" ) { console.log("Rechargement de la list ")   ;router.getTargets()?.display("TargetChargementList");}

          // TODO->Ce code doit être modifé-> Il ne faut pas charger le quai 10 mais le quai sélectionné dans les FilterTabBar
         //if ( target == "pageChargementQuai" ){ console.log("Rechargement des quais ");router.getTargets()?.display("TargetChargementQuai10"); }
      //let data : {quai:String} = {
       // quai: lv_quai              
      //};
      if ( target == "pageChargementQuai" ){ this.getOwnerComponent()?.getEventBus().publish("Default", "chargementQuaiButtonEvent"); }
           
        }    
    
     public onselectionChange(event:Table$RowSelectionChangeEvent)
     {

     }

}