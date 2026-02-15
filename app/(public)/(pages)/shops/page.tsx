import Container from "@/components/container/Container";
import Link from "next/link";

export default function Shops() {
  return (
    <Container>
      <main className="min-h-screen py-10">
        
        {/* Hero Section */}
        <section className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-4">
            Discover Trusted Local Shops Near You
          </h1>

          <p className="text-gray-600 mb-4">
            Our platform helps you find verified local businesses including 
            restaurants, grocery stores, salons, electronics shops, and more. 
            Explore shops in your city, compare options, and connect directly 
            with business owners.
          </p>

          <p className="text-gray-600 mb-6">
            We are currently onboarding shops and will be launching public 
            listings soon. Stay tuned as we bring you the most reliable local 
            business directory.
          </p>

          {/* CTA buttons */}
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/auth/register"
              className="bg-blue-500 text-white px-5 py-2 rounded-md font-medium hover:opacity-90 transition"
            >
              Register Your Shop
            </Link>

            <Link
              href="/about-us"
              className="border border-gray-300 px-5 py-2 rounded-md font-medium hover:bg-gray-50 transition"
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* Future listings placeholder */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-3">
            Upcoming Shop Listings
          </h2>

          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-gray-500">
            Shop listings will appear here once available. We are actively 
            onboarding businesses to provide you with the best local discovery 
            experience.
          </div>
        </section>

      </main>
    </Container>
  );
}