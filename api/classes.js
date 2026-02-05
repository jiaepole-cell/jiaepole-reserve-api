import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const NOTION_TOKEN = process.env.NOTION_TOKEN;
    const DB_ID = process.env.NOTION_DB_ID;

    if (!NOTION_TOKEN || !DB_ID) {
      return res.status(500).json({
        error: "Missing NOTION_TOKEN or NOTION_DB_ID",
      });
    }

    const response = await fetch(
      `https://api.notion.com/v1/databases/${DB_ID}/query`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    const result = data.results.map((page) => {
      const props = page.properties;

      return {
        id: page.id,
        title: props?.이름?.title?.[0]?.plain_text ?? "",
        date: props?.날짜?.date?.start ?? null,
      };
    });

    return res.status(200).json(result);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
      detail: err.message,
    });
  }
}
