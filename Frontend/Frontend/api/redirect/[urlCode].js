import axios from "axios";

export default async function handler(req, res) {
    const { urlCode } = req.query;

    if (urlCode.startsWith("fe/") || urlCode.startsWith("pg/") || urlCode === "") {
        res.status(200).end(); // Let React handle it
        return;
    }
  
    // Fetch target URL from backend
    try {
      const response =await axios.get<{msg:string,url:string}>(`${import.meta.env.VITE_BACKEND_API}/redirect/${urlCode}`);
      if (response.data.url) {
        res.status(301).redirect(response.data.url); // Server-side redirect
      } else {
        res.status(404).json({
          msg:"URL not found",
          response: response.data
        }); // Or redirect to homepage
      }
    } catch (error) {
      res.status(500).json({
        msg:"Server Error",
        reponse: error,
        api: import.meta.env.VITE_BACKEND_API
      });
    }
  }