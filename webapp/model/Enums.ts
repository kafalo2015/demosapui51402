/**
 * @namespace clf.logistique.chargementquais.model
 */

    export enum environment_enum {
localhost = "localhost",       
  dev = "dev",
  test = "exc",
  preprod = "preprod",
  prod = "prod",
}

   export enum sapserver_url_enum {
  dev_url = "sapdev.exaclair.eu",
  test_url = "sapqual.exaclair.eu",
  preprod_url = "sappreprod.exaclair.eu",                               //TODO => Récupérer URL de SAP PréProd
  prod_url = "sapprod.exaclair.eu",
}

   export enum restapi_websocket_path_enum {
  chargementquais = "/sap/bc/gui/sap/its/zpcf_chargement/chargement",
  validation_chargement = "/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement",
  chargement_prevus = "/sap/bc/gui/sap/its/zpcf_chargement/chargement_list",                               
  start_chargement = "/sap/bc/gui/sap/its/zpcf_chargement/start_chargement",
  end_chargement = "/sap/bc/gui/sap/its/zpcf_chargement/end_chargement",
  material_umstock_list = "/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list",                               
  chargement_um = "/sap/bc/gui/sap/its/zpcf_chargement/chargement_um",
  websocket_ychargement_camion_poc = "/sap/bc/apc/sap/ychargement_camion_poc",
}

     export enum application_names_enum {
  chargementsPrevus = "ChargementsPrevusApp",
  chargementsQuais = "ChargementsQuaisApp",
}

    export enum action_code_enum {
  chargement = "chargement",
  dechargement = "dechargement",
  start_chargement ="startchargement",
  fin_chargement = "finchargement",
}

  export enum AppRoutes {
    ChargementQuai = "RouteChargementQuai",
    ChargementStart = "RouteChargementStart"
} 
export enum application_events_enum {
 
  chargement_quais_event = "chargementEvent",
  chargement_prevus_event = "chargementListEvent",
  validation_msg_chargement_event = "validationMsgChargementEvent",
  chargement_um_get_event = "ChargementUMGetEvent",
  chargement_um_post_event = "ChargementUmPostEvent",
  chargement_start_get_event = "chargementStartModelGetEvent",
   chargement_start_post_event = "chargementStartPostEvent",
  chargemen_end_motifsNch_get_event ="chargementEndMotifsNchEvent",
  chargemen_end_motifsNch_post_event = "chargementEndMotifsNchPostEvent",
  chargement_end_event = "finChargementEvent",
  notification_websocket_event = "notificationWebSocketEvent",
  validation_dialog_event = "validationDialogEvent",
  close_manualscanpopup_event = 'CloseManualScanPopupEvent',
  changement_quai_event = "changementQuaiEvent",
  load_materialStock_event = "LoadMaterialUmStockListEvent",
  notification_webSocket_event = "notificationWebSocketEvent",
  initialize_chargementStartMessageStrip_event = "InitializeChargementStartMessageStripEvent",
  }

export enum chargement_um_context {
  chargement_um_post = " chargement_um_post",
  validation_chargement_um_post = "validation_chargement_um_post",


}




