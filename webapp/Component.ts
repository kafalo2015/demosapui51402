import BaseComponent from "sap/ui/core/UIComponent";
import WebSocket, { WebSocket$MessageEvent } from "sap/ui/core/ws/WebSocket";
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
    
    // public g_const_dev_environment :string = "dev";
    // public g_const_bas_environment :string = "bas";
    // public g_const_pre_environment :string = "pre";
    // public g_const_prod_environment :string = "prod";

    public gv_environment :string;
    
    public  sap_server_dev  :string  = "sapdev.exaclair.eu";    // ADRESSE UI5 YAML SHDS-SAPDEV.exaclair.clairefontaine.local:1080
    public  sap_server_bas  :string  = "sapbas.exaclair.eu";  
    public  sap_server_pre  :string  = "sappre.exaclair.eu";
    public  sap_server_prod :string  = "sapprod.exaclair.eu";

    public gv_chargement_url : string;
    public gv_chargement_um_api_url: string;                    // URL API startchargement
    public gv_startchargement_api_url: string;                  // URL API startchargement
    public gv_endchargement_api_url: string;                    // URL API endchargement
    public gv_chargementquais_api_url: string;                  // URL API chargement des quais
    public gv_validation_msg_chargementquais_api_url: string;                                                                     //gv_validation_msg_chargementquais_api_url
    public gv_chargementprevus_api_url: string;                  // URL API Chargement prévus
    public gv_material_umstock_api_url: string;                  // URL material_umstock_list
    public const_chargementsPrevusApp = "ChargementsPrevusApp";  // Application Chargement prévues
    public const_chargementsQuaisApp = "ChargementsQuaisApp";    // Application Chargement des quais
    public gv_current_application: string;                       // Stocke le nom de l'application actuellement affiché (Liste des chargmentn ou Chargement des quais)
    //private gv_dialog_validation_charg: Dialog;
   
	public init() : void {
		// call the base component's init function
		super.init();
        // Changemment de variable environnement (dev ou qual) pour appeler les API de la qual ou de la dev
         this.gv_environment = 'dev';
      // this.gv_environment = this.getManifestEntry("/sap.ui5/config/api_env");
       console.log("P1 HIGH Lecture de la variable de configuraiton du manifest /sap.ui5/config/api_env : " +    this.gv_environment )

        //this.initchargementquaiModel();                                 //LOT 4 Lancement chargement des quais
        // set the device model
        this.setModel(createDeviceModel(), "device");
         // set i18n model
         //const i18nModel = new ResourceModel({
         //   bundleName: "clf.logistique.chargementquais.i18n.i18n"
        //});
        //this.setModel(i18nModel, "i18n"); 
 // ----------------------EXEMPLE  TYPE DE MESSAGEs---------------------------------------------------
/*		Information : "Information",
	          	Warning : "Warning",
		          Error : "Error",
		          None : "None",
		          Success : "Success"   */ 
     //----------------------------------------------------------------------------------------------------------------------------//
     //               TODO -> Faire une méthode séparée pour enregistrement du modèle de notifications                              //  
     //----------------------------------------------------------------------------------------------------------------------------//
            let notificationsQuaisModel = new JSONModel();
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

     this.open_websocket_NotificationUM();            //LOt 12-> Rest déploiement phm -> A REMETTRE
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
    //    let codum :string   = Object.values(data)[1];  
    //    let msgid :string   = Object.values(data)[2];
    //    let aenam :string   = Object.values(data)[3];
    //    let errdt :string   = Object.values(data)[4];
    //    let errzt :string   = Object.values(data)[5];
    //    let choice :boolean = Object.values(data)[6];
        
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
       let validation_charg_um :boolean = Object.values(data)[7];
       
       
       console.log("P1 LOt15 Chargement manuel scan EVENT ChargementUmPostEvent");
       this.api_chargement_um_post(quai,codum,msgid,aenam,errdt,errzt,choice,validation_charg_um);
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
     //                                                                                                                            //  
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
     // this.getEventBus().publish("Default", "chargementListEvent", {});           //LOt 12-> Rest déploiement phm -> A REMETTRE
      this.getEventBus().publish("Default", "chargementEvent", {});
      this.getEventBus().publish("Default", "chargementListEvent", {});             // MODIF LOT13 =>Le chargement list après le chargement
      this.getEventBus().publish("Default", "chargementStartModelGetEvent", {});    //LOt 12-> Rest déploiement phm -> A REMETTRE
      this.getEventBus().publish("Default", "validationMsgChargementEvent", {});    //LOt 12-> Rest déploiement phm -> A REMETTRE
   
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

           target_chargement_list.attachDisplay(()=>{  this.gv_current_application = this.const_chargementsPrevusApp;}     //Stockage du nom de l'application en cours d'utilisation
                                             );    
           target_quai08.attachDisplay(()=>{ this.gv_current_application = this.const_chargementsQuaisApp;}                //Stockage du nom de l'application en cours d'utilisation
                                      );
           target_quai09.attachDisplay(()=>{ this.gv_current_application = this.const_chargementsQuaisApp;}
                                      );  
           target_quai10.attachDisplay(()=>{ this.gv_current_application = this.const_chargementsQuaisApp;}
                                      );   
           target_quai11.attachDisplay(()=>{ this.gv_current_application = this.const_chargementsQuaisApp;}
                                      );  
           target_quai12.attachDisplay(()=>{ this.gv_current_application = this.const_chargementsQuaisApp;}
                                      );   
           target_quai13.attachDisplay(()=>{ this.gv_current_application = this.const_chargementsQuaisApp;}
                                      );    
           target_quai14.attachDisplay(()=>{ this.gv_current_application = this.const_chargementsQuaisApp;}
                                      ); 
           target_quai15.attachDisplay(()=>{ this.gv_current_application = this.const_chargementsQuaisApp;}
                                      );                                                                                                          
}

    //---------------------------------------------------------------------------------------------------------------------------------//
//     Méthode de récupération des URLS des API                                                                                    //  
//---------------------------------------------------------------------------------------------------------------------------------//
  public getApiUrl() : void{

    //  SAUVEGARDE Evolution déploiement sur PHP
//     if ( location.hostname === 'localhost' ) {          
//         if (this.environment === "dev") {
//                 this.gv_chargementquais_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement"; 
//                 this.gv_validation_msg_chargementquais_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement";    
//                 this.gv_chargementprevus_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement_list"; 
//                 this.gv_startchargement_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";
//                 this.gv_material_umstock_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
//                 this.gv_chargement_um_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement_um";
//         }
//         if (this.environment === "qual") {      
//                 this.gv_chargementquais_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement"; 
//                 this.gv_validation_msg_chargementquais_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement";  
//                 this.gv_chargementprevus_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement_list";            
//                 this.gv_startchargement_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/start_chargement"; 
//                 this.gv_material_umstock_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
//                 this.gv_chargement_um_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement_um";
//         }
//     }
// else {          this.gv_chargementquais_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/chargement";  
//                 this.gv_validation_msg_chargementquais_api_url  = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement";   
//                 this.gv_chargementprevus_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_list";    
//                 this.gv_startchargement_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";   
//                 this.gv_material_umstock_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
//                 this.gv_chargement_um_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_um";            
//     } 
 //  SAUVEGARDE Evolution déploiement sur PHP
    
    let lv_location :string;
   
//  Evolution déploiement sur PHP BEGIN
  if ( location.hostname === 'localhost' ) {                                 // Test en local host avec le proxy ui5 tooling     
           console.log("P1 HIGH Exécution en localhost  pour appel sur environnement :" + this.gv_environment);
           switch (this.gv_environment.toLowerCase()) {
            case 'dev':
               // lv_location = "rest_dev";    //LOT12 A Remettre   //Utilisation du proxy"
                //lv_location = "http://sapdev.exaclair.eu";         //Pas d'utilisation du proxy 
                // lv_location= "https://SHDS-SAPDEV.exaclair.clairefontaine.local:443";           // HTTPS  SHDS-SAPDEV.exaclair.clairefontaine.local:443
                 lv_location= "http://shds-sapdev.exaclair.clairefontaine.local:1080";             // appel sans nunméro de port
                 break;
            case 'bas':
                // TESTS CORS en localhost sur 'environnement BAS |Désactivation du chemin du proxy rest_bac pour désactiver le proxy
              //     lv_location = "rest_bac";                                                  
                lv_location = "https://sexa-sapoc-s4.exaclair.clairefontaine.local:44301";              //HTTPS 
               // lv_location = "http://sexa-sapoc-s4.exaclair.clairefontaine.local:8001";                //HTTP
                // TESTS CORS en localhost sur 'environnement BAS
                 console.log("P1 HIGH Environnement BAS");
                 break;    
            case 'pre':
                lv_location = "rest_qual";
                break;
                case 'prod':                                 // Rajouter le resource ROOT rest_prod dans le ui5.yaml
                lv_location = "rest_prod";
                break;    
            default:
                lv_location = "rest_dev";
                break; 
            }
               
    //   this.gv_chargementquais_api_url = "/" + lv_location  + "/sap/bc/gui/sap/its/zpcf_chargement/chargement";   //TEST CORS SUR EN BAS =>ATTENTION ->Peut être remettre le / après test CORS
     //   this.gv_chargementquais_api_url =  lv_location  + "/sap/bc/gui/sap/its/zpcf_chargement/chargement";    //DEPLOIEMENT PHP
          console.log("P1 HIGH API Chargement des quais: " +   this.gv_chargementquais_api_url);

        //------------------------------------------------ ATTENTION Le / est retiré si on utilise pas le proxy ----------------------------------------------------
        // this.gv_validation_msg_chargementquais_api_url = "/" + lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement";    
        // this.gv_chargementprevus_api_url = "/" + lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_list"; 
        // this.gv_startchargement_api_url = "/" + lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";
        // this.gv_material_umstock_api_url = "/" + lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
        // this.gv_chargement_um_api_url = "/" + lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_um";
        
        //------------------------------------------------ ATTENTION Le / est retiré si on utilise pas le proxy ----------------------------------------------------

 //------------------------------------------------ DEPLOIEMENT PHP BEGIN ----------------------------------------------------
            this.gv_chargementquais_api_url =  lv_location  + "/sap/bc/gui/sap/its/zpcf_chargement/chargement";
            this.gv_validation_msg_chargementquais_api_url = lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement";    
            this.gv_chargementprevus_api_url = lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_list"; 
            this.gv_startchargement_api_url = lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";
            this.gv_endchargement_api_url = lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/end_chargement";
            this.gv_material_umstock_api_url =  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
            this.gv_chargement_um_api_url = lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_um";
 //------------------------------------------------ DEPLOIEMENT PHP END ----------------------------------------------------


}
else {         
                let lv_index: number =      location.hostname.search(/sap/);
        //------------------------------------  DEPLOIEMENT SUR SERVEUR SAP--------------------------------------------------------------------------------------------------
                if (lv_index !== -1) {
                     lv_location = location.host;
              
                 this.gv_chargementquais_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement";  
                this.gv_validation_msg_chargementquais_api_url  = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement";   
                this.gv_chargementprevus_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_list";    
                this.gv_startchargement_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/start_chargement"; 
                this.gv_endchargement_api_url = "https://" + lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/end_chargement";  
                this.gv_material_umstock_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
                this.gv_chargement_um_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_um";     
                } else 
           //------------------------------------  DEPLOIEMENT SUR SERVEUR PHP--------------------------------------------------------------------------------------------------            
                {
                // public  sap_server_dev  :string  = "sapdev.exaclair.eu";    // ADRESSE UI5 YAML SHDS-SAPDEV.exaclair.clairefontaine.local:1080
                // public  sap_server_pre  :string  = "sappre.exaclair.eu";
                // public  sap_server_prod :string  = "sapprod.exaclair.eu";
                    console.log("P1 HIGH Host différent de sap et différent de localhost" +  location.host);
                    // DEPLOIEMENT SUR PHP -> On pointe sur le serveur sAP spécifié dans la variable environnement gv_environement
                     switch (this.gv_environment.toLowerCase()) {
                        case 'dev':
                            //lv_location ="shds-sapdev.exaclair.clairefontaine.local:443";   //s sapdev.exaclair.eu SHDS-SAPDEV.exaclair.clairefontaine.local:443
                            lv_location ="shds-sapdev.exaclair.clairefontaine.local"      // APPEL SANS LE NUM PORT 
                            break;
                        case 'pre':
                            lv_location = "sappre.exaclair.eu";
                            break;
                        case 'bas':
                            //lv_location = "sexa-sapoc-s4.exaclair.clairefontaine.local:8001";
                            lv_location = "sexa-sapoc-s4.exaclair.clairefontaine.local:44301";      //Déploiement en HTTPS
                            break;    
                        case 'prod':
                            lv_location = "sapprod.exaclair.eu";
                            break;    
                        default:
                            lv_location = "sexa-sapoc-s4.exaclair.clairefontaine.local:44301";
                            break; 
                        }
                console.log("P1 HIGH  variable environnement  = " + this.gv_environment + " URL des API" +   lv_location);
                  // TODO -> Essayer le HTTPs sur le serveur PHP  -
                this.gv_chargementquais_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement";  
                this.gv_validation_msg_chargementquais_api_url  = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement";   
                this.gv_chargementprevus_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_list";    
                this.gv_startchargement_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/start_chargement"; 
                this.gv_endchargement_api_url = "https://" + lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/end_chargement";    
                this.gv_material_umstock_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
                this.gv_chargement_um_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_um";
                }   

                //  console.log("P1 HIGH URL des API" +   lv_location);
                // this.gv_chargementquais_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement";  
                // this.gv_validation_msg_chargementquais_api_url  = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement";   
                // this.gv_chargementprevus_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_list";    
                // this.gv_startchargement_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";   
                // this.gv_material_umstock_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
                // this.gv_chargement_um_api_url = "https://" +  lv_location + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_um";         
    }
        //  SAUVEGARDE Evolution déploiement sur PHP END
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
        case 'chargement':
            model_root_path = "/quais/" + current_quai_index_json + "/notifs";
            break;
        case 'startchargement':
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

// Code pour afficher qu'une seule notifications (Si Success alors warning est masqué)     
//      if ( notificationsQuaisModel.setProperty(model_root_path +"/notifsuccess/msg_txt",type_msg == 'information' ? msg_txt : "") == true)
// {
//     console.log(" P1 LOT 7  MAJ de du message Strip de succès" +  msg_txt  );
// }
//       notificationsQuaisModel.setProperty(model_root_path +"/notifsuccess/visible",type_msg == 'information' ? true : true);   // false (Evol on affiche tous les types de notification)

//       notificationsQuaisModel.setProperty(model_root_path + "/notifwarning/msg_txt",type_msg == 'W' ? msg_txt : "");
//       notificationsQuaisModel.setProperty(model_root_path + "/notifwarning/visible",type_msg == 'W' ? true : true);

//       notificationsQuaisModel.setProperty(model_root_path + "/notiferror/msg_txt",type_msg == 'E' ? msg_txt : "");
//       notificationsQuaisModel.setProperty(model_root_path + "/notiferror/visible",type_msg == 'E' ? true : true);

// BEGIN EVOLUTION -> Affichage de plusieurs messsages strip en même temps sur le quai
// Code pour effacer les notifications d'erreur en cas de démarrage de chargement  
if (action == 'startchargement' &&  (( type_msg == 'information' ) || ( type_msg == 'W' )) )
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

    if ( type_msg == 'information' )   // Si la notificaiton est de type information (succès) alors il faut cacher la notification de type erreur
        {
        notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess/msg_txt",msg_txt);
        notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess/visible",true);

        notificationsQuaisModel.setProperty(model_root_path + "/notiferror/msg_txt","");
        notificationsQuaisModel.setProperty(model_root_path + "/notiferror/visible",false);
       
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
        }

    if ( type_msg == 'E' )             // Si la notification est de type erreur alors il faut cacher les notifications de warning ou d'information(Succès)
        {
        notificationsQuaisModel.setProperty(model_root_path + "/notiferror/msg_txt",msg_txt);
        notificationsQuaisModel.setProperty(model_root_path + "/notiferror/visible",true);

        notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess/msg_txt","");
        notificationsQuaisModel.setProperty(model_root_path + "/notifsuccess/visible",false);
        notificationsQuaisModel.setProperty(model_root_path + "/notifwarning/msg_txt","");
        notificationsQuaisModel.setProperty(model_root_path + "/notifwarning/visible",false);

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
      if ( (action  == 'chargement') && ((type_msg == 'V') || (type_msg == 'C')) ) {                 // if ( (action  == 'chargement') && ((type_msg == 'W') || (type_msg == 'C')) ) {
           this.getEventBus().publish("Default", "validationMsgChargementEvent", {});
           if ( this.gv_current_application == this.const_chargementsQuaisApp )     // Anomalie ouverture de la popup de la validation - > La popup ne doit s'ouvrir que si l'utilisateur se trouve sur l'application 
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

  if ((action == 'chargement') && (type_msg == 'information' ) ) // TODO => && ( IconTabBarControl.getSelectedKey() == current_quai
        {
          MessageToast.show(msg_txt);
          this.getEventBus().publish("Default", "chargementEvent", {}); 
          this.getEventBus().publish("Default", "chargementListEvent", {}); "Rechargement de la liste des chargements prévus"
          this.getEventBus().publish("Default", "validationMsgChargementEvent", {});    //LOT 13 
        }

      if ((action == 'dechargement') && (type_msg == 'information' ) ) // TODO => && ( IconTabBarControl.getSelectedKey() == current_quai
        {
          MessageToast.show(msg_txt);
          this.getEventBus().publish("Default", "chargementEvent", {}); 
          this.getEventBus().publish("Default", "chargementListEvent", {}); "Rechargement de la liste des chargements prévus"
          this.getEventBus().publish("Default", "validationMsgChargementEvent", {});    //LOT 13
        }


    if ( (action == 'startchargement') && (type_msg == 'information' ))
      {
      console.log("-----P1-----------------------Notification de fin de chargement ou de début de chargement// Rafraichissement des chargements-------------------------------------------");
      MessageToast.show(msg_txt);
      this.getEventBus().publish("Default", "chargementEvent", {});  //Notification fin de chargement"
      this.getEventBus().publish("Default", "chargementListEvent", {}); "Rechargement de la liste des chargements prévus"
      }


      if ( (action == 'finchargement') )
      {
      console.log("-----P1-----------------------Notification de fin de chargement ou de début de chargement// Rafraichissement des chargements-------------------------------------------");
      MessageToast.show(msg_txt);
      this.getEventBus().publish("Default", "chargementEvent", {});  //Notification fin de chargement"
      this.getEventBus().publish("Default", "chargementListEvent", {}); "Rechargement de la liste des chargements prévus"
      }
}
    onCloseDialog(): void {
      // note: We don't need to chain to the pDialog promise, since this event-handler
      // is only called from within the loaded dialog itself.
    //   (this.byId("busyDialog") as Dialog)?.close();
  }    

    public get_chargements_prevus():void {
        //-----------------------------------------------------------------------------------------
        // BEGIN LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification
        //----------------------------------------------------------------------------------------
        // var mHeader = {
        //   c
        //     "Access-Control-Allow-Origin": "*",
        //     "Content-Type":"application/json",
        // }
          var mHeader = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",
        }

        //-----------------------------------------------------------------------------------------
        // END LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification
        //----------------------------------------------------------------------------------------

        let chargementsPrevusListModel: JSONModel;
        if ( this.getModel("chargementsPrevusListModel") == undefined)
        {
            chargementsPrevusListModel = new JSONModel();
            this.setModel(chargementsPrevusListModel, "chargementsPrevusListModel");
        }else
        {  
            console.log("Relance du chargement list"),
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
    //-----------------------------------------------------------------------------------------
    // END LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification (Paramètre authorization retiré)
    //----------------------------------------------------------------------------------------
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
       

        let userName:string = "";                        
        let password:string = "";
       if ( this.gv_environment == 'dev')

       {
         userName = "GCAMILLERI";                           //TODO SEPTEMBER 2025 => ???
         password = "*Malaga3043";

       }

       if ( this.gv_environment == 'bas')

       {

         userName = "GCAMILLERI";                           //TODO SEPTEMBER 2025 => ???
         password = "*Malaga3043";
         console.log("P1 VERY HIGH : userName:" + userName + "Password: " + password);
       }
        // let userName = "GCAMILLERI";                           //TODO SEPTEMBER 2025 => ???
        // let password = "*Malaga3043";
        let credentials = userName + ':' + password;
        let hash = btoa(credentials);
        let auth = 'Basic '+hash;

//  //"Authorization": "Basic",
//         var mHeader = {
//             "Authorization": auth,
//             "Access-Control-Allow-Origin": "*",
//             "Content-Type":"application/json",
//             "X-CSRF-Token" :  "Fetch"                                                                   //LOOT4
//         }

    //---------------------------------------------------------------------------------------------------------------------------
    // BEGIN LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification (Paramètre authorization retiré)
   //----------------------------------------------------------------------------------------------------------------------------

        //    var mHeader = {
        //     "Access-Control-Allow-Origin": "http://localhost",
        //     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        //     "Access-Control-Allow-Headers" : "Authorization, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Allow-Credentials ",
        //     "Access-Control-Allow-Credentials" : true,
        //     "Content-Type":"application/json",
        //     "X-CSRF-Token" :  "Fetch"                                                                   //LOOT4
        // }
        //-----------------------------------------------------------------------------------------
        // END LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification
        //----------------------------------------------------------------------------------------

       //-----------------------------------------------------------------------------------------
        // Essai envoi de requête simples pour ne pas générer de préflight   + TEst allow-origin explicite
        //----------------------------------------------------------------------------------------
        //   var mHeader = {
           
        //     "Access-Control-Allow-Origin": "http://localhost",                                //"Access-Control-Allow-Origin": "*",  -> A essayer aussi https://sclf-webopc
        //     "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        //     "Access-Control-Allow-Headers" : "Authorization, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Allow-Credentials",

        //     "Content-Type":"application/json"
        //   }


        //-----------------------------------------------------------------------------------------
        // TESTS PHP->DEV
        //----------------------------------------------------------------------------------------
           var mHeader = {     
            // "Authorization": auth,                           // Essai pas d'autorisation
             "Content-Type":"application/json",
           }


        // TESTS DEPMOIEMENT PHP
//  var mHeader = {
            
//             "Access-Control-Allow-Origin": ["*"],
//             "Content-Type":"application/json"
//           }

         //-----------------------------------------------------------------------------------------
        // Essai envoi de requête simples pour ne pas générer de préflight
        //----------------------------------------------------------------------------------------

// On instancie le modèle que s'il n'est pas déja défini au niveau du composant (premier chargement/rechargement)
     let  chargementQuaiModel: JSONModel;
     if ( this.getModel("chargementModelJson") == undefined)
     {
        chargementQuaiModel = new JSONModel();
        this.setModel(chargementQuaiModel, "chargementModelJson");
     }else
     {  
         console.log("Relance du chargement list"),
         chargementQuaiModel =   this.getModel( "chargementModelJson") as JSONModel;
     }
    
     // TODO LOT4 => RECUPERER LE TOKEN CSRF du GET
     //var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
     console.log("P1 HIGH URL API Chargement  des quais au moment de l'appel de l'API: " + this.gv_chargementquais_api_url ); 
     chargementQuaiModel.loadData(this.gv_chargementquais_api_url,"",true,  "GET", false, true, mHeader)?.then((data) => {   this.getEventBus().publish("Default", "chargementFinishedEvent", {});
                             console.log("DATA DANS LE PROMISE DU GET" + data)       });
     
     chargementQuaiModel.attachRequestCompleted(function (evt) { console.log("PARAMETRES RESPONSE HEADER:" +evt); });
     console.log("Fin Chargement de l'API : " + this.gv_chargementquais_api_url); 
    }

    //----------------------------------------------------------------------------------------------------------------------------//
    //            LOT10:  Méthode d'appel à l'API  REST des messages de validation des chargements sur les quais                  //  
    //----------------------------------------------------------------------------------------------------------------------------//
    public get_validation_msg_chargements():void {
        // ancienne verssion des paramètres de header pour déploiement PHP 
        //    var mHeader = {
        //     "Access-Control-Allow-Origin": "*",
        //     "Content-Type":"application/json",
        //     "X-CSRF-Token" :  "Fetch"                                                                   
        // }

               var mHeader = {
             "Content-Type":"application/json",
              }

    //  let  validationMsgChargementQuaiModelJSON: JSONModel;
    //  if ( this.getModel("validationMsgChargementQuaiModelJSON") == undefined)
    //  {
    //     validationMsgChargementQuaiModelJSON = new JSONModel();
    //     this.setModel(validationMsgChargementQuaiModelJSON, "validationMsgChargementQuaiModelJSON");
    //  }else
    //  {  
    //     validationMsgChargementQuaiModelJSON =   this.getModel( "validationMsgChargementQuaiModelJSON") as JSONModel;
    //  }

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
            //"tmotifnocharg": input_data.tMotifNocharg,    // Object.values(input_data)[0]  //TODO => Essayer de passer les paramètre dans le Body du POST
            "tknum": input_data.tknum,    // Object.values(input_data)[0]  //TODO => Essayer de passer les paramètre dans le Body du POST
            "quai1":  input_data.quai1,   
        }

   // Appel de l'api de fin de chargement    
   finChargementQuaiModelJSON.loadData(this.gv_endchargement_api_url , JSON.stringify(input_data.tMotifNocharg)    ,true,  "POST", false, true, mHeader)?.then(result=>{
        const router = this.getRouter();
         let lv_target_quai : string = "targetstartchargement" + input_data.quai1;
       // MessageToast.show("Fin de chargement sur quai : " + input_data.quai1 + " et navigation sur Target:" +  lv_target_quai,{ duration: 4000, width : '50%' })
        this.getEventBus().publish("Default", "finChargementEvent", {});
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
  
        /* EXEMPLE DE POST
            loadData("https://your url",  // sURL
        {}, //oParameters
        true, // bASync
        "POST", // sType
        true/false, // bMerge
        true/false, // BCache?
        { // mHeaders
                            "X-Requested-With": "XMLHttpRequest",
                            "Content-Type": "application/json",
                            "DataServiceVersion": "2.0",
                            "Accept": "application/atom+xml,application/atomsvc+xml,application/xml",
                            "X-CSRF-Token": "0e855895-5023-4350-bd3e-5651beaadeae"
        } )*/  
       
    //-----------------------------------------------------------------------------------------
    // BEGIN LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification (Paramètre authorization retiré)
    //----------------------------------------------------------------------------------------                     
        //    let mHeader = {
        //     "Access-Control-Allow-Origin": "*",
        //     "Content-Type":"application/json",  
        //     "X-Requested-With":"X"
            
        // }
     //-----------------------------------------------------------------------------------------
    // END LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification (Paramètre authorization retiré)
    //----------------------------------------------------------------------------------------

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
            //ChargementStartModel.set
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
         this.getEventBus().publish("Default", "chargementStartModelGetEvent", {});
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
            "quai1":  i_quai 
        }
     //-----------------------------------------------------------------------------------------
    // END LOT 12 : Déploiement PHP
    //----------------------------------------------------------------------------------------
         ChargementUmModel.loadData(this.gv_chargement_um_api_url,"",true,  "GET", false, true, mHeader);
    }

     //---------------------------------------------------------------------------------------------------------------------------------//
     //               Méthode d'appel à l'API  REST de lancement du chargement d'un quai  [ZCL_PCF_START_CHARG_RESOURCE/Méthode POST ]  //  
     //---------------------------------------------------------------------------------------------------------------------------------//
    public api_chargement_um_post(i_quai:string,i_codum:string, i_msgid :string, i_aenam:string , i_errdt:string, i_errzt:string, i_choice:boolean, i_validation_charg_um :boolean) :void{
       
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

    //    let mHeader = {
    //         "Authorization": "Basic",                    

              let mHeader = {
            "Access-Control-Allow-Origin": "*",
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
     console.log("P1 LOt15 Valeur de i_validation_charg_um :" + i_validation_charg_um);
      if ( i_validation_charg_um == false ) // Si c'est un chargement manuel on déclenche la navigation. Si c'est une validation de chargement on ne déclenche pas la navigation
      {
        lv_target_quai = "targetchargement" + i_quai.toLowerCase();
        const router = this.getRouter();
        console.log("P1 Navigation vers le quai avec target " + lv_target_quai);
         
        //router.getTargets()?.display(lv_target_quai); // La navigation n'est pas forcément utile -> A tester
        this.getEventBus().publish("Default", "CloseManualScanPopupEvent", {}); 
        this.getEventBus().publish("Default", "validationMsgChargementEvent", {});  // LOT15 Rappel du modèle de validation de chargment -> Réfléchir si c'est nécessaire ou le mettre dans le handler du routing
      }

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
         
        if ( location.hostname === 'localhost' ) {
        console.log("Lancement des Web Socket en localhost : " + this.gv_environment);
          if (this.gv_environment === "dev") {
                lv_url = "odata_dev/sap/bc/apc/sap/ychargement_camion_poc"; 
                console.log("Web Socket de la dev : odata_dev/sap/bc/apc/sap/ychargement_camion_poc");    
           }
          else {
                    if (this.gv_environment === "qual") {
                            console.log("Web Socket de la qual : : rest_qual/sap/bc/apc/sap/ychargement_camion_poc");    
                            lv_url = "rest_qual/sap/bc/apc/sap/ychargement_camion_poc"; }  
                    else {  console.log("Web Socket de la dev : odata_dev/sap/bc/apc/sap/ychargement_camion_poc");
                            lv_url = "odata_dev/sap/bc/apc/sap/ychargement_camion_poc";   } 
                }
        }
          else // Si pas en localhost => Possibilité de simplifier le code Mettre location + chemin du Websocket dans tous les cas
         { 
            lv_url = "https://" + location.host + "/sap/bc/apc/sap/ychargement_camion_poc";
         } 
         console.log("Instantiation du Web Socket avec url :" + lv_url);
         let v_webSocket = new WebSocket(lv_url);
         let data_Socket : Object = '';
 
         v_webSocket.attachOpen(function (e: Event) {
             console.log("Ouverture du Web Socket");
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
             that.getEventBus().publish("Default", "notificationWebSocketEvent",  data);   // Il est possible d'essayer avec    that.getEventBus().publish("Default", "notificationUMEvent",  content_json)
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