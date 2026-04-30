import Controller from "sap/ui/core/mvc/Controller"; import UIComponent from "sap/ui/core/UIComponent";
import History from "sap/ui/core/routing/History";


/**
 * @namespace clf.logistique.chargementquais.controller.error
 */
export default class NotFound extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

    }

    public onAfterRendering(): void {
    
    }

    public onNavBack(): void {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
            window.history.go(-1);
        } else {
            const oRouter = UIComponent.getRouterFor(this);
            // On redirige vers la route par défaut (la liste des chargements par exemple)
            oRouter.navTo("RouteChargementPrevus", {}, true);
        }

    }

  
}