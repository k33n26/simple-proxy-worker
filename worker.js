export default {
  async fetch(request) {
    const url = new URL(request.url)
    const target = url.searchParams.get("url")

    if (!target) {
      return new Response("url parametresi gerekli", { status: 400 })
    }

    // Header spoof
    const headers = new Headers()
    headers.set("User-Agent", "Mozilla/5.0")
    headers.set("Accept-Language", "en-US,en;q=0.9")

    const response = await fetch(target, {
      method: "GET",
      headers: headers,
      redirect: "follow"
    })

    const contentType = response.headers.get("content-type") || ""

    // m3u8 playlist düzenleme
    if (contentType.includes("mpegurl")) {
      let text = await response.text()

      text = text.replace(/https?:\/\/[^\n]+/g, (match) => {
        return request.url.split("?")[0] + "?url=" + encodeURIComponent(match)
      })

      return new Response(text, {
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*"
        }
      })
    }

    return new Response(response.body, {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    })
  }
}
// deploy test
