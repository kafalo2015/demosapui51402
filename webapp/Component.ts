import BaseComponent from "sap/ui/core/UIComponent";
import WebSocket, { WebSocket$MessageEvent } from "sap/ui/core/ws/WebSocket";
import { createDeviceModel } from "./model/models";
import DateFormat from "sap/ui/core/format/DateFormat";
import JSONModel from "sap/ui/model/json/JSONModel";
 
/**
 * @namespace clf.demo.sapui51402.demosapui51402
 */
export default class Component extends BaseComponent {
	public static metadata = {
		manifest: "json",
        interfaces: [
            "sap.ui.core.IAsyncContentCreation"
        ]
	};

    private _wsNotificationUm: WebSocket;
    public get wsNotificationUm(): WebSocket {
        return this._wsNotificationUm;
    }
    public set wsNotificationUm(value: WebSocket) {
        this._wsNotificationUm = value;
    }
    public _environment :String = "dev";
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
        // set the device model
        this.setModel(createDeviceModel(), "device");
         // set i18n model
        /* const i18nModel = new ResourceModel({
            bundleName: "clf.demo.sapui51402.demosapui51402"
        });
        this.setModel(i18nModel, "i18n"); */
        //Définition d'un view Model pour le busy
        let ChargementViewModel = new JSONModel();    
        this.setModel(ChargementViewModel, "chargementViewModel");

       let chargementQuaiSelectionDateModel = new JSONModel();  
       chargementQuaiSelectionDateModel.setDefaultBindingMode("TwoWay")           
       this.setModel(chargementQuaiSelectionDateModel, "chargementQuaiSelectionDateModel");                       
       let oDateFormat = DateFormat.getDateInstance({
            format: "yyyyMMdd",                               //""   "dd-MM-yyyy"
            pattern: "YYYYMMdd"
        }); 
    
       // La classe UI5Date n'existe pas sur le serveur-> Mettre à jour la version SAPUI5 sur le serveur
      // chargementQuaiSelectionDateModel.setData({
        //    datechargement:  oDateFormat.format(UI5Date.getInstance(2023,2,7)),
        //});
        chargementQuaiSelectionDateModel.setData({
              datechargement:  oDateFormat.format(new Date()),                 // On initialise à la date du jour pour les tests en DEV
        });    

     this.open_websocket_NotificationUM();
     // Abonnement à l'eventing
     this.getEventBus().subscribe("Default","chargementEvent",() => { 
        console.log("ChargementEvent");
        let chargementViewModel: JSONModel;
        chargementViewModel =  this.getModel("chargementViewModel") as JSONModel;
        chargementViewModel.setData({
            busy :  true
        }); 
        this.get_chargement_quais();
        chargementViewModel.setData({
            busy :  false
        }); 
     } );
     // Ano lancement de l'application via URl  -> je vais faire un handler pour le chargement_list séparé   
     this.getEventBus().subscribe("Default","chargementListEvent",() => {       
        this.get_chargements_prevus();
     } ); 


      this.getEventBus().subscribe("Default","LoadMaterialUmStockListEvent",(channel:string,event:string,data: Object) => {           
            //this.notification_handler(Object.values(data)[0],Object.values(data)[1],Object.values(data)[2],Object.values(data)[3],Object.values(data)[4],Object.values(data)[5]);  
            let lv_material :string = Object.values(data)[0];
           console.log("SUBSCRIBE LoadMaterialUmStockListEvent:CHANNEL:" + channel + " ---EVENT:" + event + " ---ARTICLE: " + Object.values(data)[0]);
            this.get_material_umstock_list(lv_material);
        },this);  


     this.getEventBus().publish("Default", "chargementListEvent", {});
     this.getEventBus().publish("Default", "chargementEvent", {});
     this.getRouter().initialize();   // Le router ne doit pas être forcément utilisé 
	};

    public get_chargements_prevus():void {
   let date_chargement_modelformat : string  =     this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement");
   let date_sapformat : string;
   let date_tsformat : string;
   console.log("this.getModel(chargementQuaiSelectionDateModel)?.getProperty(/datechargement)"  + this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement"));

   if (date_chargement_modelformat.includes("/"))
   {
    let lv_jour : string  = date_chargement_modelformat.slice(0,2);
    let lv_mois : string  = date_chargement_modelformat.slice(3,5)  ;
    let lv_annee : string  = date_chargement_modelformat.slice(6,10);
    console.log("Jour: " + lv_jour);
    console.log("Mois: " + lv_mois);
    console.log("Annee: " + lv_annee);
    date_tsformat = lv_annee +"-"+ lv_mois + "-" + lv_jour;
    date_sapformat = lv_annee + lv_mois + lv_jour;
    console.log("Data au format sAP durant rechargement:"  + date_sapformat);
    //console.log("Date Sélection dans méthode chargement après formatage:" + oDateFormat.format(new Date(date_tsformat)));
}
else
{   console.log("Date Sélection dans méthode chargement au format SAP:" + this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement"));
    date_sapformat = date_chargement_modelformat;
}  
        var mHeader = {
            "Authorization": "Basic",
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",
            "datechargementquai": date_sapformat                                      // oDateFormat.format(new Date(date_tsformat))
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
     
     let lv_chargement_url : string;
     if ( location.hostname === 'localhost' ) // Lancement de l'application en localhost
     {
        console.log("Lancement de l'appli en localhost");
        if (this.environment === "dev") {lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement_list"; }
        else {
                    if (this.environment === "qual") {lv_chargement_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement_list"; }  //TODO -> Ajouter proxy quaal
                    else {  lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement_list";   } 
                }
     }
      else // Lancement sur les serveurs SAP
      { 
        lv_chargement_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/chargement_list";
     }
     console.log("Chargement de l'API : " + lv_chargement_url);
     chargementsPrevusListModel.loadData(lv_chargement_url,"",true,  "GET", false, true, mHeader); 
     //chargementsPrevusListModel.forceNoCache(true);
     //chargementsPrevusListModel.updateBindings(true);
    }


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
     
     let lv_chargement_url : string;
     if ( location.hostname === 'localhost' ) // Lancement de l'application en localhost
     {
        console.log("Lancement de l'appli en localhost");
        if (this.environment === "dev") {lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list"; }
        else {
                    if (this.environment === "qual") {lv_chargement_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list"; }  //TODO -> Ajouter proxy quaal
                    else {  lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";   } 
                }
     }
      else // Lancement sur les serveurs SAP
      { 
        lv_chargement_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/material_umstock_list";
     }
    console.log("Chargement de l'API : " + lv_chargement_url);
    MaterialUmStockListModel.loadData(lv_chargement_url,"",true,  "GET", false, true, mHeader); 
    }

    public get_chargement_quais():void {
    console.log("Date Sélection dans méthode chargement avant formatage:" + this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement"));
   let date_chargement_modelformat : string  =     this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement");
   let date_sapformat : string;
   let date_tsformat : string;
   console.log("this.getModel(chargementQuaiSelectionDateModel)?.getProperty(/datechargement)"  + this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement"));

   if (date_chargement_modelformat.includes("/"))
   {
   let lv_jour : string  = date_chargement_modelformat.slice(0,2);
   let lv_mois : string  = date_chargement_modelformat.slice(3,5)  ;
   let lv_annee : string  = date_chargement_modelformat.slice(6,10);
    console.log("Jour: " + lv_jour);
    console.log("Mois: " + lv_mois);
    console.log("Annee: " + lv_annee);
    date_tsformat = lv_annee +"-"+ lv_mois + "-" + lv_jour;
    date_sapformat = lv_annee + lv_mois + lv_jour;
    //console.log("Date Sélection dans méthode chargement après formatage:" + oDateFormat.format(new Date(date_tsformat)));
}
else
{   
    console.log("Date Sélection dans méthode chargement au format SAP:" + this.getModel("chargementQuaiSelectionDateModel")?.getProperty("/datechargement"));
    date_sapformat = date_chargement_modelformat;
}
        let userName = "USERNAME";
        let password = "PASSWORD";
        let credentials = userName + ':' + password;
        let hash = btoa(credentials);
        let auth = 'Basic '+hash;

 //"Authorization": "Basic",
        var mHeader = {
            "Authorization": auth,
            "Access-Control-Allow-Origin": "*",
            "Content-Type":"application/json",
            "datechargementquai": date_sapformat                                      // oDateFormat.format(new Date(date_tsformat))
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
        let lv_chargement_url : string;
        if ( location.hostname === 'localhost' ) {
            console.log("Lancement de l'appli en localhost sur les API de : " + this.environment);
          if (this.environment === "dev") {
                lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement"; 
                console.log("Lancement de l'appli sur les API de la dev : /rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement");    
           }
          else {
                    if (this.environment === "qual") {
                    console.log("Lancement de l'appli sur les API de la qualité : /rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement");    
                    lv_chargement_url = "/rest_qual/sap/bc/gui/sap/its/zpcf_chargement/chargement"; }  //TODO -> Ajouter proxy qual
                    
                    else {  console.log("Pas de variable environnement");
                            console.log("Lancement de l'appli sur les API de la dev : /rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement");
                            lv_chargement_url = "/rest_dev/sap/bc/gui/sap/its/zpcf_chargement/chargement";   } 
                }
        }
          else 
         { 
                    console.log("Location hostname :" + location.hostname +    "Location host :" +        location.host);
                    lv_chargement_url = "https://" + location.host + "/sap/bc/gui/sap/its/zpcf_chargement/chargement";
                    console.log("URL Chargement de quais:" +  lv_chargement_url);
         }       
     console.log("Début Chargement de l'API : " + lv_chargement_url);
     chargementQuaiModel.loadData(lv_chargement_url,"",true,  "GET", false, true, mHeader)?.then(() => {   this.getEventBus().publish("Default", "chargementFinishedEvent", {}); });
     console.log("Fin Chargement de l'API : " + lv_chargement_url); 
    }
        
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
            let content_json : {type_msg:String, msg_txt:String,quai:String,um:string,action:string,statut: string,transport:string} = JSON.parse(content);   
             let data : {type_msg:String, msg_txt:String,transport:String, um:String, quai:String,action:String} = {
                type_msg: content_json.type_msg,
                msg_txt: content_json.msg_txt,
                transport: content_json.um,
                um: content_json.um, 
                quai: content_json.quai,
                action: content_json.action               
              };
             // On envoie une notification UM qui sera gérée dans la vue de Chargement
             that.getEventBus().publish("Default", "notificationUMEvent",  data);     
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