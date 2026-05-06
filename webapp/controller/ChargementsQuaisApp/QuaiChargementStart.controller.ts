import Controller from "sap/ui/core/mvc/Controller";
import Button, { Button$PressEvent } from "sap/m/Button";
import IconTabBar, { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import Input, { Input$SubmitEvent } from "sap/m/Input";
import Element from "sap/ui/core/Element";
import { IChargementStartPayload } from "../../model/Interfaces";
import { application_events_enum } from "../../model/Enums";
import JSONModel from "sap/ui/model/json/JSONModel";
import Component from "../../Component";

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
      //const iconTabBar : IconTabBar = Element.getElementById("container-clf.logistique.chargementquais---AppChargementQuaisIconTabBar--idIconTabBarQuais")  as IconTabBar;
    // BEGIN GEMINI[Amélioration] Typage du payload  + Récupération des paramètres en amont
    // let data : {quai:String} = { quai: iconTabBar.getSelectedKey() };
// ....Chargement du modèle StartChargement à la volée.....
//  GEMINI[CHECK] Contrairment à d'autres modèles qui sont déclarés dans le Manifest.json , le modèle ChargementStartModel est instancié à la volée à sa première utilisaiton
// Est-ce une bonne pratique de développement?
         if ( this.getOwnerComponent()?.getModel("ChargementStartModel") == undefined)
        {   this.getOwnerComponent()?.setModel(new JSONModel().setDefaultBindingMode("TwoWay"), "ChargementStartModel");}
// .... Modèle StartChargement....
    let ChargementStartModel :any = this.getOwnerComponent()?.getModel("ChargementStartModel") as JSONModel;
// ... Récupération du composant parent....
    const oComponent = this.getOwnerComponent() as Component;
// ... Récupération des données du formulaire de début de chargement....
    let input_data:any =  ChargementStartModel.getData() as IChargementStartPayload;   // GEMINI [Questions] Commnent créer une interface correspondant au result du modèle ChargementStartModel
// ... Création du payload de l'évènement StartChargement à partir des données du formualaire....   
    const oPayload:  IChargementStartPayload = {
        quai: oComponent.gv_current_quai,      //iconTabBar.getSelectedKey()  // Possible aussi de récupérer la variable globable du component this.gv_current_quai  // GEMINI -> Rajouter dans l'ensemble des paramètres nécessaires au démarrage du chargement (Matricule,ect) // 
        quai_number: oComponent.gv_current_quai_number,  // GEMINI[TODO] Les valeurs seraient mal mises à jour dans le component controlleur
        numtransport : input_data.results.tknum,
        matri : input_data.results.matri,
        name1 : input_data.results.name1
      };

     console.log("Affichage du payload QUAI =" + oPayload.quai + " QUAI_NUMBER = " +  oPayload.quai_number + "NUM TRANSPORT" + oPayload.numtransport  ) ;
  // BEGIN GEMINI[Amélioration] Typage du payload

        // GEMINI LOT 20/21 21/04/2026 [Criticité 1] -> Eviter le double-clic sur bouton 'Démarrer Chargement' -> A quel moment il faut réactiver le bouton Démarrger Chargement?
    //( this.byId("Btn_Start_Chargement") as Button).setEnabled(false); // GEMINI [TOCHECK] J'ai retiré car je ne suis pas à quel endroit réactive le bouton de démarrage de chargement
// ... Publication de l'évènement chargement_start_post_event
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