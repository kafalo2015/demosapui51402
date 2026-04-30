import JSONModel from "sap/ui/model/json/JSONModel";
import { environment_enum,sapserver_url_enum, restapi_websocket_path_enum,application_events_enum } from "./Enums";
import EventBus from "sap/ui/core/EventBus";
import Component from "../Component";

/**
 * @namespace clf.logistique.chargementquais.model
 */ 
//GEMINI[Question] -> Pourquoi ce namespace?
// si j'avais mis ApiService dans model/api, est-ce que le namespace aurait du être clf.logistique.chargementquais.model.api?
export  class ApiService {

private _gv_environment :environment_enum;
private _g_event_bus : EventBus;
private _oComponent: Component;
public gv_chargement_url !: string;
public gv_chargement_um_api_url!: string;                    // URL API startchargement
public gv_startchargement_api_url!: string;                  // URL API startchargement
public gv_endchargement_api_url!: string;                    // URL API endchargement
public gv_chargementquais_api_url!: string;                  // URL API chargement des quais
public gv_validation_msg_chargementquais_api_url!: string;    //gv_validation_msg_chargementquais_api_url
public gv_chargementprevus_api_url!: string;                  // URL API Chargement prévus
public gv_material_umstock_api_url!: string;                  // URL material_umstock_list
public gv_websocket_url!: string;                             // URL Web Socket    LOT16
//private static _instance: ApiService;
//private _baseUrl: string;

    constructor(p_environment: environment_enum, i_eventbus : EventBus, i_component:Component) {
       this._gv_environment = p_environment;
        this._g_event_bus = i_eventbus;
        this._oComponent = i_component;
    }

    /**
     * Méthode générique pour les appels POST
     */
    //public async post(path: string, data: any): Promise<any> {
      //  const url = `${this._baseUrl}${path}`;

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
                    switch (this._gv_environment.toLowerCase()) {
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

        this.gv_chargementquais_api_url = "https://" + lv_location  +  restapi_websocket_path_enum.chargementquais;
        this.gv_validation_msg_chargementquais_api_url = "https://" + lv_location +  restapi_websocket_path_enum.validation_chargement;    
        this.gv_chargementprevus_api_url = "https://" + lv_location +  restapi_websocket_path_enum.chargement_prevus; 
        this.gv_startchargement_api_url = "https://" + lv_location +  restapi_websocket_path_enum.start_chargement;
        this.gv_endchargement_api_url = "https://" + lv_location +  restapi_websocket_path_enum.end_chargement;
        this.gv_material_umstock_api_url =  "https://" + lv_location +  restapi_websocket_path_enum.material_umstock_list;
        this.gv_chargement_um_api_url = "https://" + lv_location +  restapi_websocket_path_enum.chargement_um;
        this.gv_websocket_url = "wss://" + lv_socket_location +  restapi_websocket_path_enum.websocket_ychargement_camion_poc;
    // // END SIMPLIFICATION CODE  
    }

    //----------------------------------------------------------------------------------------------------------------------------//
       //               Méthode d'appel à l'API  REST de chargement des quais                                                        //  
       //----------------------------------------------------------------------------------------------------------------------------//
    public get_chargement_quais(i_chargementquaimodel : JSONModel):void {
       // METHODE auhentification 1 - > Authorization : auth        (Retiré suite aux problématiques d'authentification d'Octobre 2025)
               // let credentials = userName + ':' + password;
               // let hash = btoa(credentials);
               // let auth = 'Basic '+hash;
   
               var mHeader = {     
                   // "Authorization": auth,                           // Essai pas d'autorisation         //LOt15 -> Je vois pas comment ca peut marcher en localhost sans autorisaiton?
                   "Content-Type":"application/json",
               }
   
       // On instancie le modèle que s'il n'est pas déja défini au niveau du composant (premier chargement/rechargement)
   
       // LOT 21 Amélioration GEMINI BEGIN 
          // let  chargementQuaiModel: JSONModel = this.getModel("chargementModelJson") as JSONModel;
   
           //  if ( this.getModel("chargementModelJson") == undefined)
           //  {
           //     chargementQuaiModel = new JSONModel();
           //     this.setModel(chargementQuaiModel, "chargementModelJson");
           //  }else
           //  {  
           //      chargementQuaiModel =   this.getModel( "chargementModelJson") as JSONModel;
           //  }
           
           // LOT 21 Amélioration GEMINI BEGIN 
           
           // TODO LOT4 => RECUPERER LE TOKEN CSRF du GET
           //var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
           console.log("P1 HIGH URL API Chargement  des quais au moment de l'appel de l'API: " + this.gv_chargementquais_api_url ); 
           i_chargementquaimodel.loadData(this.gv_chargementquais_api_url,"",true,  "GET", false, true, mHeader)?.then((data) => {   this._g_event_bus.publish("Default", "chargementFinishedEvent", {});
                                   console.log("DATA DANS LE PROMISE DU GET" + data)       });
           
          // this.getModel("chargementModelJson")?.attachRequestCompleted(function (evt) { console.log("PARAMETRES RESPONSE HEADER:" +evt); });
           }
   


         public get_chargements_prevus(i_chargementsPrevusListModel : JSONModel):void {
            var mHeader = {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/json",
            }
            // let chargementsPrevusListModel: JSONModel;
            // if ( this.getModel("chargementsPrevusListModel") == undefined)
            // {
            //     chargementsPrevusListModel = new JSONModel();
            //     this.setModel(chargementsPrevusListModel, "chargementsPrevusListModel");
            // }else
            // {  
            //     chargementsPrevusListModel =   this.getModel( "chargementsPrevusListModel") as JSONModel;
            // }
        
        i_chargementsPrevusListModel.loadData(this.gv_chargementprevus_api_url,"",true,  "GET", false, true, mHeader); 
        //chargementsPrevusListModel.forceNoCache(true);
        //chargementsPrevusListModel.updateBindings(true);
        } 
        
          public get_validation_msg_chargements(i_validationMsgChargementQuaiModelJSON :JSONModel):void {
                var mHeader = {
                "Content-Type":"application/json",
                }
        
               
                //console.log("P1 URL API ZCL_PCF_CHARG_VALIDMSG_RESOUR: " + this.gv_validation_msg_chargementquais_api_url ); 
                i_validationMsgChargementQuaiModelJSON.loadData(this.gv_validation_msg_chargementquais_api_url,"",true,  "GET", false, true, mHeader)?.then((data) => {     });
                }


    //----------------------------------------------------------------------------------------------------------------------------//
    //               Méthode d'appel de l'API  ZCL_PCF_START_CHARG_RESOURCE/ Méthode GET                                          //  
    //----------------------------------------------------------------------------------------------------------------------------//
    public ChargementStartModel_Get(i_ChargementStartModel:JSONModel):void{

        i_ChargementStartModel.setDefaultBindingMode("TwoWay");   // TODO => vérifier si c'est nécessaire d'activer  le two way binding
    //------------------------------------------------------------------------------------------------------------------------------------------------------
    // BEGIN LOT 12 : Déploiement PHP  -> Vérifier s'il ne faut pas remettre le paramètre "X-Requested-With":"X" et l'autoriser au niveau de UCONCOCKPIT
    //---------------------------------------------------------------------------------------- --------------------------------------------------------------                    
        let mHeader = {
            "Content-Type":"application/json",  
        }
    //-----------------------------------------------------------------------------------------
    // END LOT 12 : Déploiement PHP
    //----------------------------------------------------------------------------------------
    i_ChargementStartModel.loadData(this.gv_startchargement_api_url,"",true,  "GET", false, true, mHeader);
    }  
                 
public get_material_umstock_list(i_MaterialUmStockListModel:JSONModel, i_material:string):void {
             
var mHeader = {
//"Access-Control-Allow-Origin": "*",
"Content-Type":"application/json",
"material": i_material                                      
}
// let MaterialUmStockListModel: JSONModel;
// if ( this.getModel("MaterialUmStockListModel") == undefined)
// {
//     MaterialUmStockListModel = new JSONModel();
//     this.setModel(MaterialUmStockListModel, "MaterialUmStockListModel");
// }else
// {  
//     //  console.log("Relance du chargement list"),
//     MaterialUmStockListModel =   this.getModel( "MaterialUmStockListModel") as JSONModel;
// }
i_MaterialUmStockListModel.loadData(this.gv_material_umstock_api_url,"",true,  "GET", false, true, mHeader); 
}  


  public get_motifs_nonchargement(i_finChargementQuaiModelJSON : JSONModel,i_quai:string,i_numtransport:string):void {
    //console.log("P1 HIGH/ Méthode Get_motifs_nonchargement QUAI=" + i_quai + " TRANSPORT= "  + i_numtransport )
            
            var mHeader = {
            "Content-Type":"application/json",
            "X-Requested-With":"X",
            "tknum": i_numtransport,    // Object.values(input_data)[0]  //TODO => Essayer de passer les paramètre dans le Body du POST
            "quai1":  i_quai,   
            }

    // if ( this.getModel("finChargementQuaiModelJSON") == undefined)
    // {
    //     this.setModel(new JSONModel(), "finChargementQuaiModelJSON");
    // }
    
    // console.log("P1 URL API ZCL_PCF_CHARGEMENT_END_RESOUR: " + this.gv_endchargement_api_url ); 
    i_finChargementQuaiModelJSON.loadData(this.gv_endchargement_api_url,"",true,  "GET", false, true, mHeader)?.then((data) => {     });
    }

    public api_chargement_um_get(i_ChargementUmModel:JSONModel, i_quai:string):void{
    // BEGIN LOT 12 : Déploiement PHP  -> Vérifier s'il ne faut pas remettre le paramètre "X-Requested-With":"X" et l'autoriser au niveau de UCONCOCKPIT
    //---------------------------------------------------------------------------------------- --------------------------------------------------------------                    
        let mHeader = {
            "Content-Type":"application/json", 
            "quai1":  i_quai                             //LOT15 [Scan Manuel UM]-> Rajouter le paramètre quai1 dans le paramétrage CORS UCONCOCKPIT
        }
    //-----------------------------------------------------------------------------------------
    // END LOT 12 : Déploiement PHP
    //----------------------------------------------------------------------------------------
        i_ChargementUmModel.loadData(this.gv_chargement_um_api_url,"",true,  "GET", false, true, mHeader);
}

public api_chargement_um_post(i_ChargementUmModel:JSONModel, i_quai:string,i_codum:string, i_msgid?:string, i_aenam?:string , i_errdt?:string, i_errzt?:string, i_choice?:boolean) :void{
    //let ChargementUmModel: JSONModel;
    // if (this.getModel("ChargementUmModel") == undefined) {
    //     ChargementUmModel = new JSONModel();
    //     this.setModel(ChargementUmModel, "ChargementUmModel");
    //     ChargementUmModel.setDefaultBindingMode("TwoWay");   // TODO => vérifier si c'est nécessaire d'activer  le two way binding
    // } else {
    //     ChargementUmModel = this.getModel("ChargementUmModel") as JSONModel;
    // }                                                            
        
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
                "choice": i_choice? "X":""    // GEMINI[TOCHECK] L'API ABAP accepte mal le boolean. Je suis obligé convertir le true en 'X'. 
            }

        //-----------------------------------------------------------------------------------------
        // END LOT 10 : Problématique Authentification RESTAPI -> Essai pas d'authentification (Paramètre authorization retiré)
        //----------------------------------------------------------------------------------------   
            i_ChargementUmModel.loadData(this.gv_chargement_um_api_url,"",true,  "POST", false, true, mHeader)?.then(result=>{  
        //------------------- TODO LOT9  Validation des messages de Warning->Mettre le code de suppression du Warning de la promise de l'API POST--------------------------------------------------
        //console.log("P1 LOt15 Valeur de i_validation_charg_um :" + i_validation_charg_um);
        //console.log("P1 HIGH LOt15 Rappel de l'API des messages de validation");
        this._g_event_bus.publish("Default", application_events_enum.validation_msg_chargement_event, {});  // LOT15 Rappel du modèle de validation de chargment -> Réfléchir si c'est nécessaire ou le mettre dans le handler du routing
        
        // BEGIN anomalie Rescan manuel après validation
        let data2 : {quai:string|undefined} = { quai:  i_quai } 
        this._g_event_bus.publish("Default", application_events_enum.chargement_um_get_event,  data2);
        // END anomalie Rescan manuel après validation
                                                                                                                        },reason=>{ 
                                                                                                                }); 
        }


        // Dans votre classe Component extends BaseComponent
public async api_chargement_um_post_newgemini(
        sQuai: string, 
        sCodum: string, 
        sMsgid: string, 
        sAenam: string, 
        sErrdt: string, 
        sErrzt: string, 
        bChoice: boolean
    ): Promise<void> {
        
        // 1. Récupération de l'indice du quai (Logique Lot 20)
        // On suppose que sQuai est "QUAI08" -> on cherche son index dans le modèle
        const oNotifModel = this._oComponent.getModel("notificationsQuaisModel") as JSONModel;
        const aQuais = oNotifModel.getProperty("/quais") as any[];
        const iIndex = aQuais.findIndex(q => q.quai === sQuai);

        if (iIndex === -1) return;

        const sPath = `/quais/${iIndex}/notifs`;

        try {
            // 2. Préparation du Body pour SAP
            const oPayload = {
                iv_quai: sQuai,
                iv_codum: sCodum,
                iv_msgid: sMsgid,
                iv_choice: bChoice ? "X" : ""
                // ... autres paramètres
            };

            // 3. Appel API (Utilisation de l'URL déterminée dans getApiUrl)
            const response = await fetch(this.gv_chargement_um_api_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(oPayload)
            });

            const oResult = await response.json();

            // 4. Gestion du retour SAP
            if (oResult.ev_type === "S") { 
                // SUCCESS
                this._updateQuaiNotif(oNotifModel, sPath, "notifsuccess_scanmanuelum", oResult.ev_message, true);
                
                // Rafraîchissement automatique des données du quai
                this._g_event_bus.publish("Default", "chargementEvent", { quai: sQuai });
            } else {
                // ERROR ou WARNING
                this._updateQuaiNotif(oNotifModel, sPath, "notiferror_scanmanuelum", oResult.ev_message, true);
            }

        } catch (oError) {
            // 5. Erreur technique (Réseau/Timeout)
            this._updateQuaiNotif(oNotifModel, sPath, "notiferror_scanmanuelum", "Erreur de connexion au serveur SAP", true);
        }
    }

    /**
     * Helper interne pour mettre à jour proprement le modèle de notification
     */
    private _updateQuaiNotif(oModel: JSONModel, sPath: string, sType: string, sMsg: string, bVisible: boolean): void {
        oModel.setProperty(`${sPath}/${sType}/msg_txt`, sMsg);
        oModel.setProperty(`${sPath}/${sType}/visible`, bVisible);
        
        // Auto-fermeture après 5 secondes pour les succès
        if (sType.includes("success")) {
            setTimeout(() => {
                oModel.setProperty(`${sPath}/${sType}/visible`, false);
            }, 5000);
        }
    }

    // public sendErrorToBackend(sSeverity: string, sMessage: string): void {
    //     const oDataModel = this?.getModel() as ODataModel;
    //     const oPayload = {
    //         Severity: sSeverity,
    //         Message: sMessage,
    //         Timestamp: new Date(),
    //         //User: sap.ushell?.Container?.getService("UserInfo")?.getId() || "Unknown",
    //         AppSource: "ChargementQuais_IconTabBar"
    //     };

    //     // Appcreael asynchrone sans bloquer l'UI
    //     oDataModel.create("/ErrorLogSet", oPayload, {
    //         success: () => Log.info("Log synchronisé avec le backend SAP"),
    //         error: () => Log.error("Échec de synchronisation du log avec le backend")
    //     });
    // }



}