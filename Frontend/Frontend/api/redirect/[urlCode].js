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

    const data = await response.json();


    if (data.url) {
      res.redirect(301, data.url);
    } else {
      res.status(404).json({
        msg: "URL not found",
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      msg: "Server Error",
      response: error.message || "Unknown error",
    });
  }
}