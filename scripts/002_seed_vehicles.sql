-- Seed vehicles with Unsplash images
INSERT INTO vehicles (name, category, description, price_per_day, seats, transmission, fuel_type, image_url, featured, available) VALUES
(
  'Toyota Fortuner',
  'SUV',
  'Powerful and spacious SUV perfect for family trips and off-road adventures. Features modern safety systems and premium comfort.',
  1500.00,
  7,
  'Automatic',
  'Diesel',
  'https://images.unsplash.com/photo-1625231334168-31be2f25da78?w=800&h=600&fit=crop',
  true,
  true
),
(
  'Toyota Hilux Double Cab',
  'Pickup',
  'Reliable and rugged pickup truck ideal for both work and leisure. Spacious cabin with excellent towing capacity.',
  1200.00,
  5,
  'Manual',
  'Diesel',
  'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&h=600&fit=crop',
  true,
  true
),
(
  'Toyota Corolla',
  'Sedan',
  'Efficient and comfortable sedan perfect for city driving and business trips. Excellent fuel economy.',
  800.00,
  5,
  'Automatic',
  'Petrol',
  'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&h=600&fit=crop',
  true,
  true
),
(
  'Toyota Quantum',
  'Minibus',
  'Spacious minibus ideal for group travel and airport transfers. Comfortable seating for up to 14 passengers.',
  2000.00,
  14,
  'Manual',
  'Diesel',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
  true,
  true
),
(
  'Toyota Land Cruiser',
  'Luxury SUV',
  'Premium luxury SUV with exceptional off-road capability. Perfect for executive travel and safari adventures.',
  2500.00,
  7,
  'Automatic',
  'Diesel',
  'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800&h=600&fit=crop',
  true,
  true
),
(
  'Toyota RAV4',
  'SUV',
  'Compact SUV with great fuel efficiency and modern features. Ideal for urban adventures.',
  1100.00,
  5,
  'Automatic',
  'Petrol',
  'https://images.unsplash.com/photo-1568844293986-8c1a30b22e9d?w=800&h=600&fit=crop',
  false,
  true
),
(
  'Toyota Camry',
  'Sedan',
  'Executive sedan with premium comfort and advanced technology. Perfect for business professionals.',
  1000.00,
  5,
  'Automatic',
  'Petrol',
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
  false,
  true
),
(
  'Toyota Hiace',
  'Van',
  'Versatile van suitable for cargo or passenger transport. Reliable workhorse for any business.',
  1800.00,
  12,
  'Manual',
  'Diesel',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
  false,
  true
);
