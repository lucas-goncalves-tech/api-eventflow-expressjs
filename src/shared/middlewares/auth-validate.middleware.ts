import type { NextFunction, Request, Response } from "express";
import { SID_HEADER } from "../constants/sid-header";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { verifyToken } from "../security/token.security";

export function authValidate(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies[SID_HEADER]
    const unauthorizedMessage = "Token inválido ou expirado";
    if(!token){
        throw new UnauthorizedError(unauthorizedMessage);
    }
    try{
        const payload = verifyToken(token);
        req.user = payload;
        next()
    }catch(err){
        throw new UnauthorizedError(unauthorizedMessage)
    }
}