import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import DialogWindowHome from "./DialogWindowHome";
import OtpInput from "./OtpInput";

function Signup({
  setSignupClose,
}: {
  setSignupClose: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [customComponent, setCustomComponent] = useState<React.ReactNode>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <DialogWindowHome isOpen={isOpenDialog} setIsOpen={setIsOpenDialog}>
        {customComponent}
      </DialogWindowHome>
      <div className="w-full h-full p-12 bg-[#cc1b6c] rounded-md">
        <form className="space-y-5">
          <div>
            <label className="block mb-2 text-md font-medium text-[#3e1f9c]">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-md font-medium text-[#3e1f9c]">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
              placeholder="Doe"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-md font-medium text-[#3e1f9c]">
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
              placeholder="name@email.xyz"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-md font-medium text-[#3e1f9c]">
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
              placeholder="eg. abcd"
              required
            />
          </div>
          <span className="flex flex-row justify-center w-full">
            {loading ? (
              <Spinner className="text-[#3e1f9c]" />
            ) : (
              <button
                onClick={async (e) => {
                  setLoading(true);
                  e.preventDefault();
                  try {
                    await axios
                      .post<{msg:string,firstName:string,lastName:string | null,email: string}>(
                        `${import.meta.env.VITE_BACKEND_API}/user/signup`,
                        {
                          firstName,
                          lastName,
                          email,
                          password,
                        },
                        {
                          withCredentials: true,
                        }
                      )
                      .then((response) => {
                        setLoading(false);
                        localStorage.setItem('user',JSON.stringify({
                          firstName:response.data.firstName,
                          lastName:response.data.lastName,
                          email:response.data.email
                        }))
                        toast({
                          title: response.data.msg,
                        });
                        setCustomComponent(
                          <OtpInput setIsOpenDialog={setIsOpenDialog} setSignupClose={setSignupClose}/>
                        );
                        setIsOpenDialog(true);
                      });
                  } catch (error: any) {
                    toast({
                      title: error.response.data.msg,
                    });
                    setLoading(false);
                  }
                }}
                className="w-2/3 align-center text-white bg-[#3e1f9c] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2"
              >
                Signup
              </button>
            )}
          </span>
        </form>
      </div>
    </>
  );
}

export default Signup;
