-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price_per_day DECIMAL(10,2) NOT NULL,
  seats INTEGER NOT NULL DEFAULT 5,
  transmission TEXT NOT NULL DEFAULT 'Automatic',
  fuel_type TEXT NOT NULL DEFAULT 'Petrol',
  image_url TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT,
  total_price DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin profiles table (references auth.users)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Vehicles policies (public read, admin write)
CREATE POLICY "Anyone can view vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Admins can insert vehicles" ON vehicles FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can update vehicles" ON vehicles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete vehicles" ON vehicles FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Bookings policies (customers can create, admins can manage all)
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can update bookings" ON bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete bookings" ON bookings FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Admin profiles policies
CREATE POLICY "Admins can view their own profile" ON admin_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can update their own profile" ON admin_profiles FOR UPDATE USING (auth.uid() = id);
