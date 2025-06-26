const parseRSS = (rssXml) => {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(rssXml)) !== null) {
    const itemContent = match[1];

    const titleMatch = itemContent.match(
      /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title>([\s\S]*?)<\/title>/
    );
    const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const descMatch = itemContent.match(
      /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/
    );

    items.push({
      title: (titleMatch?.[1] || titleMatch?.[2] || "").trim(),
      link: (linkMatch?.[1] || "").trim(),
      pubDate: (pubDateMatch?.[1] || "").trim(),
      description: (descMatch?.[1] || descMatch?.[2] || "").trim(),
    });
  }

  return items;
};

// merged feeds from previous node
const feeds = $input.all();
const allItems = [];

for (const feed of feeds) {
  const rawXml = feed.json.body;
  const parsed = parseRSS(rawXml);
  allItems.push(...parsed);
}
console.log(allItems);
// output one item per news article
return allItems.map((item) => ({ json: item }));

// return { json: { items: feedItems } };

