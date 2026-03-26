import BaseComponent from "sap/ui/core/UIComponent";
import WebSocket, { WebSocket$MessageEvent,WebSocket$ErrorEvent } from "sap/ui/core/ws/WebSocket";
import { createDeviceModel } from "./model/models";
import DateFormat from "sap/ui/core/format/DateFormat";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import DataAnalyzer from "sap/sac/df/DataAnalyzer";
import Model$RequestCompletedEvent from "sap/ui/model/Model";
import UIComponent from "sap/ui/core/UIComponent";
 import MessageToast from "sap/m/MessageToast";
 import Dialog from "sap/m/Dialog";
 import Fragment from "sap/ui/core/Fragment"; 
import Target from "sap/ui/core/routing/Target";
import { Targets$DisplayEvent } from "sap/ui/core/routing/Targets";
import ElementBase from "sap/suite/ui/commons/networkgraph/ElementBase";


// LOT/DATE/AUTEUR/DECRIPTION
// LOT 6 => Lancement du démarrage du chargemnet à partir du quai
// LOT 7- 18/09/2025- GILLES CAMILLERI LOT 7 => Modèle de Notifications au niveau du component 
// LOT 8- 18/09/2025- GILLES CAMILLERI => Boîte de dialogue de validation de chargement
// LOT 9- 08/10/2025- GILLES CAMILLERI => Validation des messages de Warning par appel API et passage du contexte 
// LOT 10-16/10/2025- GILLES CAMILLERI => Problématique Authentification RESTAPI -> Essai pas d'authentification
// LOT 11-14/11/2025- GILLES CAMILLERI => Anomalie Popup de validation des quais s'affiche dans liste des chargements + Anomalie synchronisation routing/selected key de l'IconTabBar
// LOt 12-10/12/2025- GILLES CAMILLERI => Test déploiement php -> A REMETTRE LES APPELS AUX APIS RETIRES POUR TESTS
// LOt 13-30/12/2025-GILLES CAMILLERI => API + Popup Motif de non chargement + fin chargement
// LOt 15-29/11/2026-GILLES CAMILLERI => Scan Manuel des UMS
// LOt 16-27/02/2026-GILLES CAMILLERI => Déploiement HTTPS sur Web OPC
// LOt 17-27/02/2026-GILLES CAMILLERI => amélioration code (Enumérations environnement, url serveur sap, action_code)


//TODO Enum -> Rajouter des Enum pour les types d'erreur, les actions (chargement/dechargement), les quais, les modèles
     enum environment_enum {
localhost = "localhost",       
  dev = "dev",
  test = "exc",
  preprod = "preprod",
  prod = "prod",
}

    enum sapserver_url_enum {
  dev_url = "sapdev.exaclair.eu",
  test_url = "sapqual.exaclair.eu",
  preprod_url = "sappreprod.exaclair.eu",                               //TODO => Récupérer URL de SAP PréProd
  prod_url = "sapprod.exaclair.eu",
}

   enum restapi_websocket_path_enum {
  chargementquais = "/sap/bc/gui/sap/its/zpcf_chargement/chargement",
  validation_chargement = "/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement",
  chargement_prevus = "/sap/bc/gui/sap/its/zpcf_chargement/chargement_list",                               
  start_chargement = "/sap/bc/gui/sap/its/zpcf_chargement/start_chargement",
  end_chargement = "/sap/bc/gui/sap/its/zpcf_chargement/end_chargement",
  material_umstock_list = "/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list",                               
  chargement_um = "/sap/bc/gui/sap/its/zpcf_chargement/chargement_um",
  websocket_ychargement_camion_poc = "/sap/bc/apc/sap/ychargement_camion_poc",
}


   enum application_events_enum {
  chargement_quais_event = "chargementEvent",
  chargement_prevus_event = "chargementListEvent",
  validation_msg_chargement_event = "validationMsgChargementEvent",
  chargement_um_post_event = "ChargementUmPostEvent",
  chargement_start_get_event = "chargementStartModelGetEvent",
  chargement_end_event = "finChargementEvent",
  notification_websocket_event = "notificationWebSocketEvent",
}

     enum application_names_enum {
  chargementsPrevus = "ChargementsPrevusApp",
  chargementsQuais = "ChargementsQuaisApp",
}

     enum action_code_enum {
  chargement = "chargement",
  dechargement = "dechargement",
  start_chargement ="startchargement",
  fin_chargement = "finchargement",
}

/**
 * @namespace clf.logistique.chargementquais
 */
export default class Component extends BaseComponent {
	public static metadata = {
		manifest: "json",
        interfaces: [
            "sap.ui.core.IAsyncContentCreation"
        ]
	};
    
    public gv_environment :environment_enum;
    public gv_chargement_url : string;
    public gv_chargement_um_api_url: string;                    // URL API startchargement
    public gv_startchargement_api_url: string;                  // URL API startchargement
    public gv_endchargement_api_url: string;                    // URL API endchargement
    public gv_chargementquais_api_url: string;                  // URL API chargement des quais
    public gv_validation_msg_chargementquais_api_url: string;                                                                     //gv_validation_msg_chargementquais_api_url
    public gv_chargementprevus_api_url: string;                  // URL API Chargement prévus
    public gv_material_umstock_api_url: string;                  // URL material_umstock_list
    public gv_websocket_url: string;                             // URL Web Socket    LOT16
    public gv_current_application: string;                       // Stocke le nom de l'application actuellement affiché (Liste des chargmentn ou Chargement des quais)
   
	public init() : void {
		// call the base component's init function
		super.init();
        // Changemment de variable environnement (dev ou qual) pour appeler les API de la qual ou de la dev
         this.gv_environment = environment_enum.dev;
      
         console.log("P1 HIGH Lecture de la variable de configuration du manifest /sap.ui5/config/api_env : " +    this.gv_environment )
        // set the device model
        this.setModel(createDeviceModel(), "device");
// set i18n model
  //       const i18nModel = new ResourceModel({
  //          bundleName: "clf.logistique.chargementquais.i18n.i18n"
  //  });
        //this.setModel(i18nModel, "i18n"); 
        
        let notificationsQuaisModel = new JSONModel();
            //TODO LOT15 Scan Manuel  -> Dans le modèle JSON Faire une notification de Succès/Error séparée pour la boîte de dialogue de Scan Manuel
            let json_object : object = 
              {
    "quais": [
        {
            "quai": "quai08",
             "header": {
                "backgroundcolorset" : "ColorSet9",
                "backgroundcolorshade" : "ShadeE"
              
            },
            "um" : "",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
                "notifsuccess_scanmanuelum" : {"msg_txt": "","visible": false    },
                "notiferror_scanmanuelum"   : {"msg_txt": "","visible": false    }
            }
        },
        {
            "quai": "quai09",
             "header": {
                "backgroundcolorset" : "ColorSet9",
                "backgroundcolorshade" : "ShadeE"
            },
            "um" : "",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
                "notifsuccess_scanmanuelum" : {"msg_txt": "","visible": false    },
                "notiferror_scanmanuelum"   : {"msg_txt": "","visible": false    }
            }
        },
        {
            "quai": "quai10",
             "header": {
                "backgroundcolorset" : "ColorSet9",
                "backgroundcolorshade" : "ShadeE"
            },
            "um" : "",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
                "notifsuccess_scanmanuelum" : {"msg_txt": "","visible": false    },
                "notiferror_scanmanuelum"   : {"msg_txt": "","visible": false    }
            }
        },
        {
            "quai": "quai11",
              "header": {
                "backgroundcolorset" : "ColorSet9",
                "backgroundcolorshade" : "ShadeE"
            },
            "um" : "",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror"   : {"msg_txt": "","visible": false    },
                "notifsuccess_scanmanuelum" : {"msg_txt": "","visible": false    },
                "notiferror_scanmanuelum"   : {"msg_txt": "","visible": false    }
            }
        },
        {
            "quai": "quai12",
              "header": {
                "backgroundcolorset" : "ColorSet9",
                "backgroundcolorshade" : "ShadeE"
            },
            "um" : "",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
                "notifsuccess_scanmanuelum" : {"msg_txt": "","visible": false    },
                "notiferror_scanmanuelum"   : {"msg_txt": "","visible": false    }
            }
        },
        {
            "quai": "quai13",
            "header": {
                "backgroundcolorset" : "ColorSet9",
                "backgroundcolorshade" : "ShadeE"
            },
            "um" : "",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
                "notifsuccess_scanmanuelum" : {"msg_txt": "","visible": false    },
                "notiferror_scanmanuelum"   : {"msg_txt": "","visible": false    }
            }
        },
        {
            "quai": "quai14",
            "header": {
                "backgroundcolorset" : "ColorSet9",
                "backgroundcolorshade" : "ShadeE"
            },
            "um" : "",
             "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
                "notifsuccess_scanmanuelum" : {"msg_txt": "","visible": false    },
                "notiferror_scanmanuelum"   : {"msg_txt": "","visible": false    }
            }
        },
        {
        "quai": "quai15",
        "header": {
                "backgroundcolorset" : "ColorSet9",
                "backgroundcolorshade" : "ShadeE"
            },
         "um" : "",
           "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
                "notifsuccess_scanmanuelum" : {"msg_txt": "","visible": false    },
                "notiferror_scanmanuelum"   : {"msg_txt": "","visible": false    }
            }
        }
    ],
    "notif_txt_all": [
                           
    ],
     "chargementstartnotifs": {
              
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            },                      
};
            notificationsQuaisModel.setData(json_object);
            this.setModel(notificationsQuaisModel, "notificationsQuaisModel");

      //----------------------------------------------------------------------------------------------------------------------------//
     //               Détermination des URL des API                                                                                //  
     //----------------------------------------------------------------------------------------------------------------------------//
      this.getApiUrl();
      //----------------------------------------------------------------------------------------------------------------------------//
     //                                                                                                                            //  
     //----------------------------------------------------------------------------------------------------------------------------//
     // Abonnement à l'eventing
     //----------------------------------------------------------------------------------------------------------------------------//
     //               TODO -> Mettre tous les listeners dans une  méthode                                                            //  
     //----------------------------------------------------------------------------------------------------------------------------//
     this.getEventBus().subscribe("Default","chargementEvent",() => { 
        console.log("ChargementEvent");
        this.get_chargement_quais();
     } );

      //----------------------------------------------------------------------------------------------------------------------------//
     //               HANDLER DE  validationMsgChargementEvent                                                                                                 //  
     //----------------------------------------------------------------------------------------------------------------------------//
     this.getEventBus().subscribe("Default","validationMsgChargementEvent",() => { 
        console.log("validationMsgChargementEvent");
        this.get_validation_msg_chargements();
     } );
     //----------------------------------------------------------------------------------------------------------------//
     //               HANDLER pour Appel de l'API REST de récupération des chargements prévus                          //  
     //----------------------------------------------------------------------------------------------------------------//
     this.getEventBus().subscribe("Default","chargementListEvent",() => {       
        this.get_chargements_prevus();
     } ); 
     //----------------------------------------------------------------------------------------------------------------//
     //               HANDLER pour Start Chargment des quais                                                           //  
     //----------------------------------------------------------------------------------------------------------------//
     this.getEventBus().subscribe("Default","chargementStartEvent", (channel:string,event:string,data: Object) => { 
    console.log("chargementStartEvent"); 
       let quai :string = Object.values(data)[0];  
       this.startchargementquai_post(quai);
     }, this ); 

    //----------------------------------------------------------------------------------------------------------------//
     //         LOT13 ->  HANDLER pour ENd Chargment des quais                                                           //  
     //----------------------------------------------------------------------------------------------------------------//
     this.getEventBus().subscribe("Default","chargementEndMotifsNchEvent", (channel:string,event:string,data: Object) => { 
        console.log("chargementEndMotifsNchEvent"); 
       let lv_quai :string = Object.values(data)[0];     // TODO LOt13  => Voir comment récupérer le numéro de transport et le numéro de quais
       let lv_numtransport :string = Object.values(data)[1];     // TODO LOt13  => Voir comment récupérer le numéro de transport et le numéro de quais
       this.get_motifs_nonchargement(lv_quai,lv_numtransport);
     }, this ); 

     //----------------------------------------------------------------------------------------------------------------//
     //         LOT13 ->  HANDLER pour ENd Chargment des quais                                                         //  
     //----------------------------------------------------------------------------------------------------------------//
     this.getEventBus().subscribe("Default","chargementEndMotifsNchPostEvent", (channel:string,event:string,data: Object) => { 
        console.log("chargementEndMotifsNchEvent"); 
       let lv_quai :string = Object.values(data)[0];     // TODO LOt13  => Voir comment récupérer le numéro de transport et le numéro de quais
       let lv_numtransport :string = Object.values(data)[1];     // TODO LOt13  => Voir comment récupérer le numéro de transport et le numéro de quais
       this.post_motifs_nonchargement();
     }, this ); 

    //----------------------------------------------------------------------------------------------------------------//
     //               HANDLER pour Chargement_UM_get     LOT15 -> Scan Manuel UM                                                                //  
     //----------------------------------------------------------------------------------------------------------------//
    this.getEventBus().subscribe("Default","ChargementUMGetEvent", (channel:string,event:string,data: Object) => { 
       console.log("chargementStartEvent"); 
      //----------------------------------------------------------------------------------------------------------------//
      //---- LOT 9 Validation des messages de Warning TODO )                                                            //
      //----------------------------------------------------------------------------------------------------------------//
        let lv_quai :string    = Object.values(data)[0];  
       this.api_chargement_um_get(lv_quai);
     }, this );

     //----------------------------------------------------------------------------------------------------------------//
     //               HANDLER pour Validation UM                                                                       //  
     //----------------------------------------------------------------------------------------------------------------//
    this.getEventBus().subscribe("Default","ChargementUmPostEvent", (channel:string,event:string,data: Object) => { 
       console.log("chargementStartEvent"); 
      //----------------------------------------------------------------------------------------------------------------//
      //---- LOT 9 Validation des messages de Warning TODO )                                                            //
      //----------------------------------------------------------------------------------------------------------------//
       let quai :string    = Object.values(data)[0];              // LOT 14 Attention : retester la validation du chargement car j'ai changé ce paramètre de number à string
       let codum :string   = Object.values(data)[1];  
       let msgid :string   = Object.values(data)[2];
       let aenam :string   = Object.values(data)[3];
       let errdt :string   = Object.values(data)[4];
       let errzt :string   = Object.values(data)[5];
       let choice :boolean = Object.values(data)[6];
       
       console.log("P1 LOt15 Chargement manuel scan EVENT ChargementUmPostEvent");
       this.api_chargement_um_post(quai,codum,msgid,aenam,errdt,errzt,choice);
     }, this );

     //----------------------------------------------------------------------------------------------------------------         //
     //               HANDLER pour Appel de l'API REST de l'API REST Chargement Start Model (Matchcodes du formulaire de saisie)//  
     //----------------------------------------------------------------------------------------------------------------         //
     this.getEventBus().subscribe("Default","chargementStartModelGetEvent",() => { 
        //------ Envoi d'une notification à la vue ChargementStart pour rendre invisible les messagesStrip----
        this.getEventBus().publish("Default", "InitializeChargementStartMessageStripEvent", {});    
        //------ Récupération des matchcodes du formulaire de saisie de démararge d'un nouveau Chargement------
        this.ChargementStartModel_Get();     // Démarrage du chargment
     } ); 

     //----------------------------------------------------------------------------------------------------------------         //
     //               HANDLER pour Appel de Notification WebSocket                                                              //  
     //----------------------------------------------------------------------------------------------------------------         //
    this.getEventBus().subscribe("Default","notificationWebSocketEvent",(channel:string,event:string,data: Object) => {           
    // EVOL : Notification en fin de chargementTODO ajout de l'action en paramètre
    console.log("-----------------------------------notificationWebSocketEvent Event----------------------------------------------");
    console.log("P1 LOT 13 Notification Web socket: " + Object.values(data)[7] + " CHECK_ID: " + Object.values(data)[8]);
    console.log("P1 LOT 1 Valeur du paramètre de notification time: " + Object.values(data)[7] + " CHECK_ID: " + Object.values(data)[8]);

        this.notificationWebSocketHandler(Object.values(data)[0],Object.values(data)[1],Object.values(data)[2],Object.values(data)[3],Object.values(data)[4],Object.values(data)[5]
        , Object.values(data)[6], Object.values(data)[7], Object.values(data)[8]);  
},this); 

     //----------------------------------------------------------------------------------------------------------------------------//
     //     HANDLER pour Appel de matchcoes articles en stock                                                                                                                        //  
     //----------------------------------------------------------------------------------------------------------------------------//
      this.getEventBus().subscribe("Default","LoadMaterialUmStockListEvent",(channel:string,event:string,data: Object) => {           
            //this.notification_handler(Object.values(data)[0],Object.values(data)[1],Object.values(data)[2],Object.values(data)[3],Object.values(data)[4],Object.values(data)[5]);  
            let lv_material :string = Object.values(data)[0];
           console.log("SUBSCRIBE LoadMaterialUmStockListEvent:CHANNEL:" + channel + " ---EVENT:" + event + " ---ARTICLE: " + Object.values(data)[0]);
            this.get_material_umstock_list(lv_material);
        },this);  

     //----------------------------------------------------------------------------------------------------------------------------//
     //               Appel des API de chargement quais, chargements prévu et matchcode de lancement de chargement                 //  
     //----------------------------------------------------------------------------------------------------------------------------//
       this.getEventBus().publish("Default", "chargementEvent", {});
       this.getEventBus().publish("Default", "chargementListEvent", {});             // MODIF LOT13 =>Le chargement list après le chargement
       this.getEventBus().publish("Default", "chargementStartModelGetEvent", {});    //LOt 12-> Rest déploiement phm -> A REMETTRE
       this.getEventBus().publish("Default", "validationMsgChargementEvent", {});    //LOt 12-> Rest déploiement phm -> A REMETTRE
       this.open_websocket_NotificationUM();            //LOt 12-> Rest déploiement phm -> A REMETTRE
   
      const router = this.getRouter().initialize();   
      
         let target_chargement_list: Target = router.getTarget("targetchargementlist") as Target;
         let target_quai08: Target = router.getTarget("targetchargementquai08") as Target;
         let target_quai09: Target = router.getTarget("targetchargementquai09") as Target;
         let target_quai10: Target = router.getTarget("targetchargementquai10") as Target;
         let target_quai11: Target = router.getTarget("targetchargementquai11") as Target;
         let target_quai12: Target = router.getTarget("targetchargementquai12") as Target;
         let target_quai13: Target = router.getTarget("targetchargementquai13") as Target;
         let target_quai14: Target = router.getTarget("targetchargementquai14") as Target;
         let target_quai15: Target = router.getTarget("targetchargementquai15") as Target;

        target_chargement_list.attachDisplay(()=>{  this.gv_current_application = application_names_enum.chargementsPrevus;}     //Stockage du nom de l'application en cours d'utilisation  // LOT17 Amélioration code
                                            );    
        target_quai08.attachDisplay(()=>{ this.gv_current_application = application_names_enum.chargementsQuais;}                //Stockage du nom de l'application en cours d'utilisation  // LOT17 Amélioration code
                                    );
        target_quai09.attachDisplay(()=>{ this.gv_current_application = application_names_enum.chargementsQuais;}                // LOT17 Amélioration code
                                    );  
        target_quai10.attachDisplay(()=>{ this.gv_current_application = application_names_enum.chargementsQuais;}                // LOT17 Amélioration code
                                    );   
        target_quai11.attachDisplay(()=>{ this.gv_current_application = application_names_enum.chargementsQuais;}                // LOT17 Amélioration code
                                    );  
        target_quai12.attachDisplay(()=>{ this.gv_current_application = application_names_enum.chargementsQuais;}                // LOT17 Amélioration code
                                    );   
        target_quai13.attachDisplay(()=>{ this.gv_current_application = application_names_enum.chargementsQuais;}                // LOT17 Amélioration code
                                    );    
        target_quai14.attachDisplay(()=>{ this.gv_current_application = application_names_enum.chargementsQuais;}                // LOT17 Amélioration code
                                    ); 
        target_quai15.attachDisplay(()=>{ this.gv_current_application = application_names_enum.chargementsQuais;}                // LOT17 Amélioration code
                                    );                                                                                                          
}

//---------------------------------------------------------------------------------------------------------------------------------//
//     Méthode de récupération des URLS des API                                                                                    //  
//---------------------------------------------------------------------------------------------------------------------------------//
  public getApiUrl() : void{
    let lv_location :string;
    let lv_socket_location :string;

        // BEGIN SIMPLIFICATION CDOE
        let lv_index: number =      location.hostname.search(/sap/);
//         //------------------------------------  DEPLOIEMENT SUR SERVEUR SAP--------------------------------------------------------------------------------------------------
        if (lv_index == -1 || location.hostname === environment_enum.localhost)
             {
                switch (this.gv_environment.toLowerCase()) {
                case environment_enum.dev:
                    lv_location         = sapserver_url_enum.dev_url;     //   Vérifier s'il faut mettre le port ou pas                              //LOT17 Amélioration code
                    lv_socket_location  = sapserver_url_enum.dev_url;      //"sapdev.exaclair.eu:443"; //   Vérifier s'il faut spécifier ou pas le port pour les Web Socket 
                // Lien vers Web Socket Johann  wss://sclf-webopc:8080/sap/bc/apc/sap/ychargement_camion_poc
                //lv_socket_location = "sclf-webopc:8080";
                    break; 
                case environment_enum.test:
                    lv_location         = sapserver_url_enum.test_url + ":443";     //   Vérifier s'il faut mettre le port ou pas                             //LOT17 Amélioration code
                    lv_socket_location  = sapserver_url_enum.test_url + ":443"; //   Vérifier s'il est possible d'utiliser le même chemin que les API  
                    break; 
                case environment_enum.preprod:
                    lv_location         = sapserver_url_enum.preprod_url;     //   Vérifier s'il faut mettre le port ou pas                          //LOT17 Amélioration code
                    lv_socket_location  = sapserver_url_enum.preprod_url;     //   Vérifier s'il est possible d'utiliser le même chemin que les API  
                    break; 
                case environment_enum.prod:
                    lv_location         = sapserver_url_enum.prod_url;     //   Vérifier s'il faut mettre le port ou pas                             //LOT17 Amélioration code
                    lv_socket_location  = sapserver_url_enum.prod_url;     //   Vérifier s'il est possible d'utiliser le même chemin que les API  
                    break; 
                default:
                    lv_location        = sapserver_url_enum.dev_url;
                    lv_socket_location = sapserver_url_enum.dev_url;
                    break; 
                }
            }
        else
           {      
             lv_location = location.host;
             lv_socket_location = location.host;  
            }  

    // LOT 17 Amélioration code (Enum)        
    // this.gv_chargementquais_api_url = "https://" + lv_location  + "/sap/bc/gui/sap/its/zpcf_chargement/chargement";
    // this.gv_validation_msg_chargementquais_api_url = "https://" + lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement";    
    // this.gv_chargementprevus_api_url = "https://" + lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_list"; 
    // this.gv_startchargement_api_url = "https://" + lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";
    // this.gv_endchargement_api_url = "https://" + lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/end_chargement";
    // this.gv_material_umstock_api_url =  "https://" + lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
    // this.gv_chargement_um_api_url = "https://" + lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_um";
    // this.gv_websocket_url = "wss://" + lv_socket_location + "/sap/bc/apc/sap/ychargement_camion_poc"; 

    this.gv_chargementquais_api_url = "https://" + lv_location  +  restapi_websocket_path_enum.chargementquais;
    this.gv_validation_msg_chargementquais_api_url = "https://" + lv_location +  restapi_websocket_path_enum.validation_chargement;    
    this.gv_chargementprevus_api_url = "https://" + lv_location +  restapi_websocket_path_enum.chargement_prevus; 
    this.gv_startchargement_api_url = "https://" + lv_location +  restapi_websocket_path_enum.start_chargement;
    this.gv_endchargement_api_url = "https://" + lv_location +  restapi_websocket_path_enum.end_chargement;
    this.gv_material_umstock_api_url =  "https://" + lv_location +  restapi_websocket_path_enum.material_umstock_list;
    this.gv_chargement_um_api_url = "https://" + lv_location +  restapi_websocket_path_enum.chargement_um;
    this.gv_websocket_url = "wss://" + lv_socket_location +  restapi_websocket_path_enum.websocket_ychargement_camion_poc;
// END SIMPLIFICATION CODE  
}
//---------------------------------------------------------------------------------------------------------------------------------//
//                                                                                                                                 //  
//---------------------------------------------------------------------------------------------------------------------------------// 
    public notificationWebSocketHandler(type_msg:string, msg_txt: string,transport:string, um: String, current_quai: string, action :string, user:string, time:any,  p_checkid:string ) : void{ 
          
      let current_quai_index_json:number;
      let type_msg_strip : string;
      let model_root_path: string;
      let model_root_path_quai: string;
      let notificationsQuaisModel : JSONModel  = this.getModel("notificationsQuaisModel") as JSONModel;
    //  let input_data:any = notificationsQuaisModel.getData(); 
      // 1 TODO Récupération de l'indice ou de l'ID du quai concerné par modification => Récupérer l'indice du quai à partir du current_quai
      console.log("------------------------------------COMPONENT CONTROLLER/Méthode notificationWebSocketHandler-----------------------------------------------");  
      current_quai_index_json = Number(current_quai.slice(4,6));
      current_quai_index_json =   current_quai_index_json - 8 ;
      console.log("QUAI = " + current_quai + " /Valeur de l'indice json  du quai: " +  current_quai_index_json + "/Type de Message:" + type_msg)
      console.log("------------------------------------MAJ des notififications dans le modèle de notification-----------------------------------------------");  
      console.log("P1 HIGH TEST POPOP VALIDATION CHARGEMENT ACTION=" + action + " TYPE MESSAGE = " + type_msg + "MSG_TXT = " +  msg_txt);
      // TODO  LOT7  A changer c'est plus subtil que cela si startchargement et Succes alors il faut pointer sur le root path des quais  (Path /chargementstartnotifs)
      //------------------En fonction du type d'action et du du type de message on enregistre la notification dans le modèle de notifications des quais  /quais/{indice_quai}/notifs
      //----------------- dans le  modèle de notifications le démarrage du chargement (Path /chargementstartnotifs)

    switch (action) {
        case action_code_enum.chargement:
            model_root_path = "/quais/" + current_quai_index_json + "/notifs";
            break;
        case action_code_enum.start_chargement:
          if ( type_msg == 'E'  )
          {
            model_root_path = "/chargementstartnotifs";
            break;
          }
          else
          {      if    ( ( type_msg == 'information' ) || ( type_msg == 'W' )  ){    model_root_path = "/quais/" + current_quai_index_json + "/notifs";  console.log("P1 Mise à jour notifications Warning");  break; }      
          }
        default:
            model_root_path = "/quais/" + current_quai_index_json + "/notifs";
            break;
    }
      console.log("-----P1--------- LOT 7 Modèle root path :" + model_root_path  );

// BEGIN EVOLUTION -> Affichage de plusieurs messsages strip en même temps sur le quai
// Code pour effacer les notifications d'erreur en cas de démarrage de chargement  
if (action == action_code_enum.start_chargement &&  (( type_msg == 'information' ) || ( type_msg == 'W' )) )
{
 notificationsQuaisModel.setProperty(model_root_path + "/notiferror/msg_txt","");
 notificationsQuaisModel.setProperty(model_root_path + "/notiferror/visible",false);
}

// Code pour effacer les notifications affichés au bas de l'écran des quais dans le cas ou l'on charge une nouvelle UM
if ( (notificationsQuaisModel.getProperty("/quais/" + current_quai_index_json + "/um") != um) && (action == 'chargement') ) 
{
  console.log("-----P1 HIGH LOT Validations des Warning/Choice (LOT 9) ------  CHARGEMENT d'une nouvelle UM -> Les notifications Msg strip sont clearées--------" );
 notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess/msg_txt","");
 notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess/visible",false); 
 notificationsQuaisModel.setProperty(model_root_path + "/notifwarning/msg_txt","");
 notificationsQuaisModel.setProperty(model_root_path + "/notifwarning/visible",false);
 notificationsQuaisModel.setProperty(model_root_path + "/notiferror/msg_txt","");
 notificationsQuaisModel.setProperty(model_root_path + "/notiferror/visible",false);

notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json + "/um", um);    // On stocke le dernier UM traité dans le modèle des notifications 
}

// TODO BEGIN LOT15 Scan Manuel -> Il faut également alimenter les propriétées d'erreur et de Succès de scan Manuel

    if ( type_msg == 'information' )   // Si la notificaiton est de type information (succès) alors il faut cacher la notification de type erreur
        {
        notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess/msg_txt",msg_txt);
        notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess/visible",true);

        notificationsQuaisModel.setProperty(model_root_path + "/notiferror/msg_txt","");
        notificationsQuaisModel.setProperty(model_root_path + "/notiferror/visible",false);

            //LOT 15 BEGIN Scan Manuel UM
        notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess_scanmanuelum/msg_txt",msg_txt);
        notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess_scanmanuelum/visible",true);

        notificationsQuaisModel.setProperty(model_root_path + "/notiferror_scanmanuelum/msg_txt","");
        notificationsQuaisModel.setProperty(model_root_path + "/notiferror_scanmanuelum/visible",false);
            //LOT 15 END Scan Manuel UM
       
        //  LOT 14 BEGIN RECETTE JANVIER 2026 -> EVOL  Faire cliqnoter le header du chargement lors du chargement d'une UM

        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorset","ColorSet8");
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorshade","ShadeE");
              setTimeout(() => {
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorset","ColorSet9");
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorshade","ShadeE");
            
         }, 4000);
        
          setTimeout(() => {
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorset","ColorSet8");
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorshade","ShadeE");
            
         }, 5000);
        //  setTimeout(() => {
        // notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorset","ColorSet9");
        // notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorshade","ShadeE");
            
        //  }, 1500); 
    // LOT 14 END RECETTE JANVIER 2026 -> EVOL  Faire cliqnoter le header du chargement lors du chargement d'une UM

        }

    if ( type_msg == 'W' )          // Si la notificatios est de type Warning alors il faut cacher la notificdtion  de type erreur
        {
        notificationsQuaisModel.setProperty(model_root_path + "/notifwarning/msg_txt",msg_txt);
        notificationsQuaisModel.setProperty(model_root_path + "/notifwarning/visible",true);

        notificationsQuaisModel.setProperty(model_root_path + "/notiferror/msg_txt","");
        notificationsQuaisModel.setProperty(model_root_path + "/notiferror/visible",false);

          //  LOT 14 BEGIN RECETTE JANVIER 2026 -> EVOL  Faire cliqnoter le header du chargement lors du chargement d'une UM

        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorset","ColorSet1");
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorshade","ShadeD");
         setTimeout(() => {
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorset","ColorSet9");
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorshade","ShadeE");
            
         }, 4000);
          setTimeout(() => {
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorset","ColorSet1");
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorshade","ShadeD");
            
         }, 5000);

    // LOT 14 END RECETTE JANVIER 2026 -> EVOL  Faire cliqnoter le header du chargement lors du chargement d'une UM
        }

    if ( type_msg == 'E' )             // Si la notification est de type erreur alors il faut cacher les notifications de warning ou d'information(Succès)
        {
        notificationsQuaisModel.setProperty(model_root_path + "/notiferror/msg_txt",msg_txt);
        notificationsQuaisModel.setProperty(model_root_path + "/notiferror/visible",true);

        notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess/msg_txt","");
        notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess/visible",false);
        notificationsQuaisModel.setProperty(model_root_path + "/notifwarning/msg_txt","");
        notificationsQuaisModel.setProperty(model_root_path + "/notifwarning/visible",false);

       //LOT 15 BEGIN Scan Manuel UM
       notificationsQuaisModel.setProperty(model_root_path + "/notiferror_scanmanuelum/msg_txt",msg_txt);
       notificationsQuaisModel.setProperty(model_root_path + "/notiferror_scanmanuelum/visible",true)

        notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess_scanmanuelum/msg_txt","");
        notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess_scanmanuelum/visible",false);
       //LOT 15 END Scan Manuel UM

         //  LOT 14 BEGIN RECETTE JANVIER 2026 -> EVOL  Faire cliqnoter le header du chargement lors du chargement d'une UM

        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorset","ColorSet2");
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorshade","ShadeE");
         setTimeout(() => {
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorset","ColorSet9");
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorshade","ShadeE");
            
         }, 4000);
          setTimeout(() => {
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorset","ColorSet2");
        notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorshade","ShadeE");
            
         }, 5000);
        //  setTimeout(() => {
        // notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorset","ColorSet9");
        // notificationsQuaisModel.setProperty("/quais/" + current_quai_index_json  + "/header/backgroundcolorshade","ShadeE");
            
        //  }, 1500); 
        
    // LOT 14 END RECETTE JANVIER 2026 -> EVOL  Faire cliqnoter le header du chargement lors du chargement d'une UM
        }
    
// END EVOLUTION -> Affichage de plusieurs messsages strip en même temps sur le quai
    console.log("Strip Error Text   : "+ notificationsQuaisModel.getProperty(model_root_path + "/notiferror/msg_txt"));
    console.log("Strip success Text : "+ notificationsQuaisModel.getProperty(model_root_path + "/notifsuccess/msg_txt"));
    console.log("Strip Warning Text : "+ notificationsQuaisModel.getProperty(model_root_path + "/notifwarning/msg_txt"));

// TODO Rappel de l'API REST des messages de validation de chargement + Ouverture de la boîte de dialogue de validation de chargement 
// TODO-> Vérifier que le popup s'affiche uniquement que si on se trouve sur l'application de chargement des quais
      if ( (action  == action_code_enum.chargement) && ((type_msg == 'V') || (type_msg == 'C')) ) {                 // if ( (action  == 'chargement') && ((type_msg == 'W') || (type_msg == 'C')) ) {
           this.getEventBus().publish("Default", "validationMsgChargementEvent", {});
           if ( this.gv_current_application == application_names_enum.chargementsQuais )     // Anomalie ouverture de la popup de la validation - > La popup ne doit s'ouvrir que si l'utilisateur se trouve sur l'application 
                                                                                    // de chargement des quais
           {
           let data : {quai_number_popupdisplay:string} =  { quai_number_popupdisplay:  current_quai};
           this.getEventBus().publish("Default", "validationDialogEvent", data);
           }
          }    
    
      console.log("------------------------------------MAJ des notififications ALL QUAIS dans le modèle de notification-----------------------------------------------"); 
         switch (type_msg) {
            case 'information':
            type_msg_strip = "Success";
            break;
            case 'W':
            type_msg_strip = "Warning";
            break;
            case 'V':
            type_msg_strip = "Warning";
            break;
            case 'C':
            type_msg_strip = "Warning";
            break;
            case 'E':
            type_msg_strip = "Error";
            break;
            default:
            type_msg_strip = "Success";
            break;
        }
      let msg_text_all_object : Object[] = notificationsQuaisModel.getProperty("/notif_txt_all") ;
      console.log("P1----- Affichage de l'ensemble des messages de notifications---------------------" + msg_text_all_object);
      msg_text_all_object.push({msg_txt: msg_txt, type_msg : type_msg_strip, time: time})
      notificationsQuaisModel.setProperty("/notif_txt_all",msg_text_all_object);

      //-------------------------------- Reprise de la logique de l'ancien handler-----------------------------------------------------------------------//
      // TODO -> Vérifier que la relance des API ne fait pas trop souvent- > Peut être relancer uniquement si l'utiliseur se trouve sur le quai concerné
    this.refresh_after_wsnotifiction(action,type_msg,msg_txt)
}

public refresh_after_wsnotifiction(action :string, type_msg:string, msg_txt: string)
{
// TODO -> Vérifier que la relance des API ne fait pas trop souvent- > Peut être relancer uniquement si l'utilisaeur se trouve sur le quai concerné
// TODO-> En cas de notification de chargement relancer uniquement si c'est une notification de type 'S' et si le quai affiché est concerné par la notification
  if ((action == action_code_enum.chargement) && (type_msg == 'information' ) ) // TODO => && ( IconTabBarControl.getSelectedKey() == current_quai    //LOT17 => Amélioration code
        {
          MessageToast.show(msg_txt);
          this.getEventBus().publish("Default", application_events_enum.chargement_quais_event, {}); 
          this.getEventBus().publish("Default", application_events_enum.chargement_prevus_event, {}); "Rechargement de la liste des chargements prévus"
          this.getEventBus().publish("Default", application_events_enum.validation_msg_chargement_event, {});    //LOT 13 
        }
      if ((action == action_code_enum.dechargement) && (type_msg == 'information' ) ) // TODO => && ( IconTabBarControl.getSelectedKey() == current_quai
        {
          MessageToast.show(msg_txt);
          this.getEventBus().publish("Default", application_events_enum.chargement_quais_event, {}); 
          this.getEventBus().publish("Default", application_events_enum.chargement_prevus_event, {}); "Rechargement de la liste des chargements prévus"
          this.getEventBus().publish("Default", application_events_enum.validation_msg_chargement_event, {});    //LOT 13
        }
    if ( (action == action_code_enum.start_chargement) && (type_msg == 'information' ))
      {
      console.log("-----P1-----------------------Notification de fin de chargement ou de début de chargement// Rafraichissement des chargements-------------------------------------------");
      MessageToast.show(msg_txt);
      this.getEventBus().publish("Default", application_events_enum.chargement_quais_event, {});  //Notification fin de chargement"
      this.getEventBus().publish("Default", application_events_enum.chargement_prevus_event, {}); "Rechargement de la liste des chargements prévus"
      }
      if ( (action == action_code_enum.fin_chargement) )
      {
      console.log("-----P1-----------------------Notification de fin de chargement ou de début de chargement// Rafraichissement des chargements-------------------------------------------");
      MessageToast.show(msg_txt);
      this.getEventBus().publish("Default", application_events_enum.chargement_quais_event, {});  //Notification fin de chargement"
      this.getEventBus().publish("Default", application_events_enum.chargement_prevus_event, {}); "Rechargement de la liste des chargements prévus"
      }
}
    onCloseDialog(): void {
      // note: We don't need to chain to the pDialog promise, since this event-handler
      // is only called from within the loaded dialog itself.
    //   (this.byId("busyDialog") as Dialog)?.close();
  }    

    public get_chargements_prevus():void {
          var mHeader = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",
        }
        let chargementsPrevusListModel: JSONModel;
        if ( this.getModel("chargementsPrevusListModel") == undefined)
        {
            chargementsPrevusListModel = new JSONModel();
            this.setModel(chargementsPrevusListModel, "chargementsPrevusListModel");
        }else
        {  
            chargementsPrevusListModel =   this.getModel( "chargementsPrevusListModel") as JSONModel;
        }
    
     chargementsPrevusListModel.loadData(this.gv_chargementprevus_api_url,"",true,  "GET", false, true, mHeader); 
     //chargementsPrevusListModel.forceNoCache(true);
     //chargementsPrevusListModel.updateBindings(true);
    }

     //----------------------------------------------------------------------------------------------------------------------------//
     //               Méthode d'appel à l'API  REST de récupération des stocks d'un article                                        //  
     //----------------------------------------------------------------------------------------------------------------------------//
  public get_material_umstock_list(material:string):void {
 
           var mHeader = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",
            "material": material                                      
        }
        let MaterialUmStockListModel: JSONModel;
        if ( this.getModel("MaterialUmStockListModel") == undefined)
        {
            MaterialUmStockListModel = new JSONModel();
            this.setModel(MaterialUmStockListModel, "MaterialUmStockListModel");
        }else
        {  
            console.log("Relance du chargement list"),
            MaterialUmStockListModel =   this.getModel( "MaterialUmStockListModel") as JSONModel;
        }
    MaterialUmStockListModel.loadData(this.gv_material_umstock_api_url,"",true,  "GET", false, true, mHeader); 
    }

      //----------------------------------------------------------------------------------------------------------------------------//
     //               Méthode d'appel à l'API  REST de chargement des quais                                                        //  
     //----------------------------------------------------------------------------------------------------------------------------//
    public get_chargement_quais():void {
// METHODE auhentification 1 - > Authorization : auth        (Retiré suite aux problématiques d'authentification d'Octobre 2025)
        // let credentials = userName + ':' + password;
        // let hash = btoa(credentials);
        // let auth = 'Basic '+hash;

           var mHeader = {     
            // "Authorization": auth,                           // Essai pas d'autorisation         //LOt15 -> Je vois pas comment ca peut marcher en localhost sans autorisaiton?
             "Content-Type":"application/json",
           }

// On instancie le modèle que s'il n'est pas déja défini au niveau du composant (premier chargement/rechargement)
     let  chargementQuaiModel: JSONModel;
     if ( this.getModel("chargementModelJson") == undefined)
     {
        chargementQuaiModel = new JSONModel();
        this.setModel(chargementQuaiModel, "chargementModelJson");
     }else
     {  
         chargementQuaiModel =   this.getModel( "chargementModelJson") as JSONModel;
     }
    
     // TODO LOT4 => RECUPERER LE TOKEN CSRF du GET
     //var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
     console.log("P1 HIGH URL API Chargement  des quais au moment de l'appel de l'API: " + this.gv_chargementquais_api_url ); 
     chargementQuaiModel.loadData(this.gv_chargementquais_api_url,"",true,  "GET", false, true, mHeader)?.then((data) => {   this.getEventBus().publish("Default", "chargementFinishedEvent", {});
                             console.log("DATA DANS LE PROMISE DU GET" + data)       });
     
     chargementQuaiModel.attachRequestCompleted(function (evt) { console.log("PARAMETRES RESPONSE HEADER:" +evt); });
    }

    //----------------------------------------------------------------------------------------------------------------------------//
    //            LOT10:  Méthode d'appel à l'API  REST des messages de validation des chargements sur les quais                  //  
    //----------------------------------------------------------------------------------------------------------------------------//
    public get_validation_msg_chargements():void {
               var mHeader = {
             "Content-Type":"application/json",
              }

      if ( this.getModel("validationMsgChargementQuaiModelJSON") == undefined)
     {
        this.setModel(new JSONModel(), "validationMsgChargementQuaiModelJSON");
     }
    
     console.log("P1 URL API ZCL_PCF_CHARG_VALIDMSG_RESOUR: " + this.gv_validation_msg_chargementquais_api_url ); 
     (this.getModel("validationMsgChargementQuaiModelJSON") as JSONModel).loadData(this.gv_validation_msg_chargementquais_api_url,"",true,  "GET", false, true, mHeader)?.then((data) => {     });
    }

    //----------------------------------------------------------------------------------------------------------------------------//
    //            LOT13:  Méthode d'appel à l'API  REST des messages de validation des chargements sur les quais                  //  
    //----------------------------------------------------------------------------------------------------------------------------//
    public get_motifs_nonchargement(i_quai:string,i_numtransport:string):void {
    console.log("P1 HIGH/ Méthode Get_motifs_nonchargement QUAI=" + i_quai + " TRANSPORT= "  + i_numtransport )
              
              var mHeader = {
             "Content-Type":"application/json",
              "X-Requested-With":"X",
               "tknum": i_numtransport,    // Object.values(input_data)[0]  //TODO => Essayer de passer les paramètre dans le Body du POST
               "quai1":  i_quai,   
              }
      if ( this.getModel("finChargementQuaiModelJSON") == undefined)
     {
        this.setModel(new JSONModel(), "finChargementQuaiModelJSON");
     }
    
     console.log("P1 URL API ZCL_PCF_CHARGEMENT_END_RESOUR: " + this.gv_endchargement_api_url ); 
     (this.getModel("finChargementQuaiModelJSON") as JSONModel).loadData(this.gv_endchargement_api_url,"",true,  "GET", false, true, mHeader)?.then((data) => {     });
    }

    //----------------------------------------------------------------------------------------------------------------------------//
    //            LOT13:  Méthode d'appel à l'API  REST de fin de chargement                                                       //  
    //-----------------------------------------------------------------------------------------------------------------------------//
    public post_motifs_nonchargement():void {
        let finChargementQuaiModelJSON: JSONModel =  this.getModel( "finChargementQuaiModelJSON") as JSONModel;
       // Récupération des données du modèle
        let input_data:any =  finChargementQuaiModelJSON.getData(); 

          let mHeader = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",  
            "X-Requested-With":"X",
            "tknum": input_data.tknum,    // Object.values(input_data)[0]  //TODO => Essayer de passer les paramètre dans le Body du POST
            "quai1":  input_data.quai1,   
        }

   // Appel de l'api de fin de chargement    
   finChargementQuaiModelJSON.loadData(this.gv_endchargement_api_url , JSON.stringify(input_data.tMotifNocharg)    ,true,  "POST", false, true, mHeader)?.then(result=>{
       const router = this.getRouter();
       let lv_target_quai : string = "targetstartchargement" + input_data.quai1.toLowerCase();
       // MessageToast.show("Fin de chargement sur quai : " + input_data.quai1 + " et navigation sur Target:" +  lv_target_quai,{ duration: 4000, width : '50%' })
        this.getEventBus().publish("Default", application_events_enum.chargement_end_event, {});
        router.getTargets()?.display(lv_target_quai);           
        },reason=>{  console.log("P1 LOT13 Rejected Promise POST FinChargement" + finChargementQuaiModelJSON.getJSON.toString());
                     //MessageToast.show("Veuillez saisir un motif de non chargement pour chaque poste: " + reason ,{ duration: 5000, width : '50%' })
                                                                                                             });  
    }

     //----------------------------------------------------------------------------------------------------------------------------//
     //               Méthode d'appel de l'API  ZCL_PCF_START_CHARG_RESOURCE/ Méthode GET                                          //  
     //----------------------------------------------------------------------------------------------------------------------------//
      public ChargementStartModel_Get():void{

        let ChargementStartModel: JSONModel;
        let lv_chargement_url : string;
        if ( this.getModel("ChargementStartModel") == undefined)
        {
            ChargementStartModel = new JSONModel();
            this.setModel(ChargementStartModel, "ChargementStartModel");
            ChargementStartModel.setDefaultBindingMode("TwoWay");   // TODO => vérifier si c'est nécessaire d'activer  le two way binding
        }else
        {  
            ChargementStartModel =   this.getModel( "ChargementStartModel") as JSONModel;
        }
  

    //------------------------------------------------------------------------------------------------------------------------------------------------------
    // BEGIN LOT 12 : Déploiement PHP  -> Vérifier s'il ne faut pas remettre le paramètre "X-Requested-With":"X" et l'autoriser au niveau de UCONCOCKPIT
    //---------------------------------------------------------------------------------------- --------------------------------------------------------------                    
           let mHeader = {
            "Content-Type":"application/json",  
        }
     //-----------------------------------------------------------------------------------------
    // END LOT 12 : Déploiement PHP
    //----------------------------------------------------------------------------------------
       ChargementStartModel.loadData(this.gv_startchargement_api_url,"",true,  "GET", false, true, mHeader);
    }

     //---------------------------------------------------------------------------------------------------------------------------------//
     //               Méthode d'appel à l'API  REST de lancement du chargement d'un quai  [ZCL_PCF_START_CHARG_RESOURCE/Méthode POST ]                                       //  
     //---------------------------------------------------------------------------------------------------------------------------------//
    public startchargementquai_post(i_quai:string):void{
        let ChargementStartModel: JSONModel;
        let lv_chargement_url : string;

        console.log("-------------------------------METHODE  STARTCHARGEMENTQUAI------------------------------ "); 
        if ( this.getModel("ChargementStartModel") == undefined)
        {
            ChargementStartModel = new JSONModel();
            this.setModel(ChargementStartModel, "ChargementStartModel");
            ChargementStartModel.setDefaultBindingMode("TwoWay");   // TODO => vérifier si c'est nécessaire d'activer  le two way binding
        }else
        {  
            ChargementStartModel =   this.getModel( "ChargementStartModel") as JSONModel;
        }
                                                                        
        let input_data:any = ChargementStartModel.getData();  
        console.log("P1 Appel  de Start Chargement Valeur de quai:" + i_quai  + "// transport: " + input_data.results.tknum);

    //-----------------------------------------------------------------------------------------
    // BEGIN LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification (Paramètre authorization retiré)
   //----------------------------------------------------------------------------------------
          let mHeader = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",  
            "X-Requested-With":"X",
            "tknum": input_data.results.tknum,    // Object.values(input_data)[0]  //TODO => Essayer de passer les paramètre dans le Body du POST
            "quai1":  i_quai,                       //input_data.results.quai1 
            "matri": input_data.results.matri,
            "name1": input_data.results.name1,
        }
    //-----------------------------------------------------------------------------------------
    // END LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification (Paramètre authorization retiré)
   //----------------------------------------------------------------------------------------
        ChargementStartModel.loadData(this.gv_startchargement_api_url,"",true,  "POST", false, true, mHeader)?.then(result=>{
        let lv_target_quai : string; 
        MessageToast.show("Chargement démarré sur le quai : " + i_quai ,{ duration: 3000, width : '50%' })
        i_quai = i_quai.toLowerCase();
        //i_quai = i_quai.replace(/^\w/, (c) => c.toUpperCase());        // LOT13-> A priori cette conversion n'est plus nécessaire
        MessageToast.show("Chargement démarré sur le quai : " + i_quai ,{ duration: 3000, width : '50%' })
       // lv_target_quai = "TargetChargement" + i_quai;                  // LOT13-> Attention TargetChargementQuai12 a été changé en targetchargementquai12
       lv_target_quai = "targetchargement" + i_quai;
        const router = this.getRouter();
        console.log("P1 Navigation vers le quai avec target " + lv_target_quai); 
         this.getEventBus().publish("Default", application_events_enum.chargement_start_get_event, {});
         router.getTargets()?.display(lv_target_quai);           // TODO -> Remis après refonte du modèle de notification car manquant
                                                                                                                      },reason=>{  console.log("P1 REJECTED PROMISE POST StartChargment" + ChargementStartModel.getJSON.toString());
                                                                                                             }); 
    }

 //----------------------------------------------------------------------------------------------------------------------------//
     //               Méthode d'appel de l'API  ZCL_PCF_START_CHARG_RESOURCE/ Méthode GET                                          //  
     //----------------------------------------------------------------------------------------------------------------------------//
      public api_chargement_um_get(i_quai:string):void{

        let ChargementUmModel: JSONModel;
        console.log("-------------------------------METHODE  api_chargement_um_post---------------------------------------------------------------------------------------- "); 
        if ( this.getModel("ChargementUmModel") == undefined)
        {
            ChargementUmModel = new JSONModel();
            this.setModel(ChargementUmModel, "ChargementUmModel");
            ChargementUmModel.setDefaultBindingMode("TwoWay");   // TODO => vérifier si c'est nécessaire d'activer  le two way binding
        }else
        {  
            ChargementUmModel =   this.getModel( "ChargementUmModel") as JSONModel;
        } 

    //------------------------------------------------------------------------------------------------------------------------------------------------------
    // BEGIN LOT 12 : Déploiement PHP  -> Vérifier s'il ne faut pas remettre le paramètre "X-Requested-With":"X" et l'autoriser au niveau de UCONCOCKPIT
    //---------------------------------------------------------------------------------------- --------------------------------------------------------------                    
           let mHeader = {
            "Content-Type":"application/json", 
            "quai1":  i_quai                             //LOT15 [Scan Manuel UM]-> Rajouter le paramètre quai1 dans le paramétrage CORS UCONCOCKPIT
        }
     //-----------------------------------------------------------------------------------------
    // END LOT 12 : Déploiement PHP
    //----------------------------------------------------------------------------------------
         ChargementUmModel.loadData(this.gv_chargement_um_api_url,"",true,  "GET", false, true, mHeader);
    }

     //---------------------------------------------------------------------------------------------------------------------------------//
     //               Méthode d'appel à l'API  REST de lancement du chargement d'un quai  [ZCL_PCF_START_CHARG_RESOURCE/Méthode POST ]  //  
     //---------------------------------------------------------------------------------------------------------------------------------//
    public api_chargement_um_post(i_quai:string,i_codum:string, i_msgid :string, i_aenam:string , i_errdt:string, i_errzt:string, i_choice:boolean) :void{
       
        let ChargementUmModel: JSONModel;
         let lv_target_quai : string; 
             
        console.log("-------------------------------METHODE  api_chargement_um_post---------------------------------------------------------------------------------------- "); 
        if ( this.getModel("ChargementUmModel") == undefined)
        {
            ChargementUmModel = new JSONModel();
            this.setModel(ChargementUmModel, "ChargementUmModel");
            ChargementUmModel.setDefaultBindingMode("TwoWay");   // TODO => vérifier si c'est nécessaire d'activer  le two way binding
        }else
        {  
            ChargementUmModel =   this.getModel( "ChargementUmModel") as JSONModel;
        }                                                            
       
  //-----------------------------------------------------------------------------------------
    // BEGIN LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification (Paramètre authorization retiré)
   //----------------------------------------------------------------------------------------
              let mHeader = {
            //"Access-Control-Allow-Origin": "*",           // Pas ut
            "Content-Type":"application/json",  
            "X-Requested-With":"X",
            "codum":  i_codum,      // Object.values(input_data)[0]  //TODO => Essayer de passer les paramètre dans le Body du POST
            "quai1":  i_quai,       //input_data.results.quai1 
            "msgid": i_msgid,
            "aenam": i_aenam,
            "errdt": i_errdt,
            "errzt": i_errzt,
            "choice": i_choice
        }

    //-----------------------------------------------------------------------------------------
    // END LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification (Paramètre authorization retiré)
    //----------------------------------------------------------------------------------------   
        ChargementUmModel.loadData(this.gv_chargement_um_api_url,"",true,  "POST", false, true, mHeader)?.then(result=>{  
    //------------------- TODO LOT9  Validation des messages de Warning->Mettre le code de suppression du Warning de la promise de l'API POST--------------------------------------------------
       //console.log("P1 LOt15 Valeur de i_validation_charg_um :" + i_validation_charg_um);
      console.log("P1 HIGH LOt15 Rappel de l'API des messages de validation");
      this.getEventBus().publish("Default", application_events_enum.validation_msg_chargement_event, {});  // LOT15 Rappel du modèle de validation de chargment -> Réfléchir si c'est nécessaire ou le mettre dans le handler du routing

                                                                                                                      },reason=>{ 
                                                                                                             }); 
    }
    
      //----------------------------------------------------------------------------------------------------------------------------//
     //               Ouverture des Web Socket                                                                                     //  
     //----------------------------------------------------------------------------------------------------------------------------//
        public open_websocket_NotificationUM():void {
          //Ouverture des Web Sockets  
          console.log("Hostname du POC//Construire l'URL en fonction du Host:" + location.hostname);
          let lv_url: string;
        
         console.log("Instantiation du Web Socket avec url :" + this.gv_websocket_url);
         //["wss","ws","https","http"]
         let v_webSocket = new WebSocket(this.gv_websocket_url);
         let data_Socket : Object = '';
 
         v_webSocket.attachOpen(function (e: Event) {
             console.log("Ouverture du Web Socket");
         });

   v_webSocket.attachError(function (e: WebSocket$ErrorEvent) {
            console.log("P1 hIGH  ERREUR OUVERTURE WEB SOCKET");
             console.log(e);
         });

         var that = this;
         v_webSocket.attachMessage(data_Socket, function (e: WebSocket$MessageEvent) {
            let params = e.getParameters();
            console.log("LOT 13 Popup Motifs chargement/Régression notifications " + e.getParameters() );  
            let content : any = params.data;
            let content_json : {type_msg:String, msg_txt:String,quai:String,um:string,action:string,statut: string,transport:string,user:string,  time : Date, checknumber:number, checkid:string} = JSON.parse(content);   
             let data : {type_msg:String, msg_txt:String,transport:String, um:String, quai:String,action:String,user:string, time : Date, checkid:string} = {
                type_msg: content_json.type_msg,
                msg_txt: content_json.msg_txt,
                transport: content_json.um,
                um: content_json.um, 
                quai: content_json.quai,
                action: content_json.action,
                user: content_json.user,
                time: content_json.time,
                checkid:  content_json.checkid                   
              };

             // On envoie une notification UM qui sera gérée dans la vue de Chargement
             // LOT Démarrage Chargement quai -> On va définir un handler notificationWebSocketEvent qui va redispatcher vers notificationUMEvent
             that.getEventBus().publish("Default", application_events_enum.notification_websocket_event,  data);   // Il est possible d'essayer avec    that.getEventBus().publish("Default", "notificationUMEvent",  content_json)
         }); 
    }
    /*  La création du root Control peut se faire par le Manifest du composant
    createContent(): Control | Promise<Control | null> | null {
        return XMLView.create({
            "viewName": "ui5.walkthrough.view.App",
            "id": "app"
        });
    }; */

}