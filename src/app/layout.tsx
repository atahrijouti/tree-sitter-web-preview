export const metadata = {
  title: 'Tree-Sitter Web Preview',
  description: 'Preview your Tree-Sitter highlights right in the browser',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
