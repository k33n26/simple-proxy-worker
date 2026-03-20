export default {
  async fetch(request) {
    const url = new URL(request.url)
    const target = url.searchParams.get("url")

    if (!target) {
      return new Response("URL gerekli", { status: 400 })
    }

    const res = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    })

    const contentType = res.headers.get("content-type") || ""

    // m3u8 playlist düzenle
    if (contentType.includes("mpegurl")) {
      let text = await res.text()

      text = text.replace(/https?:\/\/[^\s]+/g, (match) => {
        return request.url.split("?")[0] + "?url=" + encodeURIComponent(match)
      })

      return new Response(text, {
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*"
        }
      })
    }

    // normal response (video segment dahil)
    return new Response(res.body, {
      status: res.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*"
      }
    })
  }
}
