export default async function handler(req, res) {
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DB_ID = process.env.NOTION_DB_ID;

  const response = await fetch(
    `https://api.notion.com/v1/databases/${DB_ID}/query`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      }
    }
  );

  const data = await response.json();
  const result = {};

  data.results.forEach(page => {
    const p = page.properties;
    if (!p.날짜?.date) return;

    const date = p.날짜.date.start;
    const time = `${p.시작.rich_text[0]?.plain_text}~${p.종료.rich_text[0]?.plain_text}`;

    if (!result[date]) result[date] = [];
    result[date].push({
      time,
      name: p.수업명.rich_text[0]?.plain_text,
      teacher: p.강사.rich_text[0]?.plain_text,
      cap: p.정원.number
    });
  });

  res.status(200).json(result);
}
