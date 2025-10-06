// This is a function used for server side rendering in vercel environment. This will not work in local environment.
// Use this route 'BACKEND_URL/redirect/:urlCode' for local development environment.

export default async function handler(req, res) {
  const { urlCode } = req.query;


  if (urlCode.startsWith("fe/") || urlCode.startsWith("pg/") || urlCode === "") {
    res.status(200).end();
    return;
  }

  const backendUrl = `https://be.turl.co.in/redirect/${urlCode}`;

  try {
    const response = await fetch(backendUrl);

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({
        msg: 'Server Error'
      });
    }
<<<<<<< HEAD

    const data = await response.json();


    if (data.url) {
      res.redirect(301, data.url);
    } else {
      res.status(404).json({
        msg: "URL not found",
      });
=======
  
    // Fetch target URL from backend
    try {
      const response = axios.get(`${import.meta.env.VITE_BACKEND_API}/redirect/${urlCode}`);
      if (response.data.url) {
        res.status(301).redirect(response.data.url); // Server-side redirect
      } else {
        res.status(404).send("URL not found"); // Or redirect to homepage
      }
    } catch (error) {
      res.status(500).send("Error fetching redirect");
>>>>>>> f15980bcde031a5d383568f03be6fa46bc229e17
    }
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      msg: "Server Error",
      response: error.message || "Unknown error",
    });
  }
}