import Controller from "sap/ui/core/mvc/Controller";
import Table from "sap/m/Table";
import { Sticky } from "sap/m/library";
import Dialog from "sap/m/Dialog";
import Context from "sap/ui/model/Context";
import Button, { Button$PressEvent } from "sap/m/Button";
import IconTabBar, { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import Input, { Input$SubmitEvent } from "sap/m/Input";

/**
 * @namespace clf.logistique.chargementquais.controller
 */
export default class QuaiChargementStart extends Controller {
    /*eslint-disable @typescript-eslint/no-empty-function*/
  public onInit(): void {         
      }

  public onAfterRendering(): void {
    }
  public onClickChargementQuai(event: Button$PressEvent): void {
       // ----------TODO RAJOUTER Contrôle de saisie                   -------------------
      let lv_matriculeTabularInput : Input = this.getView()?.byId("MatriculeTabularInput") as Input;
      
      if  (lv_matriculeTabularInput.getValue() == "") {  lv_matriculeTabularInput.setValueState("Error")    }
      else                                            {  lv_matriculeTabularInput.setValueState("None")    }

      let lv_tknumTabularInput : Input = this.getView()?.byId("tknumTabularInput") as Input;
      
      if  (lv_tknumTabularInput.getValue() == "") {  lv_tknumTabularInput.setValueState("Error")    }
      else                                        {  lv_tknumTabularInput.setValueState("None")    }

      console.log("CLICK SUR BOUTON CHARGEMENT QUAI:" +event.getSource().toString());
      console.log("P1 Récupération du quai : "  + this.getView()?.getParent());
      let iconTahBar : IconTabBar =  this.getView()?.getParent() as IconTabBar;
      console.log("P1 SELECTED KEY OF QUAI : " + iconTahBar.getSelectedKey());
      let data : {quai:String} = { quai: iconTahBar.getSelectedKey() }
      this.getOwnerComponent()?.getEventBus().publish("Default", "chargementStartEvent", data);
    }

  public onSuggestionItemSelected(event: Input$SubmitEvent): void {

       let lv_matriculeTabularInput : Input = this.getView()?.byId("MatriculeTabularInput") as Input;
      
      if  (lv_matriculeTabularInput.getValue() == "") {  lv_matriculeTabularInput.setValueState("Error")    }
      else                                            {  lv_matriculeTabularInput.setValueState("None")    }

      let lv_tknumTabularInput : Input = this.getView()?.byId("tknumTabularInput") as Input;
      
      if  (lv_tknumTabularInput.getValue() == "") {  lv_tknumTabularInput.setValueState("Error")    }
      else                                        {  lv_tknumTabularInput.setValueState("None")    }
    }

 public onSubmit(event: Input$SubmitEvent): void {

       let lv_matriculeTabularInput : Input = this.getView()?.byId("MatriculeTabularInput") as Input;
      
      if  (lv_matriculeTabularInput.getValue() == "") {  lv_matriculeTabularInput.setValueState("Error")    }
      else                                            {  lv_matriculeTabularInput.setValueState("None")    }

      let lv_tknumTabularInput : Input = this.getView()?.byId("tknumTabularInput") as Input;
      
      if  (lv_tknumTabularInput.getValue() == "") {  lv_tknumTabularInput.setValueState("Error")    }
      else                                        {  lv_tknumTabularInput.setValueState("None")    }
    }
    
}