export enum Permission {
    READ  =  0x0001,
    WRITE =  0x0002,
    GUARD =  0x0003,
}

export enum MessageTypeEnums {
    NONE      = 0x0000,
    REFUND    = 0x0001,
    BUSINESS  = 0x0002,
    COMPLAINT = 0x0003,
    FEEDBACK  = 0x0004,
    CONTACT   = 0x0005,
}
