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
 

// LOT 6 => Lancement du démarrage du chargemnet à partir du quai
// 18/09/2025 LOT 7 => Modèle de Notifications au niveau du component 

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

    //private _wsNotificationUm: WebSocket;                                 //TODO -> Delete 
    //public get wsNotificationUm(): WebSocket {                           //TODO -> Delete 
      //  return this._wsNotificationUm;                                   //TODO -> Delete 
   // }                                                                   //TODO -> Delete 
//public set wsNotificationUm(value: WebSocket) {                         //TODO -> Delete 
    //    this._wsNotificationUm = value;                                //TODO -> Delete 
   // }                                                                 //TODO -> Delete 
    public _environment :String = "dev";
    public gv_chargement_url : string;
    public gv_startchargement_api_url: string;          // URL API startchargement
    public gv_chargementquais_api_url: string;          // URL API chargement des quais
    public gv_chargementprevus_api_url: string;         // URL API Chargement prévus
    public gv_material_umstock_api_url: string;         // URL material_umstock_list
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
        //Définition d'un view Model pour le busy
        //let ChargementViewModel = new JSONModel();    
        //this.setModel(ChargementViewModel, "chargementViewModel");

      // let chargementQuaiSelectionDateModel = new JSONModel();  
       //chargementQuaiSelectionDateModel.setDefaultBindingMode("TwoWay")           
       //this.setModel(chargementQuaiSelectionDateModel, "chargementQuaiSelectionDateModel");                       
       //let oDateFormat = DateFormat.getDateInstance({
       //     format: "yyyyMMdd",                               //""   "dd-MM-yyyy"
        //    pattern: "YYYYMMdd"
        //}); 
    
       // La classe UI5Date n'existe pas sur le serveur-> Mettre à jour la version SAPUI5 sur le serveur
      // chargementQuaiSelectionDateModel.setData({
        //    datechargement:  oDateFormat.format(UI5Date.getInstance(2023,2,7)),
        //});
        //chargementQuaiSelectionDateModel.setData({
       //       datechargement:  oDateFormat.format(new Date()),                 // On initialise à la date du jour pour les tests en DEV
       // });    

       // ----------------------EXEMPLE  ALIMENTATION DES MESSAGEs---------------------------------------------------
    //   "notif_txt_all": [{ "msg_txt" : "TEST NOTIF ALL 1 ", "type_msg" : "Success"},
    //   { "msg_txt" : "TEST NOTIF ALL 2 ",   "type_msg" : "Warning"},
    //   { "msg_txt" : "TEST NOTIF ALL 3 ",  "type_msg" : "Information"},
    //  { "msg_txt" : "TEST NOTIF ALL 4 ",   "type_msg" : "Error"}, 
    //  { "msg_txt" : "TEST NOTIF ALL 5 ",  "type_msg" : "None"} 
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
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            },
        },
        {
            "quai": "quai09",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false    },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            },
        },
        {
            "quai": "quai10",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false   },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            },
        },
        {
            "quai": "quai11",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false   },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            },
        },
        {
            "quai": "quai12",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false   },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            },
        },
        {
            "quai": "quai13",
            "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false   },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            },
        },
        {
            "quai": "quai14",
             "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false   },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            },
        },
        {
            "quai": "quai15",
           "notifs": {
                "notifsuccess" : {"msg_txt": "","visible": false   },
                "notifwarning" : {"msg_txt": "","visible": false    },
                "notiferror" :   {"msg_txt": "","visible": false    },
            },
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

     this.open_websocket_NotificationUM();
     // Abonnement à l'eventing
     //----------------------------------------------------------------------------------------------------------------------------//
     //               TODO -> Mettre tous les listeners dans une  méthode                                                            //  
     //----------------------------------------------------------------------------------------------------------------------------//
     this.getEventBus().subscribe("Default","chargementEvent",() => { 
        console.log("ChargementEvent");
        //let chargementViewModel: JSONModel;                                                 TODELETE 15/09/2025
       // chargementViewModel =  this.getModel("chargementViewModel") as JSONModel;           TODELETE 15/09/2025
       // chargementViewModel.setData({                                                       TODELETE 15/09/2025
       //     busy :  true                                                                    TODELETE 15/09/2025
       // });                                                                                 TODELETE 15/09/2025
        this.get_chargement_quais();
        //chargementViewModel.setData({                                                      TODELETE 15/09/2025
        //    busy :  false                                                                  TODELETE 15/09/2025
        //});                                                                                TODELETE 15/09/2025
     } );
     //----------------------------------------------------------------------------------------------------------------//
     //               HANDLER pour Appel de l'API REST de récupération des chargements prévus                          //  
     //----------------------------------------------------------------------------------------------------------------//
     this.getEventBus().subscribe("Default","chargementListEvent",() => {       
        this.get_chargements_prevus();
     } ); 
     //----------------------------------------------------------------------------------------------------------------//
     //               HANDLER pour Appel de l'API REST de récupération des chargements prévus                          //  
     //----------------------------------------------------------------------------------------------------------------//
     this.getEventBus().subscribe("Default","chargementStartEvent", (channel:string,event:string,data: Object) => { 
        console.log("chargementStartEvent"); 
       let quai :string = Object.values(data)[0];  
       this.startchargementquai_post(quai);
     }, this ); 
     //----------------------------------------------------------------------------------------------------------------        //
     //               HANDLER pour Appel de l'API REST de lAPI REST Chargement Start Model (Matchcodes du formulaire de saisie)//  
     //----------------------------------------------------------------------------------------------------------------        //
     this.getEventBus().subscribe("Default","chargementStartModelGetEvent",() => { 
        //------ Envoi d'une notification à la vue ChargementStart pour rendre invisible les messagesStrip----
        this.getEventBus().publish("Default", "InitializeChargementStartMessageStripEvent", {});    
        //------ Récupération des matchcodes du formulaire de saisie de démarrge d'un nouveau Chargement------
        this.ChargementStartModel_Get();     // Démarrage du chargment
     } ); 

         this.getEventBus().subscribe("Default","notificationWebSocketEvent",(channel:string,event:string,data: Object) => {           
            // EVOL : Notification en fin de chargementTODO ajout de l'action en paramètre
            console.log("-----------------------------------notificationWebSocketEvent Event----------------------------------------------");
            console.log("P1 LOT 7 Valeur du paramètre de notification time: " + Object.values(data)[7]);

            //this.getEventBus().publish("Default", "notificationUMEvent",  data);      //=> LOT 7 Les notifications seront affichées par binding du component controlleur au vues
             this.notificationWebSocketHandler(Object.values(data)[0],Object.values(data)[1],Object.values(data)[2],Object.values(data)[3],Object.values(data)[4],Object.values(data)[5], Object.values(data)[6], Object.values(data)[7]);  
          

        },this); 

     //----------------------------------------------------------------------------------------------------------------------------//
     //               HANDLER pour Appel de l'API REST de lAPI REST Chargement Start Model (Matchcodes du formulaire de saisie)    //  
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
   
     this.getRouter().initialize();   // Le router ne doit pas être forcément utilisé 
	};

//---------------------------------------------------------------------------------------------------------------------------------//
//     Méthode de récupération des URLS des API                                                                                    //  
//---------------------------------------------------------------------------------------------------------------------------------//
  public getApiUrl() : void{
    if ( location.hostname === 'localhost' ) {          
        if (this.environment === "dev") {
                this.gv_chargementquais_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement";    
                this.gv_chargementprevus_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement_list"; 
                this.gv_startchargement_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";
                this.gv_material_umstock_api_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
        }
        if (this.environment === "qual") {      
                    this.gv_chargementquais_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement"; 
                    this.gv_chargementprevus_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement_list";            
                    this.gv_startchargement_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/start_chargement"; 
                    this.gv_material_umstock_api_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
        }
    }
    else {           this.gv_chargementquais_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/chargement";   
                     this.gv_chargementprevus_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_list";    
                     this.gv_startchargement_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";   
                     this.gv_material_umstock_api_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";            
    }         
}
//---------------------------------------------------------------------------------------------------------------------------------//
//                                                                                                                                 //  
//---------------------------------------------------------------------------------------------------------------------------------// 
    public notificationWebSocketHandler(type_msg:string, msg_txt: string,transport:string, um: String, current_quai: string, action :string, user:string, time:any ) : void{ 
          
      let current_quai_index_json:number;
      let type_msg_strip : string;
      let model_root_path: string;
      let notificationsQuaisModel : JSONModel  = this.getModel("notificationsQuaisModel") as JSONModel;
    //  let input_data:any = notificationsQuaisModel.getData(); 
      // 1 TODO Récupération de l'indice ou de l'ID du quai concerné par modification => Récupérer l'indice du quai à partir du current_quai
      console.log("------------------------------------COMPONENT CONTROLLER/Méthode notificationWebSocketHandler-----------------------------------------------");  
      current_quai_index_json = Number(current_quai.slice(4,6));
      current_quai_index_json =   current_quai_index_json - 8 ;
      console.log("QUAI = " + current_quai + " /Valeur de l'indice json  du quai: " +  current_quai_index_json + "/Type de Message:" + type_msg)
      console.log("------------------------------------MAJ des notififications dans le modèle de notification-----------------------------------------------");  

      // TODO  LOT7  A changer c'est plus subtil que cela si startchargement et Succes alors il faut pointer sur le root path des quais  (Path /chargementstartnotifs)
      //------------------En fonction du type d'action et du du type de message on enregistre la notification dans le modèle de notifications des quais  /quais/{indice_quai}/notifs
      //----------------- dans le  modèle de notifications le démarrage du chargement (Path /chargementstartnotifs)
    switch (action) {
        case 'chargement':
            model_root_path = "/quais/" + current_quai_index_json + "/notifs";
            break;
        case 'startchargement':
          if ( ( type_msg == 'W' )  || ( type_msg == 'E' ) )
          {
              model_root_path = "/chargementstartnotifs";
                break;
          }
          else
          {      if    ( type_msg == 'information' ) {    model_root_path = "/quais/" + current_quai_index_json + "/notifs";    break; }      
          }
        default:
            model_root_path = "/quais/" + current_quai_index_json + "/notifs";
            break;
    }
      console.log("-----P1--------- LOT 7 Modèle root path :" + model_root_path  );
     if ( notificationsQuaisModel.setProperty(model_root_path +"/notifsuccess/msg_txt",type_msg == 'information' ? msg_txt : "") == true)
{
    console.log(" P1 LOT 7  MAJ de du message Strip de succès" +  msg_txt  );
}
      notificationsQuaisModel.setProperty(model_root_path +"/notifsuccess/visible",type_msg == 'information' ? true : false);

      notificationsQuaisModel.setProperty(model_root_path + "/notifwarning/msg_txt",type_msg == 'W' ? msg_txt : "");
      notificationsQuaisModel.setProperty(model_root_path + "/notifwarning/visible",type_msg == 'W' ? true : false);

      notificationsQuaisModel.setProperty(model_root_path + "/notiferror/msg_txt",type_msg == 'E' ? msg_txt : "");
      notificationsQuaisModel.setProperty(model_root_path + "/notiferror/visible",type_msg == 'E' ? true : false);
    
    console.log("Strip Error Text : "+ notificationsQuaisModel.getProperty(model_root_path + "/notiferror/msg_txt"));
    console.log("Strip success Text : "+ notificationsQuaisModel.getProperty(model_root_path + "/notifsuccess/msg_txt"));
    console.log("Strip Warning Text : "+ notificationsQuaisModel.getProperty(model_root_path + "/notifwarning/msg_txt"));

  
    //  notificationsQuaisModel.updateBindings(true);
    // Enregistrement dans la zone message_all
            
      console.log("------------------------------------MAJ des notififications ALL QUAIS dans le modèle de notification-----------------------------------------------"); 
                switch (type_msg) {
            case 'information':
            type_msg_strip = "Success";
            break;
            case 'W':
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

      if ( action == 'finchargement'  ||  action == 'startchargement')
      {
      console.log("-----P1-----------------------Notification de fin de chargement ou de début de chargement// Rafraichissement des chargements-------------------------------------------");
      MessageToast.show(msg_txt);
      this.getEventBus().publish("Default", "chargementEvent", {});  //Notification fin de chargement"
      this.getEventBus().publish("Default", "chargementListEvent", {}); "Rechargement de la liste des chargements prévus"
      }
}

    public get_chargements_prevus():void {
//     BEGIN DELETE SPTEMBER 2025
//    let date_chargement_modelformat : string  =     this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement");
//    let date_sapformat : string;
//    let date_tsformat : string;
//    console.log("this.getModel(chargementQuaiSelectionDateModel)?.getProperty(/datechargement)"  + this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement"));

//    if (date_chargement_modelformat.includes("/"))
//    {
//     let lv_jour : string  = date_chargement_modelformat.slice(0,2);
//     let lv_mois : string  = date_chargement_modelformat.slice(3,5)  ;
//     let lv_annee : string  = date_chargement_modelformat.slice(6,10);
//     console.log("Jour: " + lv_jour);
//     console.log("Mois: " + lv_mois);
//     console.log("Annee: " + lv_annee);
//     date_tsformat = lv_annee +"-"+ lv_mois + "-" + lv_jour;
//     date_sapformat = lv_annee + lv_mois + lv_jour;
//     console.log("Data au format sAP durant rechargement:"  + date_sapformat);
//     //console.log("Date Sélection dans méthode chargement après formatage:" + oDateFormat.format(new Date(date_tsformat)));
// }
// else
// {   console.log("Date Sélection dans méthode chargement au format SAP:" + this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement"));
//     date_sapformat = date_chargement_modelformat;
// } 

//     ENDDELETE SPTEMBER 2025
        var mHeader = {
            "Authorization": "Basic",
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",
            "datechargementquai": ""             // TODO SEPTEMBER 2025 => Retirer le paramètre    // oDateFormat.format(new Date(date_tsformat))
        }

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
     
    //  let lv_chargement_url : string;
    //  if ( location.hostname === 'localhost' ) // Lancement de l'application en localhost
    //  {
    //     console.log("Lancement de l'appli en localhost");
    //     if (this.environment === "dev") {lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement_list"; }
    //     else {
    //                 if (this.environment === "qual") {lv_chargement_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement_list"; }  //TODO -> Ajouter proxy quaal
    //                 else {  lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement_list";   } 
    //             }
    //  }
    //   else // Lancement sur les serveurs SAP
    //   { 
    //     lv_chargement_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_list";
    //  }
    //  console.log("Chargement de l'API : " + lv_chargement_url);
     chargementsPrevusListModel.loadData(this.gv_chargementprevus_api_url,"",true,  "GET", false, true, mHeader); 
     //chargementsPrevusListModel.forceNoCache(true);
     //chargementsPrevusListModel.updateBindings(true);
    }

     //----------------------------------------------------------------------------------------------------------------------------//
     //               Méthode d'appel à l'API  REST de récupération des stocks d'un article                                        //  
     //----------------------------------------------------------------------------------------------------------------------------//
  public get_material_umstock_list(material:string):void {
 
    // Mettre le material en paramètre
        var mHeader = {
            "Authorization": "Basic",
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
     
    //  let lv_chargement_url : string;
    //  if ( location.hostname === 'localhost' ) // Lancement de l'application en localhost
    //  {
    //     console.log("Lancement de l'appli en localhost");
    //     if (this.environment === "dev") {lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list"; }
    //     else {
    //                 if (this.environment === "qual") {lv_chargement_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list"; }  //TODO -> Ajouter proxy quaal
    //                 else {  lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";   } 
    //             }
    //  }
    //   else // Lancement sur les serveurs SAP
    //   { 
    //     lv_chargement_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
    //  }
    //console.log("Chargement de l'API : " + lv_chargement_url);
    MaterialUmStockListModel.loadData(this.gv_material_umstock_api_url,"",true,  "GET", false, true, mHeader); 
    }

      //----------------------------------------------------------------------------------------------------------------------------//
     //               Méthode d'appel à l'API  REST de chargement des quais                                                        //  
     //----------------------------------------------------------------------------------------------------------------------------//
    public get_chargement_quais():void {

//     console.log("Date Sélection dans méthode chargement avant formatage:" + this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement"));
//    let date_chargement_modelformat : string  =     this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement");
//    let date_sapformat : string;
//    let date_tsformat : string;
//    console.log("this.getModel(chargementQuaiSelectionDateModel)?.getProperty(/datechargement)"  + this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement"));

//    if (date_chargement_modelformat.includes("/"))
//    {
//    let lv_jour : string  = date_chargement_modelformat.slice(0,2);
//    let lv_mois : string  = date_chargement_modelformat.slice(3,5)  ;
//    let lv_annee : string  = date_chargement_modelformat.slice(6,10);
//     console.log("Jour: " + lv_jour);
//     console.log("Mois: " + lv_mois);
//     console.log("Annee: " + lv_annee);
//     date_tsformat = lv_annee +"-"+ lv_mois + "-" + lv_jour;
//     date_sapformat = lv_annee + lv_mois + lv_jour;
//     //console.log("Date Sélection dans méthode chargement après formatage:" + oDateFormat.format(new Date(date_tsformat)));
// }
// else
// {   
//     console.log("Date Sélection dans méthode chargement au format SAP:" + this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement"));
//     date_sapformat = date_chargement_modelformat;
// }
        let userName = "USERNAME";                           //TODO SEPTEMBER 2025 => ???
        let password = "PASSWORD";
        let credentials = userName + ':' + password;
        let hash = btoa(credentials);
        let auth = 'Basic '+hash;

 //"Authorization": "Basic",
        var mHeader = {
            "Authorization": auth,
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",
            "datechargementquai": "" ,                                     // oDateFormat.format(new Date(date_tsformat))
            "X-CSRF-Token" :  "Fetch"                                                                   //LOOT4
        }
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
    //     let lv_chargement_url : string;
    //     if ( location.hostname === 'localhost' ) {
    //         console.log("Lancement de l'appli en localhost sur les API de : " + this.environment);
    //       if (this.environment === "dev") {
    //             lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement"; 
    //             console.log("Lancement de l'appli sur les API de la dev : /rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement");    
    //        }
    //       else {
    //                 if (this.environment === "qual") {
    //                 console.log("Lancement de l'appli sur les API de la qualité : /rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement");    
    //                 lv_chargement_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement"; }  //TODO -> Ajouter proxy qual
                    
    //                 else {  console.log("Pas de variable environnement");
    //                         console.log("Lancement de l'appli sur les API de la dev : /rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement");
    //                         lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement";   } 
    //             }
    //     }
    //       else 
    //      { 
    //                 console.log("Location hostname :" + location.hostname +    "Location host :" +        location.host);
    //                 lv_chargement_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/chargement";
    //                 console.log("URL Chargement de quais:" +  lv_chargement_url);
    //      }       
    //  console.log("Début Chargement de l'API : " + lv_chargement_url);
     //this.gv_chargement_url = lv_chargement_url // Lot4 Démarrage chargement des quais
     // TODO LOT4 => RECUPERER LE TOKEN CSRF du GET
     //var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
     console.log("P1 URL  API Chargement  des quais: " + this.gv_chargementquais_api_url ); 
     chargementQuaiModel.loadData(this.gv_chargementquais_api_url,"",true,  "GET", false, true, mHeader)?.then((data) => {   this.getEventBus().publish("Default", "chargementFinishedEvent", {});
                             console.log("DATA DANS LE PROMISE DU GET" + data)       });
     
      //chargementQuaiModel.attachRequestCompleted(function (evt) { console.log("PARAMETRES RESPONSE HEADER:" +evt.getParameter('infoObject')); });
            chargementQuaiModel.attachRequestCompleted(function (evt) { console.log("PARAMETRES RESPONSE HEADER:" +evt); });
     console.log("Fin Chargement de l'API : " + this.gv_chargementquais_api_url); 
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
            //ChargementStartModel.set
        }else
        {  
            ChargementStartModel =   this.getModel( "ChargementStartModel") as JSONModel;
        }
 //-----------------------------------CONSTRUCTION URL---------------------------------------------------------------//   
        // if ( location.hostname === 'localhost' ) {          
        //   if (this.environment === "dev") {
        //         lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";          
        //    }
        //   else {
        //             if (this.environment === "qual") {                 
        //                      lv_chargement_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/start_chargement"; }                 
        //             else {   lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";  } 
        //                  }
        //      }
        // else { 
        //             lv_chargement_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";            
        //     }
 //-----------------------------------CONSTRUCTION URL---------------------------------------------------------------//           
  
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
       let mHeader = {
            "Authorization": "Basic",                    
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",  
            "X-Requested-With":"X"
            
        }
       ChargementStartModel.loadData(this.gv_startchargement_api_url,"",true,  "GET", false, true, mHeader);
    }

     //---------------------------------------------------------------------------------------------------------------------------------//
     //               Méthode d'appel à l'API  REST de lancement du chargeemnt d'un quai  [ZCL_PCF_START_CHARG_RESOURCE/Méthode POST ]                                       //  
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
 //-----------------------------------CONSTRUCTION URL---------------------------------------------------------------//   
        // if ( location.hostname === 'localhost' ) {          
        //   if (this.environment === "dev") {
        //         lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";          
        //    }
        //   else {
        //             if (this.environment === "qual") {                 
        //                      lv_chargement_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/start_chargement"; }                 
        //             else {   lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";  } 
        //                  }
        //      }
        // else { 
        //             lv_chargement_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/start_chargement";            
        //     }
 //-----------------------------------CONSTRUCTION URL---------------------------------------------------------------//           
  
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
        let input_data:any = ChargementStartModel.getData();  
        console.log("P1 Appel  de Start Chargement Valeur de quai:" + i_quai  + "// transport: " + input_data.results.tknum);
       
       let mHeader = {
            "Authorization": "Basic",                    
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",  
            "X-Requested-With":"X",
            "tknum": input_data.results.tknum,    // Object.values(input_data)[0]  //TODO => Essayer de passer les paramètre dans le Body du POST
            "quai1":  i_quai,                       //input_data.results.quai1 
            "matri": input_data.results.matri,
            "name1": input_data.results.name1,
        }
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
        //  let data : {type_msg:String, msg_txt:String,transport:String, um:String, current_quai:String,action:String,user:string} = {
        //         type_msg: 'information',
        //         msg_txt: 'Chargement démarré sur le quai:' + i_quai.toLowerCase() ,
        //         transport: input_data.results.tknum,
        //         um: '', 
        //         current_quai: i_quai.toLowerCase(),
        //         action: 'startchargement',
        //         user: input_data.results.matri                 
        //       };
             // On envoie une notification UM qui sera gérée dans la vue de Chargement
             // LOT Démarrage Chargement quai -> On va définir un handler notificationWebSocketEvent qui va redispatcher vers notificationUMEvent
            //this.getEventBus().publish("Default", "notificationUMEvent",  data);   // Il est possible d'essayer avec    that.getEventBus().publish("Default", "notificationUMEvent",  content_json)
            //this.getEventBus().publish("Default", "chargementEvent", {});  // Ce serait mieux de relancer le chargment dans le handler de la Navigation 
            //LOT4-> Démarrage du chargment => A priori il est nécessaire de refaire un Get après le POST
                                                                                                                      },reason=>{  console.log("P1 REJECTED PROMISE POST StartChargment" + ChargementStartModel.getJSON.toString());
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
            let content_json : {type_msg:String, msg_txt:String,quai:String,um:string,action:string,statut: string,transport:string,user:string,  time : Date} = JSON.parse(content);   
             let data : {type_msg:String, msg_txt:String,transport:String, um:String, quai:String,action:String,user:string, time : Date} = {
                type_msg: content_json.type_msg,
                msg_txt: content_json.msg_txt,
                transport: content_json.um,
                um: content_json.um, 
                quai: content_json.quai,
                action: content_json.action,
                user: content_json.user,
                time: content_json.time                    
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