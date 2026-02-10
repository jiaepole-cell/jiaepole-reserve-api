export default async function handler(req, res) {
  try {
    const NOTION_TOKEN = process.env.NOTION_TOKEN;
    const DB_ID = process.env.NOTION_DB_ID;

    if (!NOTION_TOKEN || !DB_ID) {
      return res.status(500).json({
        error: "ENV_MISSING",
        need: ["NOTION_TOKEN", "NOTION_DB_ID"],
      });
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();

    // 노션이 에러를 주면 그대로 보여주기 (디버그용)
    if (!response.ok) {
      return res.status(response.status).json({
        error: "NOTION_ERROR",
        status: response.status,
        detail: text,
      });
    }

    const data = JSON.parse(text);

    // 최소 가공
    const result = (data.results || []).map((page) => {
      const props = page.properties || {};
      return {
        id: page.id,
        title: props["이름"]?.title?.[0]?.plain_text ?? "",
        date: props["날짜"]?.date?.start ?? null,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR", message: String(err?.message || err) });
  }
}
