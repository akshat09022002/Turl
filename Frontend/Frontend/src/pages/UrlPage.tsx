import Navbar from "../components/Home/Navbar";
import DialogWindow from "@/components/Pages/DialogWindow";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import ProvidePassword from "@/components/Pages/ProvidePassword";
import UrlAdder from "@/components/UrlPage/UrlAdder";
import PageTablelist from "@/components/UrlPage/PageTableList";
import { useRecoilState, useRecoilValue } from "recoil";
import { isSignedIn, rerenderPage, urlsStateFamily } from "@/store/atoms/atom";

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

const UrlPage = () => {
  const { id } = useParams();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [customComponent, setCustomComponent] = useState<React.ReactNode>(null);
  const [urlPanel, setUrls] = useRecoilState(urlsStateFamily(id as string));
  const rerender = useRecoilValue(rerenderPage);
  const [isOwner, setIsOwner] = useState(false);
  const isLoggedIn = useRecoilValue(isSignedIn);

  const doesHavePassword = async () => {
    try {
      const response = await axios.get<{ msg: string; IsOwner: boolean }>(
        `${import.meta.env.VITE_BACKEND_API}/pages/hasPassword?id=${id}`,
        {
          withCredentials: true,
        }
      );

      setIsOwner(response.data.IsOwner);
      if (response.data.msg == "yes") return true;
      if (response.data.msg == "no") return false;
    } catch (err: any) {
      console.log(err);
      toast({
        title: "error",
        description: err.response.data.msg,
      });
    }
  };

  const handlePasswordCheck = async () => {
    const ans = await doesHavePassword();
    if (ans && urlPanel.password == "") {
      setDialogTitle("Password Verification");
      setCustomComponent(
        <ProvidePassword setOpen={setOpen} pageUID={id ? id : ""} />
      );
      setOpen(true);
    } else {
      console.log("here", urlPanel);
      try {
        await axios
          .post<{ msg: string; urls: urlType[] }>(
            `${import.meta.env.VITE_BACKEND_API}/pages/geturls`,
            {
              password: urlPanel.password,
              pageUID: id,
            },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            //Remove this toast in production
            toast({
              title: "Message",
              description: "Urls fetched successfully",
            });

            setUrls((e) => {
              console.log("old password", e);
              const newDetails = {
                urls: response.data.urls,
                password: e.password,
              };
              return newDetails;
            });
          });
      } catch (err: any) {
        console.log(err.response.data);
        toast({
          title: "Error",
          description: err.response.data.msg,
        });
      }
    }
  };

  useEffect(() => {
    handlePasswordCheck();
  }, [rerender, isLoggedIn]);

  return (
    <div className="absolute inset-0 -z-10 min-h-screen h-fit items-center pb-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <Navbar />
      <DialogWindow
        isOpen={isOpen}
        dialogTitle={dialogTitle}
        setIsOpen={setOpen}
      >
        {customComponent}
      </DialogWindow>
      {isOwner && <UrlAdder />}
      <PageTablelist pageId={id as string} isOwner={isOwner} />
    </div>
  );
};

export default UrlPage;
