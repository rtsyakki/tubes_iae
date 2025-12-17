import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ServiceCard from '../components/ServiceCard';

const SERVICES = [
  {
    type: 'WASH',
    price: 5000,
    description: 'Basic washing service for your everyday clothes. Includes detergent and softener.',
    imageColor: 'bg-blue-200'
  },
  {
    type: 'DRY',
    price: 4000,
    description: 'Professional drying service to ensure your clothes are ready to wear.',
    imageColor: 'bg-orange-200'
  },
  {
    type: 'IRON',
    price: 3000,
    description: 'Steam ironing service for crisp, wrinkle-free clothes. Perfect for formal wear.',
    imageColor: 'bg-green-200'
  },
  {
    type: 'WASH_DRY',
    price: 9000,
    description: 'Complete wash and dry cycle. Save time and get fresh clothes fast.',
    imageColor: 'bg-purple-200'
  },
  {
    type: 'WASH_IRON',
    price: 8000,
    description: 'Wash and iron service. Get your clothes clean and pressed in one go.',
    imageColor: 'bg-yellow-200'
  },
  {
    type: 'FULL_SERVICE',
    price: 12000,
    description: 'The ultimate care package: Wash, Dry, Ironing, and folding/hanging included.',
    imageColor: 'bg-pink-300'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Main Content Padding for Fixed Navbar */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Search Section */}
        <section className="mb-12">
          <SearchBar />
        </section>

        {/* Services Heading */}
        <section>
          <div className="flex items-center gap-1 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Service Packages</h2>
            <span className="text-gray-500 text-2xl">›</span>
          </div>
          <p className="text-gray-500 mb-8 -mt-4">Professional laundry services tailored to your needs.</p>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.type}
                {...service}
              />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}