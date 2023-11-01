import type { Category, TransactionInDb } from './types';
import { generateFirestoreId } from './utils';

export const categories: Category[] = [
	'Food',
	'Transport',
	'Groceries',
	'Utility',
	'Retail',
	'Entertainment',
	'Health',
	'Finance',
	'Income',
	'Pets',
	'Education',
	'Travel',
	'Others',
].map((c) => {
	return {
		id: generateFirestoreId(),
		name: c,
	};
});

const getCategoryIdByName = (categoryName: string) => {
	return categories.find((c) => c.name.toLowerCase() === categoryName.toLowerCase())?.id ?? null;
};

export const generateRandomDate = () => {
	const currentDate = new Date();
	const pastDate = new Date();

	// Set the date 12 months ago from the current date
	pastDate.setMonth(currentDate.getMonth() - 12);

	// Generate a random number of milliseconds between now and 12 months ago
	const randomMilliseconds = Math.floor(
		Math.random() * (currentDate.getTime() - pastDate.getTime())
	);

	// Set the random date by adding the random milliseconds to the past date
	const randomDate = new Date(pastDate.getTime() + randomMilliseconds);

	return randomDate;
};

export const demoData: Omit<TransactionInDb, 'id' | 'date'>[] = [
	{
		description: 'Pepperoni Pizza',
		amount: -20,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Dominos',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Hoyts',
	},

	{
		description: 'Grocery Shopping',
		amount: -50,
		categoryId: getCategoryIdByName('Groceries'),
		payee: 'Fresh Mart',
	},

	{
		description: 'Online Shopping',
		amount: -75,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Amazon',
	},

	{
		description: 'Restaurant Dinner',
		amount: -40,
		categoryId: getCategoryIdByName('Food'),
		payee: 'The Bistro',
	},

	{
		description: 'Gym Membership',
		amount: -30,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Fitness World',
	},

	{
		description: 'Utility Bill',
		amount: -100,
		categoryId: getCategoryIdByName('Utility'),
		payee: 'XYZ Energy',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Cinema City',
	},

	{
		description: 'Gasoline',
		amount: -40,
		categoryId: getCategoryIdByName('Transport'),
		payee: 'Shell',
	},

	{
		description: 'Clothing Shopping',
		amount: -80,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Fashion Emporium',
	},

	{
		description: 'Internet Bill',
		amount: -60,
		categoryId: getCategoryIdByName('Utility'),
		payee: 'Broadband Co.',
	},

	{
		description: 'Concert Tickets',
		amount: -60,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Stadium Live',
	},

	{
		description: 'Pharmacy',
		amount: -15,
		categoryId: getCategoryIdByName('Health'),
		payee: 'Wellness Pharmacy',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Cinemax',
	},

	{
		description: 'Phone Bill',
		amount: -50,
		categoryId: getCategoryIdByName('Utility'),
		payee: 'Telecom Solutions',
	},

	{
		description: 'Car Repair',
		amount: -150,
		categoryId: getCategoryIdByName('Transport'),
		payee: 'Auto Service Center',
	},

	{
		description: 'Salary',
		amount: 3000,
		categoryId: getCategoryIdByName('Income'),
		payee: 'ABC Corporation',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Cineplex',
	},

	{
		description: 'Coffee Shop',
		amount: -10,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Java Junction',
	},

	{
		description: 'Travel Expenses',
		amount: -500,
		categoryId: getCategoryIdByName('Travel'),
		payee: 'Wanderlust Travel Agency',
	},

	{
		description: 'Mobile App Purchase',
		amount: -5,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'App Store',
	},

	{
		description: 'Insurance Premium',
		amount: -100,
		categoryId: getCategoryIdByName('Finance'),
		payee: 'Secure Life Insurance',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Film City',
	},

	{
		description: 'Cash Withdrawal',
		amount: -100,
		categoryId: getCategoryIdByName('Others'),
		payee: 'ATM',
	},

	{
		description: 'Home Decor',
		amount: -70,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Decor World',
	},

	{
		description: 'Bonus',
		amount: 500,
		categoryId: getCategoryIdByName('Income'),
		payee: 'XYZ Corporation',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Picture Palace',
	},

	{
		description: 'Charity Donation',
		amount: -50,
		categoryId: getCategoryIdByName('Others'),
		payee: 'Red Cross',
	},

	{
		description: 'Electronics Purchase',
		amount: -300,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Tech Universe',
	},

	{
		description: 'Internet Subscription',
		amount: -60,
		categoryId: getCategoryIdByName('Utility'),
		payee: 'Broadband Co.',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Star Cinema',
	},
	{
		description: 'Vintage Vinyl Record',
		amount: -25,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Music Emporium',
	},

	{
		description: 'Weekend Getaway',
		amount: -400,
		categoryId: getCategoryIdByName('Travel'),
		payee: 'Cozy Retreats',
	},

	{
		description: 'Art Supplies',
		amount: -50,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Creative Corner',
	},

	{
		description: 'Gourmet Coffee',
		amount: -6,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Bean Brews',
	},

	{
		description: 'Gardening Tools',
		amount: -35,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Green Thumb Depot',
	},

	{
		description: 'Mobile Phone Upgrade',
		amount: -300,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Gadget Hub',
	},

	{
		description: 'Language Course',
		amount: -200,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Lingua Academy',
	},

	{
		description: 'Concert Merchandise',
		amount: -40,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Music Fest Store',
	},

	{
		description: 'Pet Grooming',
		amount: -30,
		categoryId: getCategoryIdByName('Pets'),
		payee: 'Furry Friends Spa',
	},

	{
		description: 'Hobby Supplies',
		amount: -75,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Artisanal Crafts',
	},

	{
		description: 'Caribbean Cruise',
		amount: -1200,
		categoryId: getCategoryIdByName('Travel'),
		payee: 'Ocean Voyages',
	},

	{
		description: 'Home Theater System',
		amount: -500,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Tech Haven',
	},

	{
		description: 'Yoga Retreat',
		amount: -300,
		categoryId: getCategoryIdByName('Health'),
		payee: 'Serenity Yoga Center',
	},

	{
		description: 'Specialty Chocolates',
		amount: -15,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Sweet Delights',
	},

	{
		description: 'Home Office Equipment',
		amount: -200,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Office World',
	},

	{
		description: 'Cooking Class',
		amount: -80,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Culinary Institute',
	},

	{
		description: 'Adventure Park Tickets',
		amount: -60,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Thrill Seekers Park',
	},

	{
		description: 'Gourmet Dinner',
		amount: -100,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Fine Dining Bistro',
	},

	{
		description: 'Photography Workshop',
		amount: -150,
		categoryId: getCategoryIdByName('Education'),
		payee: 'CameraCraft Academy',
	},

	{
		description: 'Handcrafted Jewelry',
		amount: -70,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Artistic Gems',
	},

	{
		description: 'Sports Event Tickets',
		amount: -50,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Stadium Live',
	},

	{
		description: 'Luxury Spa Day',
		amount: -200,
		categoryId: getCategoryIdByName('Health'),
		payee: 'Blissful Retreat',
	},

	{
		description: 'Antique Collectibles',
		amount: -120,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Timeless Treasures',
	},

	{
		description: 'Wine Tasting Tour',
		amount: -40,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Vineyard Voyages',
	},

	{
		description: 'Art Exhibition Tickets',
		amount: -30,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Artistry Gallery',
	},

	{
		description: 'Cookware Set',
		amount: -90,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Culinary Essentials',
	},

	{
		description: 'Fitness Tracker',
		amount: -120,
		categoryId: getCategoryIdByName('Health'),
		payee: 'Active Gear',
	},

	{
		description: 'Charity Fundraiser',
		amount: -50,
		categoryId: getCategoryIdByName('Others'),
		payee: 'Helping Hands Foundation',
	},

	{
		description: 'Video Game Console',
		amount: -300,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Game Haven',
	},

	{
		description: 'Art Print',
		amount: -25,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Gallery Prints',
	},

	{
		description: 'Culinary Masterclass',
		amount: -180,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Taste Buds Academy',
	},

	{
		description: 'Scuba Diving Experience',
		amount: -200,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Ocean Explorers',
	},

	{
		description: 'Home Decor Workshop',
		amount: -60,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Decorate It Yourself',
	},

	{
		description: 'Concert Tickets',
		amount: -100,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Live Music Arena',
	},

	{
		description: 'Fitness Class Membership',
		amount: -80,
		categoryId: getCategoryIdByName('Health'),
		payee: 'FitLife Studio',
	},

	{
		description: 'Designer Handbag',
		amount: -250,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Fashion Elite',
	},

	{
		description: 'Ski Resort Pass',
		amount: -150,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Snowy Peaks',
	},

	{
		description: 'Cooking Ingredients',
		amount: -45,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Fresh Flavors',
	},

	{
		description: 'Home Theater Setup',
		amount: -800,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'AV Enthusiasts',
	},

	{
		description: 'Pottery Class',
		amount: -70,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Artistic Pots',
	},

	{
		description: 'Professional Photoshoot',
		amount: -180,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Capture Moments',
	},

	{
		description: 'Gourmet Desserts',
		amount: -20,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Sweet Indulgence',
	},

	{
		description: 'DIY Home Repair Tools',
		amount: -120,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'FixIt Depot',
	},

	{
		description: 'Fitness Apparel',
		amount: -50,
		categoryId: getCategoryIdByName('Health'),
		payee: 'Active Wearhouse',
	},

	{
		description: 'Theater Play Tickets',
		amount: -40,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Stage Spotlight',
	},

	{
		description: 'Bakery Treats',
		amount: -15,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Sweet Delicacies',
	},

	{
		description: 'Indoor Plants',
		amount: -35,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Green Oasis',
	},

	{
		description: 'Cooking Workshop',
		amount: -60,
		categoryId: getCategoryIdByName('Education'),
		payee: "Chef's Secrets",
	},

	{
		description: 'Music Festival Pass',
		amount: -200,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'MelodyFest',
	},

	{
		description: 'Eco-Friendly Products',
		amount: -50,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Green Living',
	},
	{
		description: 'Adventure Park Tickets',
		amount: -50,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Thrill Seekers Park',
	},

	{
		description: 'Gourmet Dinner',
		amount: -100,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Fine Dining Bistro',
	},

	{
		description: 'Photography Workshop',
		amount: -150,
		categoryId: getCategoryIdByName('Education'),
		payee: 'CameraCraft Academy',
	},

	{
		description: 'Handcrafted Jewelry',
		amount: -70,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Artistic Gems',
	},

	{
		description: 'Sports Event Tickets',
		amount: -50,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Stadium Live',
	},

	{
		description: 'Luxury Spa Day',
		amount: -200,
		categoryId: getCategoryIdByName('Health'),
		payee: 'Blissful Retreat',
	},

	{
		description: 'Antique Collectibles',
		amount: -120,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Timeless Treasures',
	},

	{
		description: 'Wine Tasting Tour',
		amount: -40,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Vineyard Voyages',
	},

	{
		description: 'Art Exhibition Tickets',
		amount: -30,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Artistry Gallery',
	},

	{
		description: 'Income',
		amount: 2000,
		categoryId: getCategoryIdByName('Income'),
		payee: 'Main Job',
	},

	{
		description: 'Cookware Set',
		amount: -90,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Culinary Essentials',
	},

	{
		description: 'Fitness Tracker',
		amount: -120,
		categoryId: getCategoryIdByName('Health'),
		payee: 'Active Gear',
	},

	{
		description: 'Charity Fundraiser',
		amount: -50,
		categoryId: getCategoryIdByName('Charity'),
		payee: 'Helping Hands Foundation',
	},

	{
		description: 'Video Game Console',
		amount: -300,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Game Haven',
	},

	{
		description: 'Art Print',
		amount: -25,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Gallery Prints',
	},

	{
		description: 'Culinary Masterclass',
		amount: -180,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Taste Buds Academy',
	},

	{
		description: 'Scuba Diving Experience',
		amount: -200,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Ocean Explorers',
	},

	{
		description: 'Home Decor Workshop',
		amount: -60,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Decorate It Yourself',
	},

	{
		description: 'Concert Tickets',
		amount: -100,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Live Music Arena',
	},

	{
		description: 'Income',
		amount: 3000,
		categoryId: getCategoryIdByName('Income'),
		payee: 'Side Gig',
	},

	{
		description: 'Fitness Class Membership',
		amount: -80,
		categoryId: getCategoryIdByName('Health'),
		payee: 'FitLife Studio',
	},

	{
		description: 'Designer Handbag',
		amount: -250,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Fashion Elite',
	},

	{
		description: 'Ski Resort Pass',
		amount: -150,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Snowy Peaks',
	},

	{
		description: 'Cooking Ingredients',
		amount: -45,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Fresh Flavors',
	},

	{
		description: 'Home Theater Setup',
		amount: -800,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'AV Enthusiasts',
	},

	{
		description: 'Pottery Class',
		amount: -70,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Artistic Pots',
	},

	{
		description: 'Professional Photoshoot',
		amount: -180,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Capture Moments',
	},

	{
		description: 'Gourmet Desserts',
		amount: -20,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Sweet Indulgence',
	},

	{
		description: 'DIY Home Repair Tools',
		amount: -120,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'FixIt Depot',
	},

	{
		description: 'Fitness Apparel',
		amount: -50,
		categoryId: getCategoryIdByName('Health'),
		payee: 'Active Wearhouse',
	},

	{
		description: 'Theater Play Tickets',
		amount: -40,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Stage Spotlight',
	},

	{
		description: 'Income',
		amount: 2500,
		categoryId: getCategoryIdByName('Income'),
		payee: 'Freelance Project',
	},

	{
		description: 'Bakery Treats',
		amount: -15,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Sweet Delicacies',
	},

	{
		description: 'Indoor Plants',
		amount: -35,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Green Oasis',
	},

	{
		description: 'Cooking Workshop',
		amount: -60,
		categoryId: getCategoryIdByName('Education'),
		payee: "Chef's Secrets",
	},

	{
		description: 'Music Festival Pass',
		amount: -200,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'MelodyFest',
	},

	{
		description: 'Income',
		amount: 2800,
		categoryId: getCategoryIdByName('Income'),
		payee: 'Part-Time Job',
	},

	{
		description: 'Eco-Friendly Products',
		amount: -50,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Green Living',
	},

	{
		description: 'Farmers Market Shopping',
		amount: -30,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Organic Harvest',
	},

	{
		description: 'Art Workshop',
		amount: -70,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Creative Studio',
	},

	{
		description: 'Income',
		amount: 3000,
		categoryId: getCategoryIdByName('Income'),
		payee: 'Consulting Project',
	},

	{
		description: 'Tech Gadgets',
		amount: -300,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Gadget Central',
	},

	{
		description: 'Spa Gift Voucher',
		amount: -100,
		categoryId: getCategoryIdByName('Health'),
		payee: 'Pamper Spa',
	},

	{
		description: 'Concert Merchandise',
		amount: -40,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Music Fest Store',
	},

	{
		description: 'Pet Grooming',
		amount: -30,
		categoryId: getCategoryIdByName('Pets'),
		payee: 'Furry Friends Spa',
	},

	{
		description: 'Hobby Supplies',
		amount: -75,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Artisanal Crafts',
	},

	{
		description: 'Caribbean Cruise',
		amount: -1200,
		categoryId: getCategoryIdByName('Travel'),
		payee: 'Ocean Voyages',
	},

	{
		description: 'Home Theater System',
		amount: -500,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Tech Haven',
	},

	{
		description: 'Yoga Retreat',
		amount: -300,
		categoryId: getCategoryIdByName('Health'),
		payee: 'Serenity Yoga Center',
	},

	{
		description: 'Language Course',
		amount: -200,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Lingua Academy',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Hoyts',
	},

	{
		description: 'Grocery Shopping',
		amount: -50,
		categoryId: getCategoryIdByName('Groceries'),
		payee: 'Fresh Mart',
	},

	{
		description: 'Online Shopping',
		amount: -75,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Amazon',
	},

	{
		description: 'Restaurant Dinner',
		amount: -40,
		categoryId: getCategoryIdByName('Food'),
		payee: 'The Bistro',
	},

	{
		description: 'Gym Membership',
		amount: -30,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Fitness World',
	},

	{
		description: 'Utility Bill',
		amount: -100,
		categoryId: getCategoryIdByName('Utility'),
		payee: 'XYZ Energy',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Cinema City',
	},

	{
		description: 'Gasoline',
		amount: -40,
		categoryId: getCategoryIdByName('Transport'),
		payee: 'Shell',
	},

	{
		description: 'Clothing Shopping',
		amount: -80,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Fashion Emporium',
	},

	{
		description: 'Internet Bill',
		amount: -60,
		categoryId: getCategoryIdByName('Utility'),
		payee: 'Broadband Co.',
	},

	{
		description: 'Concert Tickets',
		amount: -60,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Stadium Live',
	},

	{
		description: 'Pharmacy',
		amount: -15,
		categoryId: getCategoryIdByName('Health'),
		payee: 'Wellness Pharmacy',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Cinemax',
	},

	{
		description: 'Phone Bill',
		amount: -50,
		categoryId: getCategoryIdByName('Utility'),
		payee: 'Telecom Solutions',
	},

	{
		description: 'Car Repair',
		amount: -150,
		categoryId: getCategoryIdByName('Transport'),
		payee: 'Auto Service Center',
	},

	{
		description: 'Salary',
		amount: 3000,
		categoryId: getCategoryIdByName('Income'),
		payee: 'ABC Corporation',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Cineplex',
	},

	{
		description: 'Coffee Shop',
		amount: -10,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Java Junction',
	},

	{
		description: 'Travel Expenses',
		amount: -500,
		categoryId: getCategoryIdByName('Travel'),
		payee: 'Wanderlust Travel Agency',
	},

	{
		description: 'Mobile App Purchase',
		amount: -5,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'App Store',
	},

	{
		description: 'Insurance Premium',
		amount: -100,
		categoryId: getCategoryIdByName('Finance'),
		payee: 'Secure Life Insurance',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Film City',
	},

	{
		description: 'Cash Withdrawal',
		amount: -100,
		categoryId: getCategoryIdByName('Others'),
		payee: 'ATM',
	},

	{
		description: 'Home Decor',
		amount: -70,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Decor World',
	},

	{
		description: 'Bonus',
		amount: 500,
		categoryId: getCategoryIdByName('Income'),
		payee: 'XYZ Corporation',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Picture Palace',
	},

	{
		description: 'Charity Donation',
		amount: -50,
		categoryId: getCategoryIdByName('Others'),
		payee: 'Red Cross',
	},

	{
		description: 'Electronics Purchase',
		amount: -300,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Tech Universe',
	},

	{
		description: 'Internet Subscription',
		amount: -60,
		categoryId: getCategoryIdByName('Utility'),
		payee: 'Broadband Co.',
	},

	{
		description: 'Movie Tickets',
		amount: -20,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Star Cinema',
	},

	{
		description: 'Vintage Vinyl Record',
		amount: -25,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Music Emporium',
	},

	{
		description: 'Weekend Getaway',
		amount: -400,
		categoryId: getCategoryIdByName('Travel'),
		payee: 'Cozy Retreats',
	},

	{
		description: 'Art Supplies',
		amount: -50,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Creative Corner',
	},

	{
		description: 'Gourmet Coffee',
		amount: -6,
		categoryId: getCategoryIdByName('Food'),
		payee: 'Bean Brews',
	},

	{
		description: 'Gardening Tools',
		amount: -35,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Green Thumb Depot',
	},

	{
		description: 'Mobile Phone Upgrade',
		amount: -300,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Gadget Hub',
	},

	{
		description: 'Language Course',
		amount: -200,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Lingua Academy',
	},

	{
		description: 'Concert Merchandise',
		amount: -40,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Music Fest Store',
	},

	{
		description: 'Pet Grooming',
		amount: -30,
		categoryId: getCategoryIdByName('Pets'),
		payee: 'Furry Friends Spa',
	},

	{
		description: 'Hobby Supplies',
		amount: -75,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Artisanal Crafts',
	},

	{
		description: 'Caribbean Cruise',
		amount: -1200,
		categoryId: getCategoryIdByName('Travel'),
		payee: 'Ocean Voyages',
	},

	{
		description: 'Home Theater System',
		amount: -500,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Tech Haven',
	},

	{
		description: 'Yoga Retreat',
		amount: -300,
		categoryId: getCategoryIdByName('Health'),
		payee: 'Serenity Yoga Center',
	},

	{
		description: 'Language Course',
		amount: -200,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Lingua Academy',
	},

	{
		description: 'Charity Fundraiser',
		amount: -50,
		categoryId: getCategoryIdByName('Charity'),
		payee: 'Helping Hands Foundation',
	},

	{
		description: 'Video Game Console',
		amount: -300,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Game Haven',
	},

	{
		description: 'Art Print',
		amount: -25,
		categoryId: getCategoryIdByName('Retail'),
		payee: 'Gallery Prints',
	},

	{
		description: 'Culinary Masterclass',
		amount: -180,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Taste Buds Academy',
	},

	{
		description: 'Scuba Diving Experience',
		amount: -200,
		categoryId: getCategoryIdByName('Entertainment'),
		payee: 'Ocean Explorers',
	},

	{
		description: 'Home Decor Workshop',
		amount: -60,
		categoryId: getCategoryIdByName('Education'),
		payee: 'Decorate It Yourself',
	},
];
