
CREATE TABLE public.destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  state TEXT,
  region TEXT,
  description TEXT,
  short_description TEXT,
  cover_image TEXT,
  images TEXT[],
  best_time_to_visit TEXT,
  weather TEXT,
  how_to_reach TEXT,
  highlights TEXT[],
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  duration_days INTEGER,
  duration_nights INTEGER,
  price_per_person NUMERIC,
  original_price NUMERIC,
  category TEXT,
  difficulty TEXT,
  max_group_size INTEGER,
  inclusions TEXT[],
  exclusions TEXT[],
  itinerary JSONB,
  images TEXT[],
  cover_image TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  badge TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  author TEXT DEFAULT 'TrailBuzz Team',
  category TEXT,
  tags TEXT[],
  read_time_minutes INTEGER,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  package_name TEXT,
  travel_date DATE,
  num_travelers INTEGER,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.page_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  session_id TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grants
GRANT SELECT ON public.destinations TO anon, authenticated;
GRANT ALL ON public.destinations TO service_role;
GRANT SELECT ON public.packages TO anon, authenticated;
GRANT ALL ON public.packages TO service_role;
GRANT SELECT ON public.blogs TO anon, authenticated;
GRANT ALL ON public.blogs TO service_role;
GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT ALL ON public.enquiries TO service_role;
GRANT INSERT ON public.page_visits TO anon, authenticated;
GRANT ALL ON public.page_visits TO service_role;

-- RLS
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active destinations" ON public.destinations
  FOR SELECT TO anon, authenticated USING (status = 'active');

CREATE POLICY "Public can view active packages" ON public.packages
  FOR SELECT TO anon, authenticated USING (status = 'active');

CREATE POLICY "Public can view published blogs" ON public.blogs
  FOR SELECT TO anon, authenticated USING (status = 'published');

CREATE POLICY "Anyone can submit enquiries" ON public.enquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can record page visits" ON public.page_visits
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE INDEX idx_packages_destination ON public.packages(destination_id);
CREATE INDEX idx_packages_featured ON public.packages(is_featured);
CREATE INDEX idx_enquiries_status ON public.enquiries(status);
CREATE INDEX idx_page_visits_visited ON public.page_visits(visited_at);
