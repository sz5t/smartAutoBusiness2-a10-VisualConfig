import { SmtMessageSenderEnterResolver } from "../smt-relation/smt-relation-resolver";

export class SmtEventResolver {
    constructor(private _componentInstance: any) {
    }
    public resolve(eventArray) {
        // eventArray.forEach(event => {
        new SmtMessageSenderEnterResolver(this._componentInstance).resolve(eventArray)
        // });
    }
}