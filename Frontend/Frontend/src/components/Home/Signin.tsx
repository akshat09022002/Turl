import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useSetRecoilState } from "recoil";
import { isSignedIn, rerender } from "@/store/atoms/atom";

function Signin({
  setSigninClose,
}: {
  setSigninClose: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setLoggedIn = useSetRecoilState(isSignedIn);
  const setrerenderValue= useSetRecoilState(rerender);

  const submitHandler = async () => {
    try {
      await axios
        .post<{
          msg: string;
          firstName: string;
          lastName: string | null;
          email: string;
        }>(
          `${import.meta.env.VITE_BACKEND_API}/user/login`,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          localStorage.setItem(
            "user",
            JSON.stringify({
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              email: response.data.email,
            })
          );
          toast({
            title: response.data.msg,
          });
          setSigninClose(false);
        });
    } catch (err: any) {
      toast({
        title: err.response.data.msg,
      });
    }finally{
      setrerenderValue((e)=>e+1);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="w-full h-full p-11 bg-[#3f2097] rounded-md">
      <form className="max-w-sm mx-auto w-full">
        <div className="mb-5 ">
          <label className="block mb-2 text-md font-medium text-[#c70074] ">
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
            placeholder="name@email.xyz"
            required
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-md font-medium text-[#c70074]">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="eg. abcd"
            id="password"
            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
            required
          />
        </div>
        <span className="flex flex-row justify-center w-full">
          {loading ? (
            <Spinner className="text-[#cc1b6c]" />
          ) : (
            <button
              onClick={async (e) => {
                setLoading(true);
                e.preventDefault();
                await submitHandler();
                setLoading(false);
                setLoggedIn(true);
              }}
              type="submit"
              className="w-2/3 text-white bg-[#c70074] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2"
            >
              Login
            </button>
          )}
        </span>
      </form>
    </div>
  );
}

export default Signin;
