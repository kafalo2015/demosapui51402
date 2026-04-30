            import BaseComponent from "sap/ui/core/UIComponent";
            import WebSocket, { WebSocket$MessageEvent,WebSocket$ErrorEvent } from "sap/ui/core/ws/WebSocket";
            import JSONModel from "sap/ui/model/json/JSONModel";
            import ResourceModel from "sap/ui/model/resource/ResourceModel";
            import Model$RequestCompletedEvent from "sap/ui/model/Model";
            import MessageToast from "sap/m/MessageToast";
            import Target from "sap/ui/core/routing/Target";
            import ElementBase from "sap/suite/ui/commons/networkgraph/ElementBase";
            import ODataModel from "sap/ui/model/odata/v2/ODataModel";
            import Log from "sap/base/Log";
            import { environment_enum,  application_names_enum, action_code_enum, application_events_enum} from "./model/Enums";
            import {IChargementMsgValidation} from "./model/Interfaces";
            import { IWebSocketNotifs} from "./model/Interfaces";
            import { ApiService } from "./model/ApiService";
            import {EventHandlers} from "./model/EventRegistrationService";
            // LOT/DATE/AUTEUR=>DECRIPTION
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
            // LOt 17-27/02/2026-GILLES CAMILLERI => Amélioration code (Enumérations environnement, url serveur sap, action_code)
            // LOt 18-27/03/2026-GILLES CAMILLERI => Une seule vue pour affichage des quais
            // LOt 19-27/03/2026-GILLES CAMILLERI => Simplification du paramétrage du routing dans le fichier manifest (pas de duplication de route et target pour les quais)
            // LOt 20-03/04/2026-GILLES CAMILLERI => Amélioration GEMINI V1(Notifications modèles avec des quais en dynamique, Récupération de l'indice d'un quai (les quais peuvent être renvoyés dans le désordre), Récupération de l'indice de validation par BindingContext)
            // LOt 21-03/04/2026-GILLES CAMILLERI => Amélioration GEMINI V2 (ChargementQuais controller-Component controller)

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
                
                private _apiService !: ApiService;
                private _eventHandlers: EventHandlers;    // GEMINI [Amélioration] Module dédié pour Subscrible/unsubscribe

                public  gsContentDensityClass!:string;
                private _gv_environment !:environment_enum;
            
                public gv_websocket!: WebSocket;                             // URL Web Socket    LOT16
                
                public gv_current_application!: string;                       // Stocke le nom de l'application actuellement affiché (Liste des chargmentn ou Chargement des quais)
                public gv_current_quai!: string;   
                public gv_current_quai_number!: number;                            
            
                public init() : void {
                    // call the base component's init function
                    super.init();
                    // Changemment de variable environnement (dev ou qual) pour appeler les API de la qual ou de la dev
                    this._gv_environment = environment_enum.dev;
                
                    // console.log("P1 HIGH Lecture de la variable de configuration du manifest /sap.ui5/config/api_env : " +    this.gv_environment )
                    const oBundle = this.getModel("i18n") as ResourceModel;
                    const sText = (oBundle.getResourceBundle() as any).getText("notFoundTitle");
                    console.log("Texte i18n récupéré : " + sText);

                    Log.info(`Erreur de bundle i18n`, 
                        "Propriété notFoundTitle récupérée", 
                        "clf.logistique.chargementquais");
                    
                        this._createDynamicQuaisModel();

                //this.initEventBusListeners(); // Appel de la méthode de centralisation
                //----------------------------------------------------------------------------------------------------------------------------//
                //----------------------------------------------------------------------------------------------------------------------------//
                //               Détermination des URL des API                                                                                //  
                //----------------------------------------------------------------------------------------------------------------------------//
                //this.getApiUrl();
                // BEGIN GEMINI[ACTION] Refonte appel des APi dans le module ApiService -> ETAPE 1 getApiUrl dans le nouveau module-> Est-ce que c'est ok 
                // GEMININI [Avis]Il est possible de passer les modèles égaleemnt au constructeur de API service
                this._apiService = new ApiService(this._gv_environment,this.getEventBus(),this);
                this._apiService.getApiUrl(); 
                // END GEMINI[ACTION] Refonte appel des APi dans le module ApiService -> ETAPE 1 getApiUrl dans le nouveau module 

                // GEMINI BEGIN [Amélioration] Module dédié pour les events au niveau du component
            // On délègue la gestion des événements au module dédié
                this._eventHandlers = new EventHandlers(this);
                this._eventHandlers.initEvents();    //=> Remplace la méthode this initEventBusListeners();

                // GEMINI END [Amélioration] Module dédié pour les events au niveau du component

            //----------------------------------------------------------------------------------------------------------------------------//
            //               Appel des API de chargement quais, chargements prévu et matchcode de lancement de chargement                 //  
            //----------------------------------------------------------------------------------------------------------------------------//
            this.getEventBus().publish("Default", "chargementEvent", {});
                this.getEventBus().publish("Default", "chargementListEvent", {});             // MODIF LOT13 =>Le chargement list après le chargement
                this.getEventBus().publish("Default", "chargementStartModelGetEvent", {});    //LOt 12-> Rest déploiement phm -> A REMETTRE
                this.getEventBus().publish("Default", "validationMsgChargementEvent", {});    //LOt 12-> Rest déploiement phm -> A REMETTRE
                this.open_websocket_NotificationUM();            //LOt 12-> Rest déploiement phm -> A REMETTRE


            // OPTIMISATION GEMINI LOT21 BEGIN 
            //        A. Initialisation du Routing
            // Vous initialisez le routeur après avoir publié vos premiers événements :

            // TypeScript
            // this.getEventBus().publish("Default", "chargementEvent", {});
            // const router = this.getRouter().initialize();
            // Risque : Si l'appel API chargementEvent répond très vite alors que le routeur n'est pas prêt, certaines vues pourraient ne pas recevoir les données. Il est souvent préférable d'initialiser le routeur à la fin du init, mais assurez-vous que les modèles de données sont prêts.
                const router = this.getRouter().initialize();   
            // OPTIMISATION GEMINI LOT21    END 
                    let target_chargement_list: Target = router.getTarget("targetchargementlist") as Target;
                    // LOT 18 Simplification du routing
                    let target_quai_all: Target = router.getTarget("targetchargementquaiall") as Target;
                    target_chargement_list.attachDisplay(()=>{  this.gv_current_application = application_names_enum.chargementsPrevus;}     //Stockage du nom de l'application en cours d'utilisation  // LOT17 Amélioration code
                                                        );    
                    target_quai_all.attachDisplay(()=>{ this.gv_current_application = application_names_enum.chargementsQuais;}  )              //Stockage du nom de l'application en cours d'utilisation  // LOT17 Amélioration code
                    // LOT 18 Simplification du routing
                }

                public exit(): void {
            // BEGIN Amélioration GEMINI : Nettoyage des abonnements     
            // On nettoie via le service
                this._eventHandlers?.destroyEvents();
                // END Amélioration GEMINI : Nettoyage des abonnements 
                // Fermer le websocket proprement
                this.gv_websocket?.close(); 
                super.exit();
            }

                private initEventBusListeners():void {
                const oBus = this.getEventBus();
                
                // GEMINI [Amélioration] BEGIN
                // Une partie des subscrible a été déporté dans le module dédié EventRegistration.ts
                // GEMINI [Amélioration] END
                }

            private _createDynamicQuaisModel(): void {
                // Configuration : quels sont nos quais ?
                const aQuaiNumbers = ["08", "09", "10", "11", "12", "13", "14", "15"];
                
                // Construction de la structure de base
                const oData = {
                    quais: aQuaiNumbers.map((sNum) => {
                        return {
                            quai: "QUAI" + sNum,
                            header: {
                                backgroundcolorset: "ColorSet9",
                                backgroundcolorshade: "ShadeE"
                            },
                            um: "",
                            notifs: {
                                notifsuccess: { msg_txt: "", visible: false },
                                notifwarning: { msg_txt: "", visible: false },
                                notiferror: { msg_txt: "", visible: false }
                            }
                        };
                    }),
                    notif_txt_all: [],
                    chargementstartnotifs: {
                        notifwarning: { msg_txt: "", visible: false },
                        notiferror: { msg_txt: "", visible: false }
                    }
                };

                const oModel = new JSONModel(oData);
                this.setModel(oModel, "notificationsQuaisModel");
            }

            //---------------------------------------------------------------------------------------------------------------------------------//
            //                                                                                                                                 //  
            //---------------------------------------------------------------------------------------------------------------------------------// 
                public notificationWebSocketHandler(type_msg:string, msg_txt: string,transport:string, um: String, current_quai: string, action :string, user:string, time:any,  p_checkid:string ) : void{ 
                //let type_msg_strip : string;
                let notificationsQuaisModel : JSONModel  = this.getModel("notificationsQuaisModel") as JSONModel;
                
                let aQuais = notificationsQuaisModel.getProperty("/quais");
                // Trouver dynamiquement l'indice du quai par son nom (ex: "QUAI08")
                let iIndex = aQuais.findIndex((oQuai: any) => oQuai.quai === current_quai);

                if (iIndex === -1) {
                    Log.error("Quai non trouvé dans le modèle : notificationsQuaisModel " + current_quai);
                    return;
                }

                // Détermination simplifiée du chemin de notification
            let model_root_path = (action === action_code_enum.start_chargement && type_msg === 'E') 
                ? "/chargementstartnotifs" 
                : `/quais/${iIndex}`;

            // Code pour effacer les notifications affichés au bas de l'écran des quais dans le cas ou l'on charge une nouvelle UM
            //  this.notifications_clear_quai_changed(notificationsQuaisModel,model_root_path,action,type_msg);
            // MAJ des noeuds de notification dans le modèle JSON
            this._notif_quai(notificationsQuaisModel,model_root_path,iIndex,action,type_msg, msg_txt,um); 
            // Affichage de la popup de Validation de chargement (si la notification concerne le quais en cours)
                this.open_validationchargement_popup(action,type_msg,current_quai);     
            // Enregistrement de la notifications dans le noeud stockant les notifications de l'ensemble de quais    
                this.notif_all_quais(notificationsQuaisModel, type_msg, msg_txt,time);
                console.table(notificationsQuaisModel.getData().quais)  //=>  //GEMINI A CAPITALISER 
            // Relances des API de chargement, de validation de chargement -> Vérifier que la relance des API ne fait pas trop souvent- > Peut être relancer uniquement si l'utiliseur se trouve sur le quai concerné
                this.refresh_after_wsnotification(action,type_msg,msg_txt);
            }

            private _notif_quai(p_notificationsQuaisModel : JSONModel,p_model_root_path:string, indexquai: string, action :string, type_msg :string, msg_txt :string,um:String ) {
                
                const sHeaderPath = `${p_model_root_path}/header`; 
                const sNotifsPath = `${p_model_root_path}/notifs`;

                // 1. Configuration des types (Mapping)
                const TYPE_CONFIG: Record<string, any> = {
                    'information': { node: "notifsuccess", color: "ColorSet8" },
                    'S':           { node: "notifsuccess", color: "ColorSet8" }, // Standard SAP
                    'W':           { node: "notifwarning", color: "ColorSet1"}, 
                    'E':           { node: "notiferror",   color: "ColorSet2" }
                };

                const aAllNodes = ["notifsuccess", "notifwarning", "notiferror"];
                // 2. Logique de Reset intelligente
                // Si on démarre (start) et que c'est OK/Warning, on n'efface QUE l'erreur.
                // Sinon (cas général), on efface tout.
                const bIsStartSuccess = (action === action_code_enum.start_chargement && type_msg !== 'E');

                if (bIsStartSuccess) {
                    p_notificationsQuaisModel.setProperty(`${sNotifsPath}/notiferror/visible`, false);
                    p_notificationsQuaisModel.setProperty(`${sNotifsPath}/notiferror/msg_txt`, "");
                } else {
                    ["notifsuccess", "notifwarning", "notiferror"].forEach(sNode => {
                        p_notificationsQuaisModel.setProperty(`${sNotifsPath}/${sNode}/visible`, false);
                        p_notificationsQuaisModel.setProperty(`${sNotifsPath}/${sNode}/msg_txt`, "");
                    });
                }

                const oConfig = TYPE_CONFIG[type_msg] || TYPE_CONFIG['information'];   // GEMINI => Pourquoi la deuxième condition
                // 3. Affichage du nouveau message (Standard + Scan Manuel)
                p_notificationsQuaisModel.setProperty(`${sNotifsPath}/${oConfig.node}/msg_txt`, msg_txt);
                p_notificationsQuaisModel.setProperty(`${sNotifsPath}/${oConfig.node}/visible`, true);
                // Stockage du dernier UM traite     
                p_notificationsQuaisModel.setProperty(`${sNotifsPath}/um`, um);    // On stocke le dernier UM traité dans le modèle des notifications 
                // 4. Animation du Header (Uniquement si indexquai est valide)
                // Note: indexquai est string dans ta signature, s'assurer qu'il n'est pas vide
                // On vérifie si le chemin contient "quais" pour savoir si on a un header à animer
                console.log("Couleur de la notification" + oConfig.color);  
                if (p_model_root_path.includes("quais")) {
                p_notificationsQuaisModel.setProperty(`${sHeaderPath}/backgroundcolorset`, oConfig.color);

                // Retour à la normale (ColorSet9) après 4s, puis rappel de la couleur après 5s
                setTimeout(() => {
                    p_notificationsQuaisModel.setProperty(`${sHeaderPath}/backgroundcolorset`, "ColorSet9");
                }, 4000);

                setTimeout(() => {
                    p_notificationsQuaisModel.setProperty(`${sHeaderPath}/backgroundcolorset`, oConfig.color);
                }, 5000);
                }
            }
            
            private open_validationchargement_popup(action :string, type_msg:string, current_quai: string, ) {
                    
                    if ( (action  == action_code_enum.chargement) && ((type_msg == 'V') || (type_msg == 'C')) ) {                 // if ( (action  == 'chargement') && ((type_msg == 'W') || (type_msg == 'C')) ) {
                    this.getEventBus().publish("Default", "validationMsgChargementEvent", {});
                    if ( this.gv_current_application == application_names_enum.chargementsQuais )     // Anomalie ouverture de la popup de la validation - > La popup ne doit s'ouvrir que si l'utilisateur se trouve sur l'application 
                                                                                                        // de chargement des quais
                    {
                
                    // GEMINI BEGIN  [Amélioration] Payload pour les data des event
                    //let data : {quai_number_popupdisplay:string} =  { quai_number_popupdisplay:  current_quai};
                    const payload : IChargementMsgValidation =  { quai_number:   Number(current_quai.slice(4,6))};
                    // GEMINI END  [Amélioration] Payload pour les data des event
                    this.getEventBus().publish("Default", "validationDialogEvent", payload);
                    }
                    }  
                }
            private notif_all_quais(p_notificationsQuaisModel : JSONModel, type_msg :string, msg_txt :string, time:any) {

            const MAP_TYPES: Record<string, string> = {
            'information': "Success",
            'W': "Warning",
            'V': "Warning",
            'C': "Warning",
            'E': "Error"
            };
            let type_msg_strip = MAP_TYPES[type_msg] || "None";
            let msg_text_all_object : Object[] = p_notificationsQuaisModel.getProperty("/notif_txt_all") ;
            msg_text_all_object.push({msg_txt: msg_txt, type_msg : type_msg_strip, time: time})
            p_notificationsQuaisModel.setProperty("/notif_txt_all",msg_text_all_object);
            }

            public refresh_after_wsnotification(action :string, type_msg:string, msg_txt: string)
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
            // GEMINI[Amélioration] BEGIN Module dédié pour appel des API
            
        // GEMINI [Questions] Est-ce que la méthode doit être forcément async?      
        public async get_chargements_prevus_apiservice() {
            try {
                const oResult = this._apiService.get_chargements_prevus(this.getModel("chargementsPrevusListModel") as JSONModel);
                MessageToast.show("Succès appel API chargementsPrevusListModel!");
            } catch (oError) {
                Log.error("Échec de l'appel API chargementsPrevusListModel!");
            }
        }
            // GEMINI[Amélioration] BEGIN Module dédié pour appel des API
            //----------------------------------------------------------------------------------------------------------------------------//
            //               Méthode d'appel à l'API  REST de récupération des stocks d'un article                                        //  
            //----------------------------------------------------------------------------------------------------------------------------//
            // public get_material_umstock_list(material:string):void {
            
            // GEMINI [Questions] Est-ce que la méthode doit être forcément async?      
        public async get_material_umstock_list_apiservice(material:string) {
                try {
                    // GEMINI BEGIN [Question ] J'instancie le modèle ici car il n'est pas toujours utile (il est utilié à la volée si l'utilisateur clique sur le bouton). Est-ce que c'est bon 
                    if ( this.getModel("MaterialUmStockListModel") == undefined)
                    {
                        this.setModel(new JSONModel(), "MaterialUmStockListModel");
                    }
                    // GEMINI BEGIN [Question ] J'instancie le modèle ici car il n'est pas toujours utile (il est utilié à la volée si l'utilisateur clique sur le bouton). Est-ce que c'est bon 
                    const oResult = this._apiService.get_material_umstock_list(this.getModel("MaterialUmStockListModel") as JSONModel,material);
                    MessageToast.show("Succès appel API chargementsPrevusListModel!");
                } catch (oError) {
                    Log.error("Échec de l'appel API chargementsPrevusListModel!");
                }
        }

    //----------------------------------------------------------------------------------------------------------------------------//
    //               Méthode d'appel à l'API  REST de chargement des quais                                                        //  
    //----------------------------------------------------------------------------------------------------------------------------//
    // Exemple d'utilisation dans un handler
    public async get_chargement_quais_apiservice() {
        try {
            const oResult = this._apiService.get_chargement_quais(this.getModel("chargementModelJson") as JSONModel);
            MessageToast.show("Succès appel API chargementModelJson !");
        } catch (oError) {
            Log.error("Échec de l'appel API chargementModelJson");
        }
    }
    //----------------------------------------------------------------------------------------------------------------------------//
    //            LOT10:  Méthode d'appel à l'API  REST des messages de validation des chargements sur les quais                  //  
    //----------------------------------------------------------------------------------------------------------------------------//
    public async get_validation_msg_chargements_apiservice() {
        try {
            const oResult = this._apiService.get_validation_msg_chargements(this.getModel("validationMsgChargementQuaiModelJSON") as JSONModel);
            MessageToast.show("Succès appel API ! validationMsgChargementQuaiModelJSON");
        } catch (oError) {
            Log.error("Échec de l'appel API validationMsgChargementQuaiModelJSON");
        }
    }
                
    //----------------------------------------------------------------------------------------------------------------------------//
    //            LOT13:  Méthode d'appel à l'API  REST des messages de validation des chargements sur les quais                  //  
    //----------------------------------------------------------------------------------------------------------------------------//
    public async get_motifs_nonchargement_apiservice(i_quai:string,i_numtransport:string) {
        try {
            // GEMINI [CHECK] Cette instanciation est déja peut être réalisé dans le contrôlleur de la vue des quais lorsqu'on clique sur le bouton finChargement
            // Attention il faut instancier le modèle à la volée au premier clic fin de chargement
            if ( this.getModel("finChargementQuaiModelJSON") == undefined)
            {
                this.setModel(new JSONModel(), "finChargementQuaiModelJSON");
            }
            // GEMINI [CHECK] Cette instanciation est déja peut être réalisé dans le contrôlleur de la vue des quais lorsqu'on clique sur le bouton finChargement
            const oResult = this._apiService.get_motifs_nonchargement(this.getModel("finChargementQuaiModelJSON") as JSONModel,i_quai,i_numtransport);
            MessageToast.show("Succès appel API ! validationMsgChargementQuaiModelJSON");
            } catch (oError) {
                Log.error("Échec de l'appel API validationMsgChargementQuaiModelJSON");
            }
    }

public async post_motifs_nonchargement_apiservice(i_quai1:string, i_quainumber: number, i_tknum:string, i_tMotifNocharg :string[]) {
    try {
        const oResult = this._apiService.post_motifs_nonchargement(this.getModel("finChargementQuaiModelJSON") as JSONModel,i_quai1,i_quainumber, i_tknum, i_tMotifNocharg);
        MessageToast.show("Succès appel API ! validationMsgChargementQuaiModelJSON");
        } catch (oError) {
        Log.error("Échec de l'appel API validationMsgChargementQuaiModelJSON");
        }
    }
        
//----------------------------------------------------------------------------------------------------------------------------//
//               Méthode d'appel de l'API  ZCL_PCF_START_CHARG_RESOURCE/ Méthode GET                                          //  
//----------------------------------------------------------------------------------------------------------------------------//
public async ChargementStartModel_Get_apiservice() {
        try {
            // BEGIN GEMINI [CHECK] Cette instanciation est déja peut être réalisé dans le contrôlleur de la vue des quais lorsqu'on clique sur le bouton finChargement
            // Attention il faut instancier le modèle à la volée au premier clic fin de chargement
            if ( this.getModel("ChargementStartModel") == undefined)
                {
                    this.setModel(new JSONModel(), "ChargementStartModel");
                }
                // BEGIN GEMINI [CHECK] Cette instanciation est déja peut être réalisé dans le contrôlleur de la vue des quais lorsqu'on clique sur le bouton finChargement
            const oResult = this._apiService.ChargementStartModel_Get(this.getModel("ChargementStartModel") as JSONModel);
            MessageToast.show("Succès appel API ChargementStartModel!");
        } catch (oError) {
            Log.error("Échec de l'appel API ChargementStartModel");
        }
    }
    //----------------------------------------------------------------------------------------------------------------------------//
    //               Méthode d'appel de l'API  ZCL_PCF_START_CHARG_RESOURCE/ Méthode GET                                          //  
    //----------------------------------------------------------------------------------------------------------------------------//
    public async chargementStartModel_post_apiservice(i_quai:string,i_quainumber :number, i_numtransport:string, i_matri:string, i_name1 : string) {
        try {
            const oResult = this._apiService.api_startchargementquai_post(this.getModel("ChargementStartModel") as JSONModel,i_quai,i_quainumber, i_numtransport, i_matri, i_name1);
            MessageToast.show("Succès appel API ChargementStartModel Post!");
        } catch (oError) {
            Log.error("Échec de l'appel API ChargementStartModel Post");
        }
    }
        //----------------------------------------------------------------------------------------------------------------------------//
        //               Méthode d'appel de l'API  ZCL_PCF_START_CHARG_RESOURCE/ Méthode GET                                          //  
        //----------------------------------------------------------------------------------------------------------------------------//
        public async api_chargement_um_get_apiservice(i_quai:string) {
        try {
            if ( this.getModel("ChargementUmModel") == undefined)
            {
                this.setModel(new JSONModel(), "ChargementUmModel");
            }
        const oResult = this._apiService.api_chargement_um_get(this.getModel("ChargementUmModel") as JSONModel,i_quai);
        MessageToast.show("Succès appel API ChargementUmModel!");
        } catch (oError) {
            Log.error("Échec de l'appel API ChargementUmModel");
        }
        }

        //---------------------------------------------------------------------------------------------------------------------------------//
        //               Méthode d'appel à l'API  REST de lancement du chargement d'un quai  [ZCL_PCF_START_CHARG_RESOURCE/Méthode POST ]  //  
        //---------------------------------------------------------------------------------------------------------------------------------//
        public async api_chargement_um_post_apiservice(i_quai:string,i_codum:string, i_msgid?:string, i_aenam?:string , i_errdt?:string, i_errzt?:string, i_choice?:boolean) {
            try {
                if ( this.getModel("ChargementUmModel") == undefined)
                {
                    this.setModel(new JSONModel(), "ChargementUmModel");
                }
            const oResult = this._apiService.api_chargement_um_post(this.getModel("ChargementUmModel") as JSONModel,i_quai,i_codum,i_msgid,i_aenam,i_errdt, i_errzt,i_choice);
            MessageToast.show("Succès appel API ChargementUmModelPost!");
            } catch (oError) {
                Log.error("Échec de l'appel API ChargementUmModelPost");
            }
        }

    //----------------------------------------------------------------------------------------------------------------------------//
    //               Ouverture des Web Socket                                                                                     //  
    //----------------------------------------------------------------------------------------------------------------------------//
        public open_websocket_NotificationUM():void {
                    //Ouverture des Web Sockets  
                    // console.log("Instantiation du Web Socket avec url :" + this.gv_websocket_url);
                    //["wss","ws","https","http"]
                    this.gv_websocket = new WebSocket(this._apiService.gv_websocket_url);
                    let data_Socket : Object = '';
            
                    this.gv_websocket.attachOpen(function (e: Event) {
                        // console.log("Ouverture du Web Socket");
                    });

            this.gv_websocket.attachError(function (e: WebSocket$ErrorEvent) {
                    //  console.log("P1 hIGH  ERREUR OUVERTURE WEB SOCKET");
                    });

                    var that = this;
                    this.gv_websocket.attachMessage(data_Socket, function (e: WebSocket$MessageEvent) {
                        let params = e.getParameters();
                        let content : any = params.data;

                        // GEMINI BEGIN [Amélioration] Typage du payload
                        const payload = JSON.parse(content) as IWebSocketNotifs;  //TESTS UNITAIRES LOT 20/21 
                                                                                // -> Vérifier que la conversion en payload selon l'interface attendue fonctoinne
                        // GEMINI END [Amélioration] Typage du payload
                        that.getEventBus().publish("Default", application_events_enum.notification_websocket_event,  payload);   // Il est possible d'essayer avec    that.getEventBus().publish("Default", "notificationUMEvent",  content_json)
                    }); 
                }

            }
