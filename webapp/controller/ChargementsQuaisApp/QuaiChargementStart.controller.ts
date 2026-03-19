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

  enum application_events_enum {
  chargement_quais_event = "chargementEvent",
  chargement_prevus_event = "chargementListEvent",
  validation_msg_chargement_event = "validationMsgChargementEvent",
  chargement_um_get_event = "ChargementUMGetEvent",
  chargement_um_post_event = "ChargementUmPostEvent",
  chargement_start_get_event = "chargementStartModelGetEvent",
  chargement_start_post_event = "chargementStartEvent",
  chargement_end_event = "finChargementEvent",
  notification_websocket_event = "notificationWebSocketEvent",
  validation_dialog_event = "validationDialogEvent",
}

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

      let iconTahBar : IconTabBar =  this.getView()?.getParent() as IconTabBar;
      let data : {quai:String} = { quai: iconTahBar.getSelectedKey() }
      this.getOwnerComponent()?.getEventBus().publish("Default",  application_events_enum.chargement_start_post_event, data);
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