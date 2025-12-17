const mongoose = require('mongoose');
const Store = require('./models/Store');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry_stores';

const SAMPLE_STORES = [
    {
        name: 'Clean & Fresh Laundry',
        description: 'We provide premium laundry services using modern machines and eco-friendly detergents. Your clothes are guaranteed clean, fragrant, and tidy.',
        address: 'Jl. Sukabirus No. 12, Dayeuhkolot',
        ownerId: 'owner_123',
        rating: 4.8,
        reviewCount: 124,
        images: [
            'https://images.unsplash.com/photo-1545173168-9f1947eebb8f?q=80&w=2071&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517677208171-0bc5e59b2604?q=80&w=2070&auto=format&fit=crop'
        ],
        services: [
            { type: 'WASH', price: 5000, label: 'Regular Wash' },
            { type: 'FULL_SERVICE', price: 12000, label: 'Complete Care' }
        ]
    },
    {
        name: 'Mama Laundry',
        description: 'Trusted mostly by students for affordable and quick service. Same day delivery available.',
        address: 'Jl. Adhyaksa No. 5',
        ownerId: 'owner_456',
        rating: 4.9,
        reviewCount: 89,
        images: [
            'https://images.unsplash.com/photo-1582735689369-4fe89db6304d?q=80&w=2070&auto=format&fit=crop'
        ],
        services: [
            { type: 'WASH_IRON', price: 8000, label: 'Wash & Iron' },
            { type: 'IRON', price: 3000, label: 'Iron Only' }
        ]
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await Store.deleteMany({});
        console.log('Cleared existing stores');

        await Store.insertMany(SAMPLE_STORES);
        console.log('✅ Seeded sample stores');

        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
