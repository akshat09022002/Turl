import { atom } from "recoil";

export const signinpop= atom({
    key: "signinpop",
    default: false,
})

export const signuppop = atom({
    key: "signuppop",
    default: false,
})

export const urlResult = atom({
    key: "urlResult",
    default: "",
})