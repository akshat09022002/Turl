import axios from "axios";

export default async function handler(req, res) {
    const { urlCode } = req.query;

    if (urlCode.startsWith("fe/") || urlCode.startsWith("pg/") || urlCode === "") {
        res.status(200).end(); // Let React handle it
        return;
    }
  
    // Fetch target URL from backend
    try {
      const response =await axios.get<{msg:string,url:string}>(`${import.meta.env.VITE_BACKEND_API}/redirect/${urlCode}`,{
        withCredentials:true
      });
      if (response.data.url) {
        res.status(301).redirect(response.data.url); // Server-side redirect
      } else {
        res.status(404).send("URL not found"); // Or redirect to homepage
      }
    } catch (error) {
      res.status(500).send("Error fetching redirect");
    }
  }