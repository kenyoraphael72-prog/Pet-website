-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/eflfwlbgcslegevidscw/sql)

-- 1. Create the 'pets' table
CREATE TABLE IF NOT EXISTS public.pets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  breed text NOT NULL,
  gender text NOT NULL,
  age text NOT NULL,
  price numeric NOT NULL,
  status text DEFAULT 'AVAILABLE',
  image text,
  document_name text,
  lineage text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Create the 'orders' table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_name text NOT NULL,
  buyer_location text,
  pet_id uuid REFERENCES public.pets(id) ON DELETE CASCADE,
  payment_type text NOT NULL,
  balance numeric NOT NULL,
  logistics_status text DEFAULT 'Awaiting Balance',
  tracking_status text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. Create the 'essentials' table
CREATE TABLE IF NOT EXISTS public.essentials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  image text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS) for essentials
ALTER TABLE public.essentials ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for essentials
CREATE POLICY "Public can view essentials" ON public.essentials FOR SELECT USING (true);
CREATE POLICY "Public can insert essentials" ON public.essentials FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update essentials" ON public.essentials FOR UPDATE USING (true);
CREATE POLICY "Public can delete essentials" ON public.essentials FOR DELETE USING (true);

-- 6. Insert seed data for essentials
INSERT INTO public.essentials (name, price, image) VALUES 
('Premium Puppy Food', 85, 'https://images.unsplash.com/photo-1589924691995-400f9b719463?q=80&w=300&auto=format&fit=crop'),
('Luxury Orthopedic Bed', 150, 'https://images.unsplash.com/photo-1629957655460-66b9ddcb9eb7?q=80&w=300&auto=format&fit=crop'),
('Custom Leather Collar', 45, 'https://images.unsplash.com/photo-1601614728551-7f8fc99a5382?q=80&w=300&auto=format&fit=crop')
ON CONFLICT (id) DO NOTHING;
