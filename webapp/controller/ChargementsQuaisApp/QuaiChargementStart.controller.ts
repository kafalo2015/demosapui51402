import Controller from "sap/ui/core/mvc/Controller";
import Button, { Button$PressEvent } from "sap/m/Button";
import IconTabBar, { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import Input, { Input$SubmitEvent } from "sap/m/Input";
import Element from "sap/ui/core/Element";
import { IChargementStartPayload } from "../../model/Interfaces";
import { application_events_enum } from "../../model/Enums";

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

      //let iconTahBar : IconTabBar =  this.getView()?.getParent() as IconTabBar;   // Ne fonctionne plus car il y a un container de plus pour la transition entre quais
      // GEMINI Autre possibilité utiliser la variable globale gv_current_quai
      const iconTabBar : IconTabBar = Element.getElementById("container-clf.logistique.chargementquais---AppChargementQuaisIconTabBar--idIconTabBarQuais")  as IconTabBar;
    
    // BEGIN GEMINI[Amélioration] Typage du payload
     // let data : {quai:String} = { quai: iconTabBar.getSelectedKey() };
      const oPayload:  IChargementStartPayload = {
          quai: iconTabBar.getSelectedKey(),
      };
          // BEGIN GEMINI[Amélioration] Typage du payload

        // GEMINI LOT 20/21 21/04/2026 [Criticité 1] -> Eviter le double-clic sur bouton 'Démarrer Chargement' -> A quel moment il faut réactiver le bouton Démarrger Chargement?
    ( this.byId("Btn_Start_Chargement") as Button).setEnabled(false);

      this.getOwnerComponent()?.getEventBus().publish("Default",  application_events_enum.chargement_start_post_event, oPayload);
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