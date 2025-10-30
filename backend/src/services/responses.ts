import type z from "zod";

export function successResp(message:string,data?:any) {
    const resp:Record<string, unknown> = {
        success: true,
        message
    };

    if(data){
        resp.data = data;
    }

    return resp
}

export function errorResp(message:string,data?:any) {
    const resp:Record<string, unknown> = {
        success: false,
        message
    };

    if(data){
        resp.data = data;
    }

    return resp
}

export function validationErrorResp(error:z.ZodError){
    return errorResp('Validation Failure', error)
}