export default async function handler(req, res) {
  const { urlCode } = req.query;

  console.log("Received urlCode:", urlCode);

  if (urlCode.startsWith("fe/") || urlCode.startsWith("pg/") || urlCode === "") {
    console.log("Skipping redirect for frontend route");
    res.status(200).end();
    return;
  }

  const backendUrl = `${process.env.BACKEND_API}/redirect/${urlCode}`;
  console.log("Fetching from:", backendUrl);

  try {
    const response = await fetch(backendUrl);
    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.log("Backend error:", errorData);
      return res.status(response.status).json({
        msg: `Backend error: ${response.status}`,
        response: errorData,
      });
    }

    const data = await response.json();
    console.log("Backend data:", data);

    if (data.url) {
      console.log("Redirecting to:", data.url);
      res.redirect(301, data.url);
    } else {
      res.status(404).json({
        msg: "URL not found",
        response: data,
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      msg: "Server Error",
      response: error.message || "Unknown error",
      api: process.env.BACKEND_API || "Not set",
    });
  }
}