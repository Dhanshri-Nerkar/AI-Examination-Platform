import "./globals.css";

export const metadata = {
  title: "AI Examination Platform",
  description: "AI-powered examination platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 