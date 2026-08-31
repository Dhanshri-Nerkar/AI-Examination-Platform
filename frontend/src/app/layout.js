export const metadata = {
  title: "AI Examination Platform",
  description: "Online AI Examination Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f5f5f5",
        }}
      >
        {children}
      </body>
    </html>
  );
}