import "./globals.css";

export const metadata = {
  title: "FeedPulse — Submit Feedback",
  description: "Share your feedback, bug reports, and feature requests with us.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
