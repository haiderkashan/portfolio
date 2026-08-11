export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // Guards against a `</script>` (or similar) inside CMS content breaking
  // out of the script tag - standard safe-serialization practice for
  // dangerouslySetInnerHTML'd JSON.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
