export const metadata = {
  title: 'My Painting Orders',
  description: 'View payment, processing and delivery updates for your painting orders.',
  robots: { index: false, follow: false },
  alternates: { canonical: "/my-orders" },
  openGraph: { title: 'My Painting Orders', description: 'View payment, processing and delivery updates for your painting orders.', type: "website" },
};

export default function SectionLayout({ children }) {
  return children;
}
