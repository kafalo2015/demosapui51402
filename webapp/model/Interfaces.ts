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
     checkid : string
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
}

// Payload pour le scan d'une UM
export interface IMotifsNchGetPayload {
    quai: string,
    transport:string,
}


// Payload pour le scan d'une UM
export interface IMotifsNchPostPayload {
    quai: string,
    transport:string,
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
