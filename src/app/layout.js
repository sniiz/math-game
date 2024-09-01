import "./globals.css";

export const metadata = {
  title: "math game",
  description: "math game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
