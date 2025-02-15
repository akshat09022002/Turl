import { IoIosMenu } from "react-icons/io";
import { Button, Drawer, DrawerItems } from "flowbite-react";
import { useEffect, useState } from "react";
import type { CustomFlowbiteTheme } from "flowbite-react";
import { Avatar } from "flowbite-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isSignedIn, rerender } from "@/store/atoms/atom";
import DialogWindowHome from "./DialogWindowHome";
import Signin from "./Signin";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";

export function DrawerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useRecoilState(isSignedIn);
  const [userDetails, setUserDetails] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [customComponent, setCustomComponent] = useState<React.ReactNode>(null);
  const setrerenderValue=useSetRecoilState(rerender);
  const navigation=useNavigate();

  const handleClose = () => setIsOpen(false);

  const customTheme: CustomFlowbiteTheme["button"] = {
    color: {
      primary: "bg-none",
    },
  };

  useEffect(() => {
    const userDetail = localStorage.getItem("user");
    setUserDetails(userDetail ? JSON.parse(userDetail) : null);
  },[isLoggedIn]);

  return (
    <>
      <DialogWindowHome isOpen={isOpenDialog} setIsOpen={setIsOpenDialog}>
        {customComponent}
      </DialogWindowHome>
      <div className="flex items-center justify-center">
        <Button
          className=""
          theme={customTheme}
          color="primary"
          onClick={() => setIsOpen(true)}
        >
          <IoIosMenu className="text-4xl"></IoIosMenu>
        </Button>
      </div>

      <Drawer
        className="w-1/2 max-w-[400px] p-8 bg-black"
        open={isOpen}
        onClose={handleClose}
        position="right"
      >
       
        <Drawer.Items>
          {isLoggedIn ? (
            <div className="flex flex-col ">
              <div className="text-black scroll-mr-4">
                {" "}
                <Avatar rounded bordered size="lg" color="white" />
              </div>
              <div className="mt-4 text-lg text-white font-extrabold">
                {userDetails
                  ? userDetails.firstName + " " + userDetails.lastName
                  : ""}
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center w-full ">
              <button
                onClick={() => {
                  handleClose();
                  setIsOpenDialog(true);
                  setCustomComponent(
                    <Signin setSigninClose={setIsOpenDialog} />
                  );
                }}
                className="text-white bg-[#3f2097] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg sm:bottom-2.5 sm:text-sm px-4 mx-2 my-4 sm:mx-12 py-2 sm:py-4"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  handleClose();
                  setIsOpenDialog(true);
                  setCustomComponent(
                    <Signup setSignupClose={setIsOpenDialog} />
                  );
                }}
                className=" text-white bg-[#c70074] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg sm:bottom-2.5 sm:text-sm px-4 mx-2 sm:mx-12 py-2 sm:py-4 "
              >
                Sign up
              </button>{" "}
            </div>
          )}
        </Drawer.Items>
        <DrawerItems className="text-white font-bold mt-10 sm:mt-24">
          <ul className="text-start text-base sm:text-2xl sm:ml-4">
            <li className="py-4 sm:py-8">My URLs</li>
            {isLoggedIn ? (
              <>
                <li className="py-4 sm:py-8" onClick={()=>{
                  navigation('/pages')
                }}>My Pages</li>
                <li className="py-4 sm:py-8">Settings</li>
                <li
                  className="py-4 sm:py-8"
                  onClick={async () => {
                    try {
                      await axios
                        .get<{ msg: string }>(
                          `${import.meta.env.VITE_BACKEND_API}/user/logout`,
                          {
                            withCredentials: true,
                          }
                        )
                        .then((response) => {
                          setrerenderValue((e)=>e+1);
                          toast({
                            title: response.data.msg,
                          });
                          localStorage.setItem("user", "");
                          setLoggedIn(false);
                          handleClose();
                        });
                    } catch (err: any) {
                      toast({
                        title: err.response.data.msg,
                      });
                    }
                  }}
                >
                  Logout
                </li>{" "}
              </>
            ) : null}
          </ul>
        </DrawerItems>
        
      </Drawer>
    </>
  );
}
