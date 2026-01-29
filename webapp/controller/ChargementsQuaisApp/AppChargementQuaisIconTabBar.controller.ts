import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import IconTabBar, { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import UIComponent from "sap/ui/core/UIComponent";
import Control from "sap/ui/core/Control";
import MessageStrip from "sap/m/MessageStrip";
import View from "sap/ui/core/mvc/View";
import Panel from "sap/m/Panel";
import SideNavigation, { SideNavigation$ItemSelectEvent } from "sap/tnt/SideNavigation";
import JSONModel from "sap/ui/model/json/JSONModel";
import Dialog from "sap/m/Dialog";
import Context from "sap/ui/model/Context";
import { Targets$DisplayEvent } from "sap/ui/core/routing/Targets";
import Target from "sap/ui/core/routing/Target";
import { Button$PressEvent } from "sap/m/Button";

/**
 * @namespace clf.logistique.chargementquais.controller
 */
export default class AppChargementQuaisIconTabBar extends Controller {
    private gv_current_quai_number : number;
    private gv_current_quai : string;
    private gv_dialog_validation_charg: Dialog;
    
    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
  //----------------------------------------------------------------------------------------------------------------------------//
  //               LOT 8 : Validation des messages de chargement // Instantiation du fragment du dialogue 
  //                                                                et enregistrement de listener sur les routes de quais        //  
  //----------------------------------------------------------------------------------------------------------------------------//

  //----------------------------------------------------------------------------------------------------------------------------//
  //               LOT 8/9 : Validation des messages de chargement // Instantiation du fragment du dialogue 
  //----------------------------------------------------------------------------------------------------------------------------//
  this.onOpenDialogValidCharg();

  //---------------------------------------------------------------------------------------------------------------------------------------------------------//
  //               LOT 8/9 : Validation des messages de chargement //Enregistrement de listeners sur les quais => Si message de validation, ouverture d'un popup//
  //---------------------------------------------------------------------------------------------------------------------------------------------------------//
// Mettre les handlers sur les targets de quai
 const router = UIComponent.getRouterFor(this);
 //router.getTarget?(["TargetChargementQuai08","TargetChargementQuai09","TargetChargementQuai10", "TargetChargementQuai11","TargetChargementQuai12","TargetChargementQuai13","TargetChargementQuai14","TargetChargementQuai15"])
 router.getTargets()?.attachDisplay((evt: Targets$DisplayEvent)=>{ console.log("P1 HIGH// TEST de l'attach display de l'ensemble des targets")      }); 
 
 let target_quai08: Target = router.getTarget("targetchargementquai08") as Target;
 let target_quai09: Target = router.getTarget("targetchargementquai09") as Target;
 let target_quai10: Target = router.getTarget("targetchargementquai10") as Target;
 let target_quai11: Target = router.getTarget("targetchargementquai11") as Target;
 let target_quai12: Target = router.getTarget("targetchargementquai12") as Target;
 let target_quai13: Target = router.getTarget("targetchargementquai13") as Target;
 let target_quai14: Target = router.getTarget("targetchargementquai14") as Target;
 let target_quai15: Target = router.getTarget("targetchargementquai15") as Target;
 
 let target_startchargement_quai08: Target = router.getTarget("targetstartchargementquai08") as Target;
 let target_startchargement_quai09: Target = router.getTarget("targetstartchargementquai09") as Target;
 let target_startchargement_quai10: Target = router.getTarget("targetstartchargementquai10") as Target;
 let target_startchargement_quai11: Target = router.getTarget("targetstartchargementquai11") as Target;
 let target_startchargement_quai12: Target = router.getTarget("targetstartchargementquai12") as Target;
 let target_startchargement_quai13: Target = router.getTarget("targetstartchargementquai13") as Target;
 let target_startchargement_quai14: Target = router.getTarget("targetstartchargementquai14") as Target;
 let target_startchargement_quai15: Target = router.getTarget("targetstartchargementquai15") as Target;

target_quai08.attachDisplay(()=>{ 
   this.gv_current_quai = 'QUAI08';
   console.log("--------ICONTABBAR CONTROLLER Target08 AttachDisplay : " +  this.gv_current_quai);
     
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/0/tValidationMsg");
  // La popup ne doit s'afficher que s'il existe des notifications de validation dans le modèle notificationsQuaisModel pour le quai en question
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String} =  { quai_number_popup:  "QUAI08"};

  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                });

target_quai09.attachDisplay(()=>{ 
  this.gv_current_quai = 'QUAI09';
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/1/tValidationMsg");
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String}  =  { quai_number_popup:  "QUAI09"};
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                });

target_quai10.attachDisplay(()=>{ 
   this.gv_current_quai = 'QUAI10';
  console.log("--------ICONTABBAR CONTROLLER Target10 AttachDisplay : " +  this.gv_current_quai);
     
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/2/tValidationMsg");
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String} =  { quai_number_popup:  "QUAI10"};
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                });
target_quai11.attachDisplay(()=>{ 
   this.gv_current_quai = 'QUAI11';
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/3/tValidationMsg");
  if (t_validation_msg_list.length > 0 )      {   
  let data : {quai_number_popup:String} =  { quai_number_popup:  "QUAI11"};
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }                                               
                            });


target_quai12.attachDisplay(()=>{ 
    this.gv_current_quai = 'QUAI12';
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/4/tValidationMsg");
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String} =  { quai_number_popup:  "QUAI12"};
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                });


target_quai13.attachDisplay(()=>{ 
    this.gv_current_quai = 'QUAI13';
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/5/tValidationMsg");
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String} =  { quai_number_popup:  "QUAI13"};
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                });        
                                
target_quai14.attachDisplay(()=>{ 
    this.gv_current_quai = 'QUAI14';
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/6/tValidationMsg");
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String} =  { quai_number_popup:  "QUAI14" };
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                }); 
                                
target_quai15.attachDisplay(()=>{ 
    this.gv_current_quai = 'QUAI15';
  let  t_validation_msg_list : Array<string> = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.getProperty("/results/7/tValidationMsg");
  if (t_validation_msg_list.length > 0 ) {  
  let data : {quai_number_popup:String} =  { quai_number_popup:  "QUAI15"};
  this.getOwnerComponent()?.getEventBus().publish("Default", "validationDialogEvent", data);
  }
                                });       
                                
   target_startchargement_quai08.attachDisplay(()=>{   this.gv_current_quai = 'QUAI08';});    
                                                                                                
   target_startchargement_quai09.attachDisplay(()=>{   this.gv_current_quai = 'QUAI09';});   

   target_startchargement_quai10.attachDisplay(()=>{   this.gv_current_quai = 'QUAI10';});  
                                                                                                
   target_startchargement_quai11.attachDisplay(()=>{   this.gv_current_quai = 'QUAI11';}); 
                                                                                                
   target_startchargement_quai12.attachDisplay(()=>{   this.gv_current_quai = 'QUAI12';});  
                                                                                                
   target_startchargement_quai13.attachDisplay(()=>{   this.gv_current_quai = 'QUAI13';});    
    
   target_startchargement_quai14.attachDisplay(()=>{   this.gv_current_quai = 'QUAI14';});     
                                                                                                
   target_startchargement_quai15.attachDisplay(()=>{   this.gv_current_quai = 'QUAI15';});                                                                                               
                                                                                                
          // Enregistrement d'un handler pour le click sur quai dans Chargement List   
        this.getOwnerComponent()?.getEventBus().subscribe("Default","chargementQuaiButtonEvent",(channel:string,event:string,data: Object) => {           
              this.button_chargementquai_handler();  
            },this); 

     //----------------------------------------------------------------------------------------------------------------------------//
     //             HANDLER validationDialogEvent  [LOT 8 : Validation des messages de chargement]                                 //  
     //----------------------------------------------------------------------------------------------------------------------------//
    this.getOwnerComponent()?.getEventBus().subscribe("Default","validationDialogEvent",(channel:string,event:string,data: Object) => {           
       
      let quai_number: number = Number(Object.values(data)[0].slice(4,6));
      let current_quai_index_json:number=   quai_number - 8 ;

      console.log("P1 LOT10 Validation des chargements QUAI DE LA NOTIFICATION: " + quai_number + "-QUAI ACTUEL:  " + this.gv_current_quai_number);
       if ( quai_number == this.gv_current_quai_number) 
      {    this.gv_dialog_validation_charg.setBindingContext(this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON")?.createBindingContext("/results/" + current_quai_index_json + "/") as Context,"validationMsgChargementQuaiModelJSON");  
           this.gv_dialog_validation_charg.open();
      }
        },this);
      }

     //----------------------------------------------------------------------------------------------------------------------------//
     //               Affichage des notifications d'Erreur/Warning ou Succes dans les messages Strip du quaui  => METHODE OBSOLETE                                                                                   //  
     //----------------------------------------------------------------------------------------------------------------------------// 
    public notification_handler(type_msg:string, msg_txt: string,transport:string, um: String, current_quai: string, action :string, user:string ) : void{ 
        //   let IconTabBarControl : IconTabBar = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
        //   let message_chargementum_ok :string;
        //   // Panel d'affichage des messages  
        //   let panelMessage : Panel = this.byId("PanelMessageAppChargementQuais") as Panel;   // TODO=>Mettre le numéro de quai en dynamique
        //   //let panelMessageQuai : Panel;
        //   // Message Strip au niveau des vues de quai
        //   let messageStrip_ref : MessageStrip;
        //   let messageStripErrorQuai : MessageStrip;
        //   let messageStripWarningQuai : MessageStrip;
        //   let messageStripInformationQuai : MessageStrip;
          
        //   console.log("------------------ AppChargementQuaisIconTabBar.controller/NOTIFICATION HANDLER -----------------------------------------------------------------------------------------------------");
        //   console.log("P1 Quai de la notification : " +  current_quai.toLowerCase() + " Quai affiché dans l'IconTabBar: " + IconTabBarControl.getSelectedKey());
        // // Si la page courante correspond au quai de la notification alors on recharge (on teste le quai 10 dans un premier temps)
        // // if ( IconTabBarControl.getSelectedKey() == current_quai){                 //TODO=>Evol LOT 4 : Ce test n''est pas nécessaire les messages strip
        //                                                                            // doivent se mettre à jour meême si on ne se trouve pas sur le quai concerné
        //                                                                            // par la notificaiotn
        //        let tcontent : View[] = IconTabBarControl.getContent() as View[];
        //        let tcontent_views : Control[]
        //        tcontent.forEach((content) => {
        //        tcontent_views = content.getContent() as Control[];
        //         tcontent_views.forEach((control) => {
        //         // code pour remplir le  messageStrip d'erreur et le messageStrip d'information du quai 
        //             console.log(control.getId());
        //           if ( control.getId() == "container-clf.logistique.chargementquais---" + current_quai.toLowerCase() + "--messageStripError" )
        //           {
        //             messageStripErrorQuai = control as MessageStrip;
              
        //            if ( type_msg == 'E' ){
        //             messageStripErrorQuai.setText(msg_txt); 
        //             messageStripErrorQuai.setVisible(true); 
        //             } 
        //           if  ( type_msg == 'W' ) {messageStripErrorQuai.setVisible(false);     }
        //           if  ( type_msg == 'information' ) {messageStripErrorQuai.setVisible(false);     }
        //           } 

        //           if ( control.getId() == "container-clf.logistique.chargementquais---" + current_quai.toLowerCase() + "--messageStripWarning" )
        //           {
        //             messageStripWarningQuai = control as MessageStrip;
        //            // if ( type_msg == 'error' ){

        //            if ( type_msg == 'W' ){
        //              messageStripWarningQuai.setText(msg_txt); 
        //              messageStripWarningQuai.setVisible(true); 
        //             } 
        //           if  ( type_msg == 'E' ) { messageStripWarningQuai.setVisible(false);     }
        //           if  ( type_msg == 'information' ) { messageStripWarningQuai.setVisible(false);     }
        //           }  

        //             if (  control.getId() == "container-clf.logistique.chargementquais---" + current_quai.toLowerCase() + "--messageStripInformation" )
        //             {
        //               messageStripInformationQuai = control as MessageStrip;
        //               if ( type_msg == 'information' )
        //               {
        //               messageStripInformationQuai.setText(msg_txt); 
        //               messageStripInformationQuai.setVisible(true); 
        //               }
        //               if ( type_msg == 'E' ){  messageStripInformationQuai.setVisible(false);     }
        //               if ( type_msg == 'W' ){  messageStripInformationQuai.setVisible(false);   }
        //             }
        //         })
        //       })
        //       // LOT 4 : Chargement des quais  => Code erroné à changer
        //       // Si le quai affiché est concerné par la notification et le message est de type information alors on affiche un Toast et on rafraichit le quai 
        //       //if ( type_msg == 'information' )  //if ( IconTabBarControl.getSelectedKey() == current_quai){
        //        // {
        //         //  MessageToast.show(msg_txt);
        //          // this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {}); 
        //        // }
        //        // LOT 4 : Chargement des quais  => Code erroné à changer
        // //}
        //         // LOT 4 : Chargement des quais 
        //       // Si le quai affiché est concerné par la notification et le message est de type information alors on affiche un Toast et on rafraichit le quai 
        //       if ((action == 'chargement') && (type_msg == 'information' ) ) // TODO => && ( IconTabBarControl.getSelectedKey() == current_quai
        //         {
        //           MessageToast.show(msg_txt);
        //           this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {}); 
        //           this.getOwnerComponent()?.getEventBus().publish("Default", "chargementListEvent", {}); "Rechargement de la liste des chargements prévus"
        //         }
        //        // LOT 4 : Chargement des quais  =  

        //        // Affichage de tous les messages (Information et Erreur) relatifs à l'ensemble des quais
        //         messageStrip_ref = new MessageStrip();
        //         messageStrip_ref.setText(msg_txt);       // Correctif++ 14/08/2025 Correctifs notifications
        //                                                  // Toujours afficher le message dans  la zone Messages quel que soit le type de message (E, W ou S)
        //          // msgStrip.setType(MessageType.Error);
        //          messageStrip_ref.setShowIcon(true);
        //          messageStrip_ref.setShowCloseButton(true);  
        //          console.log("P1 AJOUT d'un message dans la zone MEssages multi quai");
        //          panelMessage.addAggregation("content",messageStrip_ref);

        //          // TODO Notification fin de chargement 
        //          //Si l'action est fin de chargement alors il faut recharger le chargement des quais quel que soit le quai affiché
        //          // Modification LOT 4 'Lancement début de chargementnt'
        //          //if ( action = 'finchargement' )
        //          if ( action == 'finchargement'  ||  action == 'startchargement')
        //          {
        //          console.log("Notification de fin de chargement");
        //          MessageToast.show(msg_txt);
        //          this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {});  //Notification fin de chargement"
        //          }
    }
     //----------------------------------------------------------------------------------------------------------------------------//
     //   Handler clic sur le quai      -> A VERIFIER SI C'EST UTILISE  (serait utilisé pour le lien vers le quai dans l'application 'Chargement prévus" )                                               //  
     //----------------------------------------------------------------------------------------------------------------------------//
    public button_chargementquai_handler() : void{ 
       console.log("P1 VERY HIGH------------------------------------------------- Méthode button_chargementquai_handler() ------------------ " );
       let IconTabBarControl : IconTabBar;
       IconTabBarControl = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
       let selectedKeyQuaiNumber : string  =  IconTabBarControl.getSelectedKey();
       console.log(" button_chargementquai_handler() : " + selectedKeyQuaiNumber);
         const router = UIComponent.getRouterFor(this);
           if ( selectedKeyQuaiNumber == "" )        {  router.getTargets()?.display("targetchargementquai08");  }   // Evolution quai 8 et 09
           if ( selectedKeyQuaiNumber == "QUAI08" )  {  router.getTargets()?.display("targetchargementquai08");  }   // Evolution quai 8 et 09s
           if ( selectedKeyQuaiNumber == "QUAI09" )  {  router.getTargets()?.display("targetchargementquai09");  }
           if ( selectedKeyQuaiNumber == "QUAI10" )  {  router.getTargets()?.display("targetchargementquai10");  }
           if ( selectedKeyQuaiNumber == "QUAI11" )  {  router.getTargets()?.display("targetchargementquai11");  }
           if ( selectedKeyQuaiNumber == "QUAI12" )  {  router.getTargets()?.display("targetchargementquai12");  }
           if ( selectedKeyQuaiNumber == "QUAI13" )  {  router.getTargets()?.display("targetchargementquai13");  }
           if ( selectedKeyQuaiNumber == "QUAI14" )  {  router.getTargets()?.display("targetchargementquai14");  }
           if ( selectedKeyQuaiNumber == "QUAI15" )  {  router.getTargets()?.display("targetchargementquai15");  }
        }

     //----------------------------------------------------------------------------------------------------------------------------//
     //               Handler clic sur le quai  (Pour synchroniser le routing avec le quai sélectionné)                                                                                   //  
     //----------------------------------------------------------------------------------------------------------------------------//
    public onAfterRendering(): void {
      // Ce code pour synchroniser le selected key avec le routing a été retiré momentanaément
    let IconTabBarControl : IconTabBar;       
    IconTabBarControl = this.getView()?.byId("idIconTabBarQuais") as IconTabBar;
    //  let content_string : any  = this.byId("idIconTabBarQuais")?.getAggregation("content")?.toString();
    //  let content_string_table : string[] = content_string.split("---",2 );
    //  console.log("IcontabBar content_string" + content_string_table[1]);
    //  console.log("IconTabBar Selected Key" + IconTabBarControl.getSelectedKey());
    console.log("VERY HIGH SYNCHRONIZATION DU SELECTED KEY DE l'ICON TAB BAR ---VALEUR DU QUAI: " +  this.gv_current_quai);
    IconTabBarControl.setSelectedKey(this.gv_current_quai);
     }
//----------------------------------------------------------------------------------------------------------------------------//
//               Handler de sélection d'un onglet de l'IConTabBar                                                       //  
//----------------------------------------------------------------------------------------------------------------------------//
    public onTabSelect(event: IconTabBar$SelectEvent): void {
          // Récupération de l'identififant de l'onglet sélectionné
      let key = event.getParameter("key");
      const router = UIComponent.getRouterFor(this);
      // Récupération des modèles json nécessaires
      let ChargementQuaiModel     : JSONModel = this.getOwnerComponent()?.getModel("chargementModelJson")     as JSONModel;
      let notificationsQuaisModel : JSONModel = this.getOwnerComponent()?.getModel("notificationsQuaisModel") as JSONModel;
      let chargementStartModel    : JSONModel = this.getOwnerComponent()?.getModel("ChargementStartModel")    as JSONModel;
      // Calcul des indices et indice json du quai sélectionné
      
      let indice_quai : number= Number( key?.slice(4,6));
      let indice_json : number; indice_json = indice_quai - 8;
      // Stockage du quai actuellement sélectionné en global dans le contrôlleur
    

    //----------------------------- Détection de s'il s'agit de si le quai est en cours de chargement ou non ----------------------------------------------                
      let encours : boolean = ChargementQuaiModel.getObject("/results/" + indice_json + "/chargementEncours");
          if ( encours == true ) 
          {
           /******************    REINITIALISATION DES MESSAGES ERREUR/WARNING LORS DE CHANGEMENT DE QUAI**************************************** */      
            notificationsQuaisModel.setProperty("/chargementstartnotifs/notifwarning/msg_txt","");   
            notificationsQuaisModel.setProperty("/chargementstartnotifs/notifwarning/visible",false);   
        
            // Relance de la récupération des données de chargement avant la navigation sur le quai
            this.getOwnerComponent()?.getEventBus().publish("Default", "chargementEvent", {}); 
            if ( key == "QUAI08" )  {  router.getTargets()?.display("targetchargementquai08"); }
            if ( key == "QUAI09" )  {  router.getTargets()?.display("targetchargementquai09");  }   // Evolution quai 8 et 09
            if ( key == "QUAI10" )  {  router.getTargets()?.display("targetchargementquai10");  }
            if ( key == "QUAI11" )  {  router.getTargets()?.display("targetchargementquai11");  }
            if ( key == "QUAI12" )  {  router.getTargets()?.display("targetchargementquai12");  }
            if ( key == "QUAI13" )  {  router.getTargets()?.display("targetchargementquai13");  }
            if ( key == "QUAI14" )  {  router.getTargets()?.display("targetchargementquai14");  }
            if ( key == "QUAI15" )  {  router.getTargets()?.display("targetchargementquai15");  }
          }
          else   //Si aucun chargement en cours sur le quai alors on affiche un formulaire de lancement de chargement
          {      
          //  REINITIALISATION DU FORMULAIRE DE SAISIE Uniquement si on ne clique pas sur le quai actuellement affiché  
          console.log("");
            if ( this.gv_current_quai_number != indice_quai )
            {
                  chargementStartModel.setProperty("/results/tknum",""); 
                  chargementStartModel.setProperty("/results/matri",""); 
                  notificationsQuaisModel.setProperty("/chargementstartnotifs/notiferror/msg_txt",""); 
                  notificationsQuaisModel.setProperty("/chargementstartnotifs/notiferror/visible",false); 


            }
            // Evolution Anomalie Synchroniszation routing et selected key   
            if ( key == "QUAI08" )  {  router.getTargets()?.display("targetstartchargementquai08"); }
            if ( key == "QUAI09" )  {  router.getTargets()?.display("targetstartchargementquai09");  }   // Evolution quai 8 et 09
            if ( key == "QUAI10" )  {  router.getTargets()?.display("targetstartchargementquai10");  }
            if ( key == "QUAI11" )  {  router.getTargets()?.display("targetstartchargementquai11");  }
            if ( key == "QUAI12" )  {  router.getTargets()?.display("targetstartchargementquai12");  }
            if ( key == "QUAI13" )  {  router.getTargets()?.display("targetstartchargementquai13");  }
            if ( key == "QUAI14" )  {  router.getTargets()?.display("targetstartchargementquai14");  }
            if ( key == "QUAI15" )  {  router.getTargets()?.display("targetstartchargementquai15");  }
          }
            this.gv_current_quai_number = indice_quai;
    } 

        async onOpenDialogValidCharg(): Promise<void> {
          this.gv_dialog_validation_charg ??= await this.loadFragment({                                // A noter qu'il existe également une méthode sur la classe Fragement pour instantier un fragment
             name: "clf.logistique.chargementquais.view.fragment.DialogValidChargement"
          }) as Dialog;
           //console.log("P1 HIGH Initialisation de la variable de dialog :" + this.gv_dialog_validation_charg);
            this.gv_dialog_validation_charg.setModel(this.getOwnerComponent()?.getModel("notificationsQuaisModel"),"notificationsQuaisModel");
        }  
      
    public onValidationClose(): void {
      this.gv_dialog_validation_charg.close();
    }

 public onConfirmValidationMsgChargement(event:Button$PressEvent):void {
  console.log("------------------------------------------------------P1 HIGH LOT10 onConfirmValidationMsgChargement Handler: --------------------------------------------------------------");
  let validation_msg_indicejson:string;
  // Récupération du modèle de notifications des quais (Messages de validation par quai)
  let validationMsgChargementQuaiModel : JSONModel = this.getOwnerComponent()?.getModel("validationMsgChargementQuaiModelJSON") as JSONModel;
  
  let source_string:string                 = event.getSource().toString();                // Pour récupérer l'indice de message de validation(Warning ou choice) , l'élément source du handler utilisé (Autre possibilité -> Utiliser event->GetParameter())
  let current_indicejson_quai :number      = this.gv_current_quai_number - 8;             // Calcul de l'indice json du quai (quai number-8)
  let indice_validationmsg_string : string = source_string.at(source_string.length-1)!;   // Récupération de l'indice du message de Validation // A vérifier si c'est toujours Ok pour le L0T 10
  //----------------------------------------------------------------------------------------------------------------------------------------------------//
  //------------------- LOT8/9 Validation des messages de Warning-> Récupérer le contexte de la validation (QUAI/UM/Checknumber)------------------------//
  //----------------------------------------------------------------------------------------------------------------------------------------------------//
  let validation_msg_codum : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai +  "/tValidationMsg/" + indice_validationmsg_string + "/exidv") ;
  let validation_msg_msgid : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/msgId") ;
  let validation_msg_aenam : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/aenam") ;
  let validation_msg_errdt : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/errdt") ;
  let validation_msg_errzt : string     = validationMsgChargementQuaiModel.getProperty("/results/" +  current_indicejson_quai + "/tValidationMsg/" + indice_validationmsg_string + "/errzt") ;
  console.log("P1 HIGH LOT9 Récupération du contexte du message de Warning// -errzt: " + validation_msg_errzt);
  // Détection de si l'utilisateur a cliqué sur Ok ou Refuser (ne concerne que les Validations de types Choice)
  let lv_choice:string='';
  if  (event.getSource().getId().includes("ButtonOK"))     {   lv_choice = 'X' ;}
  if  (event.getSource().getId().includes("ButtonReject")) {   lv_choice = '';}
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------Envoi d'un évènement au controlleur pour appel de l'API de Chargement de l'UM-------------------------------------------------------------------------------------------------- 
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
  // Anomalie 18/11/2025 BEGIN [Quai au format attendu par l'API]
  let lv_quai:string;
  // Fournir à l'API (Chargement UM) le quai sous forme 'QUAI09','QUAI10" (Si le numéro de quai  <10 alors il faut rajouter un "O" entre QU et le numéro de quai)
  if ( this.gv_current_quai_number < 10 )
      { lv_quai = "QUAI" + "0" + this.gv_current_quai_number; }
  else{ lv_quai = "QUAI" + this.gv_current_quai_number; }
// Anomalie 18/11/2025 END

  let data : {quai:string, codum :string, msgid:string, aenam:string, errdt:string, errzt :string, choice:string} =
     { quai: lv_quai, codum : validation_msg_codum,  msgid: validation_msg_msgid, aenam : validation_msg_aenam, errdt: validation_msg_errdt, errzt: validation_msg_errzt, choice : lv_choice}
    this.getOwnerComponent()?.getEventBus().publish("Default", "ValidationWarningUMEvent", data);
 }


 //----------------------------------------------------------------------------------------------------------------------------------------------------//
  //------------------- LOT 15 BEGIN SCAN MANUEL DES UMS    
  //      Attention Réfléchir à s'il faut coder dans ce controlleur ou dans le controlleur des quais
  //     + Voir comment récupérer l'UM saisit                                                                                ------------------------//
  //----------------------------------------------------------------------------------------------------------------------------------------------------//
 public onValidScanUm(event:Button$PressEvent):void {
  console.log("------------------------------------------------------P1 HIGH LOT15 onValidScanUm: --------------------------------------------------------------");
  // Anomalie 18/11/2025 BEGIN [Quai au format attendu par l'API]
  let lv_quai:string;
  // Fournir à l'API (Chargement UM) le quai sous forme 'QUAI09','QUAI10" (Si le numéro de quai  <10 alors il faut rajouter un "O" entre QU et le numéro de quai)
  if ( this.gv_current_quai_number < 10 )
      { lv_quai = "QUAI" + "0" + this.gv_current_quai_number; }
  else{ lv_quai = "QUAI" + this.gv_current_quai_number; }
// Anomalie 18/11/2025 END

  let data : {quai:string, codum :string, msgid:string, aenam:string, errdt:string, errzt :string, choice:string} =
     { quai: lv_quai, codum : '',  msgid: '', aenam : '', errdt: '', errzt: '', choice : ''}
    this.getOwnerComponent()?.getEventBus().publish("Default", "ValidationWarningUMEvent", data);
 }

  //----------------------------------------------------------------------------------------------------------------------------------------------------//
  //------------------- LOT 15 END SCAN MANUEL DES UMS                                                                                    ------------------------//
  //----------------------------------------------------------------------------------------------------------------------------------------------------/

}