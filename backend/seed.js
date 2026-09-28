const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@hotel.com',
    password: 'admin12345',
    isAdmin: true,
    phone: '+91 9876543210',
  },
  {
    name: 'Jane Doe',
    email: 'user@hotel.com',
    password: 'user12345',
    isAdmin: false,
    phone: '+91 9988776655',
  },
];

const hotelsData = [
  {
    name: 'The Taj Mahal Palace',
    type: 'hotel',
    city: 'Mumbai',
    address: 'Apollo Bandar, Colaba, Mumbai, Maharashtra 400001',
    distance: '0m from Gateway of India',
    images: [
      'https://images.unsplash.com/photo-1598977123418-45f04b016423?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'An architectural marvel on the waterfront of Colaba, Mumbai. Since 1903, this legendary palace hotel has hosted kings, presidents, and show business stars, delivering incomparable luxury overlooking the Arabian Sea.',
    featured: true,
    rating: 4.9,
    numReviews: 240,
  },
  {
    name: 'The Oberoi Udaivilas',
    type: 'resort',
    city: 'Udaipur',
    address: 'Badi-Gorela-Mulla Talai Rd, Udaipur, Rajasthan 313001',
    distance: '3.5km from center',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Located on the banks of Lake Pichola, this palace resort showcases the heritage of Mewar. Complete with rambling courtyards, rippling fountains, and reflection pools, it offers absolute luxury in the City of Lakes.',
    featured: true,
    rating: 5.0,
    numReviews: 185,
  },
  {
    name: 'Rambagh Palace',
    type: 'hotel',
    city: 'Jaipur',
    address: 'Bhawani Singh Rd, Jaipur, Rajasthan 302005',
    distance: '2.8km from center',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Known as the "Jewel of Jaipur", this former residence of the Maharaja of Jaipur features high-end rooms decorated with rich fabrics, royal carpets, and hand-painted wall motifs, surrounded by Mughal gardens.',
    featured: true,
    rating: 4.9,
    numReviews: 155,
  },
  {
    name: 'Taj Lake Palace',
    type: 'hotel',
    city: 'Udaipur',
    address: 'Pichola, Udaipur, Rajasthan 313001',
    distance: 'Floating on Lake Pichola',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'A gorgeous white marble palace floating in the middle of Lake Pichola. Accessible only by boat, it offers a magical royal experience with classic suites, private butler services, and panoramic lake views.',
    featured: true,
    rating: 4.8,
    numReviews: 130,
  },
  {
    name: 'The Leela Palace New Delhi',
    type: 'hotel',
    city: 'Delhi',
    address: 'Africa Ave, Chanakyapuri, New Delhi, Delhi 110023',
    distance: '1.5km from Diplomatic Enclave',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Located in Chanakyapuri, the diplomatic hub of New Delhi. It seamlessly blends grand Lutyens architecture with royal Indian heritage, boasting premium dining, a rooftop pool, and state-of-the-art security features.',
    featured: false,
    rating: 4.7,
    numReviews: 98,
  },
  {
    name: 'The Oberoi Amarvilas',
    type: 'hotel',
    city: 'Agra',
    address: 'Taj East Gate Rd, Agra, Uttar Pradesh 282001',
    distance: '600m from Taj Mahal',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Indulge in unmatched proximity to the symbol of love. Every room at The Oberoi Amarvilas offers direct, uninterrupted views of the Taj Mahal. Experience Mughal architectural elements and unparalleled service.',
    featured: true,
    rating: 4.9,
    numReviews: 210,
  },
  {
    name: 'Taj Falaknuma Palace',
    type: 'hotel',
    city: 'Hyderabad',
    address: 'Engine Bowli, Falaknuma, Hyderabad, Telangana 500053',
    distance: '5km from Charminar',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Pass through the royal gates on a horse-drawn carriage. Once home to the Nizam of Hyderabad, the richest man in the world, this restored palace features exquisite stained glass windows, Italian marble, and large library halls.',
    featured: true,
    rating: 5.0,
    numReviews: 140,
  },
  {
    name: 'Umaid Bhawan Palace',
    type: 'hotel',
    city: 'Jodhpur',
    address: 'Circuit House Rd, Cantt Area, Jodhpur, Rajasthan 342006',
    distance: '4km from Mehrangarh Fort',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'One of the largest private residences in the world. Built with yellow sandstone and boasting Art Deco interiors, Umaid Bhawan Palace offers guests a glimpse of royal Jodhpur heritage amidst 26 acres of lush gardens.',
    featured: false,
    rating: 4.8,
    numReviews: 112,
  },
  {
    name: 'Wildflower Hall An Oberoi Resort',
    type: 'resort',
    city: 'Shimla',
    address: 'Chharabra, Shimla, Himachal Pradesh 171012',
    distance: '13km from Ridge center',
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Situated 8,250 feet above sea level in the Himalayas. Former home of Lord Kitchener, this luxury resort features teak wood floors, marble fireplaces, and an open-air heated Jacuzzi looking out to snow-covered peaks.',
    featured: true,
    rating: 4.9,
    numReviews: 85,
  },
  {
    name: 'Taj Exotica Resort & Spa',
    type: 'resort',
    city: 'Goa',
    address: 'Calwaddo, Benaulim, Salcete, Goa 403716',
    distance: 'Direct beach access',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'A Mediterranean-style paradise spread over 56 acres along the Benaulim Beach. Featuring landscaped lawns, large outdoor pools, and private villa structures offering absolute serenity by the Arabian Sea.',
    featured: true,
    rating: 4.7,
    numReviews: 190,
  },
  {
    name: 'The Khyber Himalayan Resort',
    type: 'resort',
    city: 'Gulmarg',
    address: 'Hotel Khyber Rd, Forest Block, Gulmarg, Jammu and Kashmir 193403',
    distance: '300m from Gulmarg Gondola',
    images: [
      'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Nestled in the Pir Panjal range of the Himalayas. Built with locally sourced pinewood and slate tiles, this resort offers a cozy log-cabin experience complete with heated indoor pools and quick access to ski trails.',
    featured: true,
    rating: 4.8,
    numReviews: 76,
  },
  {
    name: 'Kumarakom Lake Resort',
    type: 'resort',
    city: 'Alleppey',
    address: 'Kottayam - Kumarakom Rd, Kumarakom, Kerala 686563',
    distance: 'On the banks of Vembanad Lake',
    images: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Recreated with 16th-century heritage villas transported from across Kerala. Complete with meandering swimming pools, heritage houseboats, and traditional Ayurvedic massage therapies in a lush setting.',
    featured: true,
    rating: 4.9,
    numReviews: 122,
  },
  {
    name: 'The Tamara Coorg',
    type: 'resort',
    city: 'Coorg',
    address: 'Kabbinakad Estate, Yevakapadi, Madikeri, Karnataka 571212',
    distance: '18km from Madikeri town',
    images: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'An elevated eco-resort nestled within coffee plantations. Standard rooms sit on stilts above valley tree canopies, featuring private decks to observe mist rolling over mountains and sounds of cascading waterfalls.',
    featured: false,
    rating: 4.6,
    numReviews: 64,
  },
  {
    name: 'Brijrama Palace Heritage Hotel',
    type: 'hotel',
    city: 'Varanasi',
    address: 'Darbhanga Ghat, Dashashwamedh, Varanasi, Uttar Pradesh 221001',
    distance: 'Right on Darbhanga Ghat',
    images: [
      'https://images.unsplash.com/photo-1561361060-0d52b978a3c5?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'One of the oldest structures on the Ganges. Accessible via boat ride, this stone castle hotel features traditional Maratha carvings, a historic lift elevator, and direct view spots for the Ganga Aarti.',
    featured: true,
    rating: 4.7,
    numReviews: 89,
  },
  {
    name: 'Brunton Boatyard',
    type: 'hotel',
    city: 'Kochi',
    address: '1/498, Calvathy Rd, Fort Kochi, Kochi, Kerala 682001',
    distance: 'On Fort Kochi Harbor',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Resurrected on the site of a 19th-century shipyard. It features high colonial ceilings, terracotta tile floors, antique punkah fans, and harbor-facing balconies to watch dolphins swim past Chinese fishing nets.',
    featured: false,
    rating: 4.5,
    numReviews: 54,
  },
  {
    name: 'The Oberoi Grand',
    type: 'hotel',
    city: 'Kolkata',
    address: '15, Jawaharlal Nehru Rd, Dharmatala, Kolkata, West Bengal 700013',
    distance: 'In central Kolkata market',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Affectionately known as the "Grand Dame of Chowringhee". Featuring a stunning neoclassical facade, grand colonnaded verandas, crystal chandeliers, and a peaceful palm-lined courtyard pool.',
    featured: false,
    rating: 4.8,
    numReviews: 104,
  },
  {
    name: 'Taj West End',
    type: 'hotel',
    city: 'Bengaluru',
    address: '25, Race Course Rd, High Grounds, Bengaluru, Karnataka 560001',
    distance: '1km from Vidhana Soudha',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Spread over 20 acres of heritage gardens, Taj West End is a green haven in the high-tech capital. Home to trees planted in 1848, it blends Victorian architecture with modern business features.',
    featured: false,
    rating: 4.7,
    numReviews: 115,
  },
  {
    name: 'Evolve Back Kabini',
    type: 'resort',
    city: 'Kabini',
    address: 'Bheeramballi, H D Kote Taluk, Kabini, Karnataka 571116',
    distance: 'On the edge of Nagarhole Park',
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Inspired by traditional Kadu Kuruba tribal villages. This luxury wildlife lodge overlooks the Kabini River, offering pool huts, safari expeditions into tiger reserves, and starry dinners on wooden decks.',
    featured: true,
    rating: 4.9,
    numReviews: 92,
  },
  {
    name: 'Taj Swarna',
    type: 'hotel',
    city: 'Amritsar',
    address: 'Plot No. 1, Outer Circular Road, Amritsar, Punjab 143001',
    distance: '4.5km from Golden Temple',
    images: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'A contemporary luxury sanctuary in the holy city. Features sleek modern interiors, a gourmet kitchen preparing traditional Punjabi meals, and premium rejuvenation treatment centers.',
    featured: false,
    rating: 4.6,
    numReviews: 68,
  },
  {
    name: 'The Lalit Grand Palace',
    type: 'hotel',
    city: 'Srinagar',
    address: 'Gupkar Rd, Srinagar, Jammu and Kashmir 190001',
    distance: 'On the banks of Dal Lake',
    images: [
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Built by Maharaja Pratap Singh in 1910. Lined by heritage chinar trees, this palace resort overlooks Dal Lake and features traditional Kashmiri woodwork carpets and sprawling orchard lawns.',
    featured: true,
    rating: 4.8,
    numReviews: 87,
  },
  {
    name: 'ITC Grand Chola',
    type: 'hotel',
    city: 'Chennai',
    address: '63, Mount Rd, Guindy, Chennai, Tamil Nadu 600032',
    distance: '3.5km from airport',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'A tribute to Chola dynasty architecture. This massive marble palace hotel in Chennai contains luxury residential apartments, premium suites, multiple pools, and extensive spa treatment rooms.',
    featured: false,
    rating: 4.7,
    numReviews: 160,
  },
];

// Room structures to populate for each hotel
const standardRoom = {
  title: 'Luxury Heritage Room',
  price: 240,
  maxPeople: 2,
  description: 'Exquisite room featuring classical architecture accents, queen size bedding, modern glass bathroom, and city views.',
  quantity: 5,
  amenities: ['Free Wi-Fi', 'Flat-screen TV', 'Mini Bar', 'Air Conditioning', 'Espresso Machine'],
  images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
};

const premiumSuite = {
  title: 'Presidential Royal Suite',
  price: 580,
  maxPeople: 4,
  description: 'Spacious palace suite offering a separate dining lounge, private balcony with views, king size bedding, and personal butler access.',
  quantity: 2,
  amenities: ['Balcony', 'Butler Service', 'Free Wi-Fi', '24/7 Room Service', 'Mini Bar', 'Bathrobe', 'Jacuzzi'],
  images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'],
};

const importData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGO_URI);

    // Delete existing records
    await User.deleteMany();
    await Hotel.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();

    console.log('Existing database entries cleared.');

    // Seed Users
    const createdUsers = await User.create(users);
    console.log(`Users Seeded: ${createdUsers.length}`);

    // Seed Hotels and Rooms
    for (let hData of hotelsData) {
      const hotel = new Hotel(hData);
      const savedHotel = await hotel.save();

      // Create two rooms for each hotel
      const room1 = new Room({
        ...standardRoom,
        hotel: savedHotel._id,
        price: Math.round((savedHotel.rating * 50) + (Math.random() * 50)), // Dynamic pricing
      });
      const savedRoom1 = await room1.save();

      const room2 = new Room({
        ...premiumSuite,
        hotel: savedHotel._id,
        price: Math.round((savedHotel.rating * 110) + (Math.random() * 100)), // Dynamic pricing
      });
      const savedRoom2 = await room2.save();

      // Update hotel with rooms array
      savedHotel.rooms = [savedRoom1._id, savedRoom2._id];
      await savedHotel.save();
    }

    console.log('Hotels and Rooms Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
