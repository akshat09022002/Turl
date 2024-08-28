import { IoIosMenu } from "react-icons/io";
import { Button, Drawer, DrawerItems } from "flowbite-react";
import { useState } from "react";
import type { CustomFlowbiteTheme } from "flowbite-react";
import { Avatar } from "flowbite-react";
import { CardSpotlight } from "./ui/card-spotlight";

export function DrawerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  const customTheme: CustomFlowbiteTheme["button"] = {
    color: {
      primary: "bg-none",
    },
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <Button
          className=""
          theme={customTheme}
          color="primary"
          onClick={() => setIsOpen(true)}
        >
          <IoIosMenu className="text-3xl"></IoIosMenu>
        </Button>
      </div>

      <Drawer
        className="w-1/2 max-w-[400px] p-0  overflow-hidden"
        open={isOpen}
        onClose={handleClose}
        position="right"
      >
        <CardSpotlight className="h-full w-full rounded-none  m-0">
          <Drawer.Items className="text-red-500 ">
            <div className="flex flex-col ">
              <div className="text-black scroll-mr-4">
                {" "}
                <Avatar rounded bordered size="lg" color="white" />
              </div>
              <div className="mt-4 text-lg text-white font-extrabold">John Doe</div>
            </div>
          </Drawer.Items>
          <DrawerItems className="text-white font-bold mt-10 sm:mt-24">
            <ul className=" text-start text-lg sm:text-2xl sm:ml-4">
              <li className="py-6 sm:py-8">Profile</li>
              <li className="py-6 sm:py-8">URLs</li>
              <li className="py-6 sm:py-8">My Pages</li>
              <li className="py-6 sm:py-8">Settings</li>
            </ul>
          </DrawerItems>
        </CardSpotlight>
      </Drawer>
    </>
  );
}
