export default async function handler(req, res) {
  try {
    const NOTION_TOKEN = process.env.NOTION_TOKEN;
    const DB_ID = process.env.NOTION_DB_ID;

    if (!NOTION_TOKEN || !DB_ID) {
      return res.status(500).json({
        error: "환경변수 누락",
        NOTION_TOKEN: !!NOTION_TOKEN,
        NOTION_DB_ID: !!DB_ID,
      });
    }

    const response = await fetch(
      `https://api.notion.com/v1/databases/${DB_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: "Notion API 오류",
        detail: text,
      });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      error: "서버 에러",
      message: err.message,
    });
  }
}
