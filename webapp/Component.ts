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
// LOT7- 18/09/2025- GILLES CAMILLERI LOT 7 => Modèle de Notifications au niveau du component 
// LOT8- 18/09/2025- GILLES CAMILLERI => Boîte de dialogue de validation de chargement
// LOT9- 08/10/2025- GILLES CAMILLERI => Validation des messages de Warning par appel API et passage du contexte 
// LOT10-16/10/2025- GILLES CAMILLERI => Problématique Authentification RESTAPI -> Essai pas d'authentification
// LOT11-14/11/2025- GILLES CAMILLERI => Anomalie Popup de validation des quais s'affiche dans liste des chargements + Anomalie synchronisation routing/selected key de l'IconTabBar

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

    public _environment :String = "dev";
    public gv_chargement_url : string;
    public gv_chargement_um_api_url: string;          // URL API startchargement
    public gv_startchargement_api_url: string;          // URL API startchargement
    public gv_chargementquais_api_url: string;          // URL API chargement des quais
    public gv_validation_msg_chargementquais_api_url: string;                                                                     //gv_validation_msg_chargementquais_api_url
    public gv_chargementprevus_api_url: string;         // URL API Chargement prévus
    public gv_material_umstock_api_url: string;         // URL material_umstock_list
    public const_chargementsPrevusApp = "ChargementsPrevusApp";  // Application Chargement prévues
    public const_chargementsQuaisApp = "ChargementsQuaisApp";    // Application Chargement des quais
    public gv_current_application: string;                       // Stocke le nom de l'application actuellement affiché (Liste des chargmentn ou Chargement des quais)
    //private gv_dialog_validation_charg: Dialog;
    public get environment(): String {
        return this._environment;
    }
    public set environment(value: String) {
        this._environment = value;
    }
	public init() : void {
		// call the base component's init function
		super.init();
        // Changemment de variable environnement (dev ou qual) pour appeler les API de la qual ou de la dev
        this.environment = 'dev';
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
            "um" : "",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            }
             
        },
        {
            "quai": "quai09",
            "um" : "",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            }
            
        },
        {
            "quai": "quai10",
            "um" : "",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            }
            
        },
        {
            "quai": "quai11",
            "um" : "",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror"   : {"msg_txt": "","visible": false    },
            }
            
        },
        {
            "quai": "quai12",
            "um" : "",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            }
            
        },
        {
            "quai": "quai13",
            "um" : "",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            }
            
        },
        {
            "quai": "quai14",
            "um" : "",
             "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            }
            
        },
        {
        "quai": "quai15",
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

     this.open_websocket_NotificationUM();
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
     //               HANDLER pour Validation UM                                                                       //  
     //----------------------------------------------------------------------------------------------------------------//
    this.getEventBus().subscribe("Default","ValidationWarningUMEvent", (channel:string,event:string,data: Object) => { 
       console.log("chargementStartEvent"); 
      //----------------------------------------------------------------------------------------------------------------//
      //---- LOT 9 Validation des messages de Warning TODO )                                                            //
      //----------------------------------------------------------------------------------------------------------------//
       let quai :number    = Object.values(data)[0];  
       let codum :string   = Object.values(data)[1];  
       let msgid :string   = Object.values(data)[2];
       let aenam :string   = Object.values(data)[3];
       let errdt :string   = Object.values(data)[4];
       let errzt :string   = Object.values(data)[5];
       let choice :boolean = Object.values(data)[6];
        
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
    console.log("P1 LOT 7 Valeur du paramètre de notification time: " + Object.values(data)[7] + " CHECK_ID: " + Object.values(data)[8]);

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
     this.getEventBus().publish("Default", "chargementListEvent", {});
     this.getEventBus().publish("Default", "chargementEvent", {});
     this.getEventBus().publish("Default", "chargementStartModelGetEvent", {});
     this.getEventBus().publish("Default", "validationMsgChargementEvent", {});
   
      const router = this.getRouter().initialize();   
      
         let target_chargement_list: Target = router.getTarget("TargetChargementList") as Target;
         let target_quai08: Target = router.getTarget("TargetChargementQuai08") as Target;
         let target_quai09: Target = router.getTarget("TargetChargementQuai09") as Target;
         let target_quai10: Target = router.getTarget("TargetChargementQuai10") as Target;
         let target_quai11: Target = router.getTarget("TargetChargementQuai11") as Target;
         let target_quai12: Target = router.getTarget("TargetChargementQuai12") as Target;
         let target_quai13: Target = router.getTarget("TargetChargementQuai13") as Target;
         let target_quai14: Target = router.getTarget("TargetChargementQuai14") as Target;
         let target_quai15: Target = router.getTarget("TargetChargementQuai15") as Target;

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
    if ( location.hostname === 'localhost' ) {          
        if (this.environment === "dev") {
                this.gv_chargementquais_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement"; 
                this.gv_validation_msg_chargementquais_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement";    
                this.gv_chargementprevus_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement_list"; 
                this.gv_startchargement_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";
                this.gv_material_umstock_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
                this.gv_chargement_um_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement_um";
        }
        if (this.environment === "qual") {      
                this.gv_chargementquais_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement"; 
                this.gv_validation_msg_chargementquais_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement";  
                this.gv_chargementprevus_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement_list";            
                this.gv_startchargement_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/start_chargement"; 
                this.gv_material_umstock_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
                this.gv_chargement_um_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement_um";
        }
    }
else {          this.gv_chargementquais_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/chargement";  
                this.gv_validation_msg_chargementquais_api_url  = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/valid_msg_chargement";   
                this.gv_chargementprevus_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_list";    
                this.gv_startchargement_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";   
                this.gv_material_umstock_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
                this.gv_chargement_um_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_um";            
    }                     
          
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
        }

      if ((action == 'dechargement') && (type_msg == 'information' ) ) // TODO => && ( IconTabBarControl.getSelectedKey() == current_quai
        {
          MessageToast.show(msg_txt);
          this.getEventBus().publish("Default", "chargementEvent", {}); 
          this.getEventBus().publish("Default", "chargementListEvent", {}); "Rechargement de la liste des chargements prévus"
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
        //     "Authorization": "Basic",
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
//         let userName = "USERNAME";                           //TODO SEPTEMBER 2025 => ???
//         let password = "PASSWORD";
//         let credentials = userName + ':' + password;
//         let hash = btoa(credentials);
//         let auth = 'Basic '+hash;

//  //"Authorization": "Basic",
//         var mHeader = {
//             "Authorization": auth,
//             "Access-Control-Allow-Origin": "*",
//             "Content-Type":"application/json",
//             "X-CSRF-Token" :  "Fetch"                                                                   //LOOT4
//         }

    //-----------------------------------------------------------------------------------------
    // BEGIN LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification (Paramètre authorization retiré)
   //----------------------------------------------------------------------------------------

           var mHeader = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",
            "X-CSRF-Token" :  "Fetch"                                                                   //LOOT4
        }
        //-----------------------------------------------------------------------------------------
        // END LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification
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
     console.log("P1 URL  API Chargement  des quais: " + this.gv_chargementquais_api_url ); 
     chargementQuaiModel.loadData(this.gv_chargementquais_api_url,"",true,  "GET", false, true, mHeader)?.then((data) => {   this.getEventBus().publish("Default", "chargementFinishedEvent", {});
                             console.log("DATA DANS LE PROMISE DU GET" + data)       });
     
     chargementQuaiModel.attachRequestCompleted(function (evt) { console.log("PARAMETRES RESPONSE HEADER:" +evt); });
     console.log("Fin Chargement de l'API : " + this.gv_chargementquais_api_url); 
    }

    //----------------------------------------------------------------------------------------------------------------------------//
    //            LOT10:  Méthode d'appel à l'API  REST des messages de validation des chargements sur les quais                  //  
    //----------------------------------------------------------------------------------------------------------------------------//
    public get_validation_msg_chargements():void {
           var mHeader = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",
            "X-CSRF-Token" :  "Fetch"                                                                   
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
           let mHeader = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",  
            "X-Requested-With":"X"
            
        }
     //-----------------------------------------------------------------------------------------
    // END LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification (Paramètre authorization retiré)
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
       // MessageToast.show("Chargement démarré sur le quai : " + i_quai ,{ duration: 3000, width : '50%' })
        i_quai = i_quai.toLowerCase();
        i_quai = i_quai.replace(/^\w/, (c) => c.toUpperCase());
        lv_target_quai = "TargetChargement" + i_quai; 
        const router = this.getRouter();
        console.log("P1 Navigation vers le quai avec target " + lv_target_quai); 
         this.getEventBus().publish("Default", "chargementStartModelGetEvent", {});
         router.getTargets()?.display(lv_target_quai);           // TODO -> Remis après refonte du modèle de notification car manquant
                                                                                                                      },reason=>{  console.log("P1 REJECTED PROMISE POST StartChargment" + ChargementStartModel.getJSON.toString());
                                                                                                             }); 
    }

     //---------------------------------------------------------------------------------------------------------------------------------//
     //               Méthode d'appel à l'API  REST de lancement du chargement d'un quai  [ZCL_PCF_START_CHARG_RESOURCE/Méthode POST ]  //  
     //---------------------------------------------------------------------------------------------------------------------------------//
    public api_chargement_um_post(i_quai:number,i_codum:string, i_msgid :string, i_aenam:string , i_errdt:string, i_errzt:string, i_choice:boolean) :void{
       
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
    // TODO => Rappel de l'API de récupération des messages de Validation de chargement
     this.getEventBus().publish("Default", "validationMsgChargementEvent", {});
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
        console.log("Lancement des Web Socket en localhost : " + this.environment);
          if (this.environment === "dev") {
                lv_url = "odata_dev/sap/bc/apc/sap/ychargement_camion_poc"; 
                console.log("Web Socket de la dev : odata_dev/sap/bc/apc/sap/ychargement_camion_poc");    
           }
          else {
                    if (this.environment === "qual") {
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
            console.log("e.getParameters() " + e.getParameters() );  
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