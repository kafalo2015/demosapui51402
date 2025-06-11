import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import Event from "sap/ui/base/Event";
import Button from "sap/m/Button";
import NavContainer from "sap/m/NavContainer";
import Page from "sap/m/Page";


/**
 * @namespace clf.demo.sapui51402.demosapui51402.controller
 */
export default class TestApp extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

    }
    public onAfterRendering(): void {
        this.getOwnerComponent()?.getModel("testModel")?.refresh();
        console.log("OnAfterRendering de la vue test OData:" + this.getOwnerComponent()?.getModel("testModel")?.toString() );
     }


    


   public  onShowHello(): void {
        // show a native JavaScript alert
        console.log("Hello World");
     }
       
   
          public onNavigationFinished(event: Event) : void {
                 // var toPage = evt.getParameter("to");
                  //MessageToast.show("Navigation to page '" + toPage.getTitle() + "' finished");
              }

    handleNav(event: Event): void {
            const navCon = this.byId("navCon") as NavContainer;
       
            const item = event.getSource() as Button;
            const target = item.data("target");
            console.log("Log OnPress : " + target);
           // if (target) {
               // var animation = this.byId("animationSelect").getSelectedKey();
               //navCon.to(this.byId(target));

               navCon.to(this.byId(target) as Page);
               
            //} else {
               // navCon.back();
            //}
           
        }     


}