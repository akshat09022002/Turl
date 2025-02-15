import { atom } from "recoil";
import { atomFamily } from "recoil";

type urlType = {
  id: string;
  uid: string;
  pageId: string;
  description: string | null;
  userId: string | null;
  url: string;
  visitorCount: number;
  lastVisit: Date;
};

export const openDialogHome = atom({
  key: "openDialogHome",
  default: false,
});

export const isSignedIn= atom({
  key:"isSignedIn",
  default: false
})

export const rerender=atom({
  key:"rerender",
  default: 0
})

export const rerenderPage=atom({
  key:'rerenderPage',
  default: 0
})

export const urlsStateFamily= atomFamily<{
  urls: urlType[],
  password: string,
},string>({
  key:"urlsStateFamily",
  default:{
    urls: [],
    password: ""
  }
})
