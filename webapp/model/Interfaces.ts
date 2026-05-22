//GEMINI [TODO] => Mettre les interfaces dans un module dédié


export interface IRouteParams {
    quainumber: string,
}




 export interface IWebSocketNotifs {
     type_msg:string,
     msg_txt:string,
     transport: string,
     um:string,
     quai : string,
     action: string,
     user:string,
     time:Date, 
     checkid : string,
     i_rfid:string
}

 export interface IChargementMsgValidation {
   quai : string, 
   quai_number:number
}


 export interface IChargementUmContext {
    context:string,
 
}
// GEMINI [TODO]  => Mettre les interfaces utilisées à la fois dans le component controller et dans les controller de vues dans un module dédié
export interface IChargementUmValidationPayload {
    context:string,
    quai: string,
    codum: string,
    msgid: string,      //TEST détection d'erreurs au niveau des modules typescript
    aenam: string,
    errdt: string,
    errzt: string,
    choice: boolean               // GEMINI [Check] => Vérifier s'il faut mettre un string ou un boolean
}

 export interface IChargementUmPayload {
    context:string,
    quai: string,
    codum: string,
}

 export interface IChargementUmGetPayload {
   
    quai: string,
 }



// Payload pour le scan d'une UM
export interface IChargementStartPayload {
    quai: string,
    quai_number:number,
    numtransport : string,
    matri : string,
    name1 : string

}

// Payload pour le scan d'une UM
export interface IMotifsNchGetPayload {
    quai: string,
    transport:string,
}


// Structure équivalente au ty_motnch ABAP
export interface IMotifNchStructure {
    codmot: string, // LENGTH 2
    libmot: string, // LENGTH 25
    // Ajoutez ici les propriétés de zpcf_cha_pstnch si elles doivent être poussées par le front
    numtra: string,
    numliv: string,
    pstliv : string,
    typum: string,
    numcde: string,
    pstcde: string,
    codssp: string,
    numssp: string,
    codart: string,
    nbumch: string,
    nbumac: string,
}

// Payload pour le scan d'une UM
export interface IMotifsNchPostPayload {
    quai1: string,
    quai_number : number,
    tknum:string,
    tMotifNocharg: IMotifNchStructure[],
}


// Payload pour le scan d'une UM
export interface IUmStockForMaterialPayload {
    material: string,
}






// Structure d'un objet Quai dans votre modèle JSON
// GEMINI [Questions ] Ou utiliser ces interfaces dans les vues ou dans les contrôlleurs?
export interface IQuaiData {
    quai: string,
    numtransport: string,
    zpcfName1: string,
    chargementEncours: boolean,
    umCharg: number,
    umNb: number,
    tPosteNocharge: IPosteRestant[],
}

export interface IPosteRestant {
    numliv: string,
    pstliv: string,
    codart: string,
    nbumch: number,
    nbumac: number,
}
