import { Currency } from "@enums/currency.enum";

export type CreatePaymentType = {
    success:boolean,
    key:string|undefined,
    orderId:string,
    amount:number,
    currency:Currency
}
export type VerifyPaymentType = {
    message :string,
    success:boolean,
}
