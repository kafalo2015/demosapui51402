import UI5Object from "sap/ui/base/Object";
import Component from "../Component";
import { application_events_enum, chargement_um_context } from "./Enums";
import MessageToast from "sap/m/MessageToast";
import { IWebSocketNotifs, IChargementUmContext, IChargementUmGetPayload, IChargementUmPayload, IChargementUmValidationPayload, 
       IChargementStartPayload,IMotifsNchGetPayload,IMotifsNchPostPayload, IUmStockForMaterialPayload,  IMotifNchStructure} from "./Interfaces";
/**
 * @namespace clf.logistique.chargementquais.model
 */


export class EventHandlers extends UI5Object {
    private _oComponent: Component;

    constructor(oComponent: Component) {
        super();
        this._oComponent = oComponent;
    }

    /**
     * Centralise tous les abonnements du bus
     */
public initEvents(): void {
    const oEventBus = this._oComponent.getEventBus();
    //----------------------------------------------------------------------------------------------------------------------------//
    //               HANDLER DE Chargement des quais                                                                                               //  
    //----------------------------------------------------------------------------------------------------------------------------//
    oEventBus.subscribe("Default",application_events_enum.chargement_quais_event, this._get_chargement_quais,this);    
    //----------------------------------------------------------------------------------------------------------------------------//
    //               HANDLER DE validationMsgChargementEvent                                                                                                 //  
    //----------------------------------------------------------------------------------------------------------------------------//
    oEventBus.subscribe("Default",application_events_enum.validation_msg_chargement_event,  this._get_validation_msg_chargements, this);
    //----------------------------------------------------------------------------------------------------------------//
    //               HANDLER pour Appel de l'API REST de récupération des chargements prévus                          //  
    //----------------------------------------------------------------------------------------------------------------//
    oEventBus.subscribe("Default",application_events_enum.chargement_prevus_event,  this._get_chargements_prevus,this);

    //----------------------------------------------------------------------------------------------------------------//
    //               HANDLER pour Start Chargment des quais                                                           //  
    //----------------------------------------------------------------------------------------------------------------//
    oEventBus.subscribe("Default",application_events_enum.chargement_start_post_event, this._startchargementquai_post,this); 

    //----------------------------------------------------------------------------------------------------------------//
    //         LOT13 ->  HANDLER Récupération des motifs de non chargement                                             //  
    //----------------------------------------------------------------------------------------------------------------//
    oEventBus.subscribe("Default", application_events_enum.chargemen_end_motifsNch_get_event, this._get_motifs_nonchargement,this);

    //----------------------------------------------------------------------------------------------------------------//
    //         LOT13 ->  HANDLER POST des motifs de non chargement                                                    //  
    //----------------------------------------------------------------------------------------------------------------//
    oEventBus.subscribe("Default",application_events_enum.chargemen_end_motifsNch_post_event, this._post_motifs_nonchargement,  this ); 

    //----------------------------------------------------------------------------------------------------------------//
    //               HANDLER pour Chargement_UM_get     LOT15 -> Scan Manuel UM                                       //  
    //----------------------------------------------------------------------------------------------------------------//
    oEventBus.subscribe("Default", application_events_enum.chargement_um_get_event, this._api_chargement_um_get ,this );

    //----------------------------------------------------------------------------------------------------------------//
    //               HANDLER pour Chargement ou validation de chargement UM                                           //  
    //----------------------------------------------------------------------------------------------------------------//
    oEventBus.subscribe("Default",application_events_enum.chargement_um_post_event, this._api_chargement_um_post, this );

    //----------------------------------------------------------------------------------------------------------------         //
    //               HANDLER pour Appel de l'API REST de l'API REST Chargement Start Model (Matchcodes du formulaire de saisie)//  
    //----------------------------------------------------------------------------------------------------------------         //
    oEventBus.subscribe("Default",application_events_enum.chargement_start_get_event,  this._startchargementquai_get,this); 
    
    //----------------------------------------------------------------------------------------------------------------------------//
    //               HANDLER pour Appel de matchcodes articles en stock                                                                                                                        //  
    //----------------------------------------------------------------------------------------------------------------------------//
     oEventBus.subscribe("Default",application_events_enum.load_materialStock_event, this._get_material_umstock_list,this); 

    //----------------------------------------------------------------------------------------------------------------         //
    //               HANDLER pour Appel de Notification WebSocket                                                              //  
    //----------------------------------------------------------------------------------------------------------------         //
     oEventBus.subscribe("Default",  application_events_enum.notification_webSocket_event,this._notificationWebSocketHandler,this); 

    }

    private _get_chargement_quais(channel: string, event: string, data: any): void {
        // ... votre logique ici
         this._oComponent.get_chargement_quais_apiservice();     
    }


     private _get_validation_msg_chargements(channel: string, event: string, data: any): void {
        // ... votre logique ici
         this._oComponent.get_validation_msg_chargements_apiservice();
    }

    private _startchargementquai_get(channel: string, event: string, data: any): void {
         //------ Envoi d'une notification à la vue ChargementStart pour rendre invisible les messagesStrip----
            const oEventBus = this._oComponent.getEventBus();
            oEventBus.publish("Default",  application_events_enum.initialize_chargementStartMessageStrip_event , {});    
            //------ Récupération des matchcodes du formulaire de saisie de démararge d'un nouveau Chargement------
            // GEMINI BEGIN [Amélioration] Externalisation des appels API dans API Service
            this._oComponent.ChargementStartModel_Get_apiservice();
            // GEMINI END [Amélioration] Externalisation des appels API dans API Service
    }

    private _startchargementquai_post(channel: string, event: string, data: any): void {
        // ... votre logique ici
        // BEGIN Amélioration  - > Faire un payload pour le démarrage du quai
        //let quai :string = Object.values(data)[0] as string;
        const payload = data as IChargementStartPayload;   // GEMINI[Avis] Possibilité de typer directement le pamètre data en IChargementStartPayload mais moins de flexibilité
        // BEGIN Amélioration  - > Faire un payload pour le démarrage du  quai
        this._oComponent.chargementStartModel_post_apiservice(payload.quai, payload.quai_number, payload.numtransport, payload.matri, payload.name1);
    }

    private _get_motifs_nonchargement(channel: string, event: string, data: any): void {
    // GEMINI BEGIN  [Amélioration] Créer un payload pour l'appel à l'API des motifs de non chargement
         const payload = data as IMotifsNchGetPayload
    // GEMINI END [Amélioration] Créer un payload pour l'appel à l'API des motifs de non chargement
    this._oComponent.get_motifs_nonchargement_apiservice(payload.quai,payload.transport); 
}

private _post_motifs_nonchargement(channel: string, event: string, data: any): void {
    // GEMINI BEGIN  [Amélioration] Créer un payload 
    const payload = data as IMotifsNchPostPayload;
    // GEMINI END [Amélioration] Créer un payload 
        this._oComponent.post_motifs_nonchargement_apiservice(payload.quai1, payload.quai_number, payload.tknum, payload.tMotifNocharg);   //GEMINI[Harmonisation] Pas de payload pour cette API
                                                        //=> Les données sont récupérées plus tard par model.get_data()
    }

private _notificationWebSocketHandler(channel: string, event: string, data: any): void {
    // GEMINI BEGIN  [Amélioration] Créer un payload  => Regarder dans le component  dans le handler this.gv_websocket.attachMessage quelles sont les paramètres 
    // this._oComponent.notificationWebSocketHandler(Object.values(data)[0] as string,Object.values(data)[1] as string ,Object.values(data)[2] as string ,Object.values(data)[3] as string,Object.values(data)[4] as string,Object.values(data)[5] as string
    //, Object.values(data)[6] as string, Object.values(data)[7] as string, Object.values(data)[8] as string); 
    
    const payload =  data as IWebSocketNotifs;
    this._oComponent.notificationWebSocketHandler(payload.type_msg,payload.msg_txt, payload.transport, payload.um, payload.quai, payload.action,
                                                payload.user, payload.time, payload.checkid,  payload.i_rfid);
    
    // GEMINI END  [Amélioration] Créer un payload   
}

//----------------------------------------------------------------------------------------------------------------//
//---- LOT 9 Validation des messages de Warning TODO )                                                            //
//----------------------------------------------------------------------------------------------------------------//
private _api_chargement_um_get(channel: string, event: string, data: any): void {
    // GEMINI  [TODO] Créer un payload pour l'appel à l'API Chargement UM  
   const payload = data as IChargementUmGetPayload 
    // GEMINI  [TODO] Créer un payload pour l'appel à l'API Chargement UM
    this._oComponent.api_chargement_um_get_apiservice(payload.quai);
}

//----------------------------------------------------------------------------------------------------------------//
//---- LOT 9 Validation des messages de Warning TODO )                                                            //
//----------------------------------------------------------------------------------------------------------------//
private _api_chargement_um_post(channel: string, event: string, data: any): void {
      // GEMINI BEGIN [Amélioration interface remplace Object.values(data)[0]] Comment s'assurer que le paramètre data reçu dans le subscribe respecte l'interface IValidationPayload
// Attention il faut distinguer le chargement UM et la validation chargement UM car le payload n'est pas le même
  let ChargementUmContext : IChargementUmContext =  data as IChargementUmContext; 
  let ChargementUmPostPayLoad : IChargementUmPayload =  data as IChargementUmPayload;
  let ChargementUmPostValidationPayLoad : IChargementUmValidationPayload =  data as IChargementUmValidationPayload;  

// Extraction propre en une ligne (Destructuring) Le code au dessus est équivalent à ce code mais je préfère la version avec l'interface
    //const { quai, codum, msgid, aenam, errdt, errzt, choice } = data;
        
// On extrait les conditions dans des constantes explicites
// La validation de chargement UM nécessite plus de paramètre d'entrées que le chargement UM
  const isPostMissingData = ChargementUmContext.context ===  chargement_um_context.chargement_um_post && 
                          (!ChargementUmPostPayLoad.quai || !ChargementUmPostPayLoad.codum);

  const isValidationMissingData = ChargementUmContext.context ===  chargement_um_context.validation_chargement_um_post && 
                                (!ChargementUmPostValidationPayLoad.quai || 
                                 !ChargementUmPostValidationPayLoad.codum || 
                                 !ChargementUmPostValidationPayLoad.msgid || 
                                 !ChargementUmPostValidationPayLoad.aenam || 
                                 !ChargementUmPostValidationPayLoad.errdt || 
                                 !ChargementUmPostValidationPayLoad.errzt);

// La condition finale devient limpide
if (isPostMissingData || isValidationMissingData) 
    {
console.error("Un Paramètre de l'appel à ChargementUmPost est manquant!");
MessageToast.show("Un Paramètre de l'appel à ChargementUmPost est manquant! QUAI=" +  ChargementUmPostValidationPayLoad.quai + "CODUM=" + ChargementUmPostValidationPayLoad.codum 
                    + "MSGID=" +  ChargementUmPostValidationPayLoad.msgid  + "AENAM=" + ChargementUmPostValidationPayLoad.aenam
                    , {duration: 3000} );
return; // On arrête tout avant d'envoyer n'importe quoi à SAP
}

// GEMINI BEGIN LOT 20/21  -> Modifier l'interface de la méthode  api_chargement_um_post pour qu'elle serve à la fois au chargement um
// et à la validation du chargement de l'UM [Tous les paramètres sont obligatoires]
// GEMINI [Check] Attention SAP prend mal en compte le paramètre choice de type boolean
if  ( ChargementUmContext.context ==    chargement_um_context.chargement_um_post )
{this._oComponent.api_chargement_um_post_apiservice(ChargementUmPostPayLoad.quai,ChargementUmPostPayLoad.codum);}
else
{ this._oComponent.api_chargement_um_post_apiservice(ChargementUmPostPayLoad.quai,ChargementUmPostPayLoad.codum, ChargementUmPostValidationPayLoad.msgid, 
                              ChargementUmPostValidationPayLoad.aenam,ChargementUmPostValidationPayLoad.errdt, 
                              ChargementUmPostValidationPayLoad.errzt, ChargementUmPostValidationPayLoad.choice);            } 
// GEMINI END LOT 20/21    
    }

 private _get_material_umstock_list(channel: string, event: string, data: any): void {
// BEGIN GEMINI[TODO] Il faudra créer une interface payload pour la recherche MaterialUMStock
//let lv_material :string = Object.values(data)[0] as string;
const payload  = data as IUmStockForMaterialPayload;

// END GEMINI[TODO] Il faudra créer une interface payload pour la recherche MaterialUMStock
this._oComponent.get_material_umstock_list_apiservice(payload.material);
}

private _get_chargements_prevus(channel: string, event: string, data: any): void {
         this._oComponent.get_chargements_prevus_apiservice();
}

    /**
     * Nettoyage pour éviter les fuites mémoire
     */
public destroyEvents(): void {
const oEventBus = this._oComponent.getEventBus();
oEventBus.unsubscribe("Default", application_events_enum.chargement_quais_event, this._get_chargement_quais, this);
oEventBus.unsubscribe("Default", application_events_enum.validation_msg_chargement_event, this._get_validation_msg_chargements, this);
oEventBus.unsubscribe("Default", application_events_enum.chargement_start_get_event, this._startchargementquai_get, this);  // TODO => Rajouter  unEnum our cet event
oEventBus.unsubscribe("Default", application_events_enum.chargement_start_post_event, this._startchargementquai_post, this);  // TODO => Rajouter  unEnum our cet event
oEventBus.unsubscribe("Default", application_events_enum.chargemen_end_motifsNch_get_event, this._get_motifs_nonchargement, this);  // TODO => Rajouter  unEnum our cet event
oEventBus.unsubscribe("Default", application_events_enum.chargemen_end_motifsNch_post_event, this._post_motifs_nonchargement, this);
oEventBus.unsubscribe("Default", application_events_enum.notification_webSocket_event, this._notificationWebSocketHandler, this);
oEventBus.unsubscribe("Default", application_events_enum.chargement_um_get_event, this._api_chargement_um_get, this);
oEventBus.unsubscribe("Default", application_events_enum.chargement_um_post_event, this._api_chargement_um_post, this);
oEventBus.unsubscribe("Default", application_events_enum.load_materialStock_event, this._get_material_umstock_list, this);
oEventBus.unsubscribe("Default", application_events_enum.chargement_prevus_event, this._get_chargements_prevus, this);
    }

}