-- Create table for storing district information
CREATE TABLE public.districts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state_code TEXT NOT NULL,
  state_name TEXT NOT NULL,
  district_code TEXT NOT NULL,
  district_name TEXT NOT NULL,
  district_name_hi TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(state_code, district_code)
);

-- Create table for storing MGNREGA performance data
CREATE TABLE public.mgnrega_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id UUID REFERENCES public.districts(id) ON DELETE CASCADE,
  state_code TEXT NOT NULL,
  district_code TEXT NOT NULL,
  financial_year TEXT NOT NULL,
  month TEXT NOT NULL,
  
  -- Performance metrics
  person_days_generated BIGINT,
  households_provided_employment BIGINT,
  women_persondays BIGINT,
  sc_persondays BIGINT,
  st_persondays BIGINT,
  
  -- Works data
  ongoing_works BIGINT,
  completed_works BIGINT,
  total_expenditure DECIMAL(15, 2),
  wage_expenditure DECIMAL(15, 2),
  material_expenditure DECIMAL(15, 2),
  
  -- Additional metrics
  average_wage_per_day DECIMAL(10, 2),
  total_budget DECIMAL(15, 2),
  budget_utilization_percentage DECIMAL(5, 2),
  
  -- Metadata
  data_source TEXT DEFAULT 'api',
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(state_code, district_code, financial_year, month)
);

-- Create table for API health monitoring
CREATE TABLE public.api_health_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_url TEXT NOT NULL,
  status_code INTEGER,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  response_time_ms INTEGER,
  checked_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables (public data, so allow read access)
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mgnrega_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_health_log ENABLE ROW LEVEL SECURITY;

-- Public read access policies (no auth required for reading public data)
CREATE POLICY "Allow public read access to districts"
  ON public.districts FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to performance data"
  ON public.mgnrega_performance FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to api health logs"
  ON public.api_health_log FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_mgnrega_performance_district ON public.mgnrega_performance(district_id);
CREATE INDEX idx_mgnrega_performance_date ON public.mgnrega_performance(financial_year, month);
CREATE INDEX idx_districts_codes ON public.districts(state_code, district_code);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for districts
CREATE TRIGGER update_districts_updated_at
  BEFORE UPDATE ON public.districts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert Maharashtra districts (major districts for demo)
INSERT INTO public.districts (state_code, state_name, district_code, district_name, district_name_hi) VALUES
('27', 'Maharashtra', '251', 'Ahmednagar', 'अहमदनगर'),
('27', 'Maharashtra', '252', 'Akola', 'अकोला'),
('27', 'Maharashtra', '253', 'Amravati', 'अमरावती'),
('27', 'Maharashtra', '254', 'Aurangabad', 'औरंगाबाद'),
('27', 'Maharashtra', '255', 'Beed', 'बीड'),
('27', 'Maharashtra', '256', 'Bhandara', 'भंडारा'),
('27', 'Maharashtra', '257', 'Buldhana', 'बुलढाणा'),
('27', 'Maharashtra', '258', 'Chandrapur', 'चंद्रपुर'),
('27', 'Maharashtra', '259', 'Dhule', 'धुळे'),
('27', 'Maharashtra', '260', 'Gadchiroli', 'गडचिरोली'),
('27', 'Maharashtra', '261', 'Gondia', 'गोंदिया'),
('27', 'Maharashtra', '262', 'Hingoli', 'हिंगोली'),
('27', 'Maharashtra', '263', 'Jalgaon', 'जळगाव'),
('27', 'Maharashtra', '264', 'Jalna', 'जालना'),
('27', 'Maharashtra', '265', 'Kolhapur', 'कोल्हापूर'),
('27', 'Maharashtra', '266', 'Latur', 'लातूर'),
('27', 'Maharashtra', '267', 'Mumbai City', 'मुंबई शहर'),
('27', 'Maharashtra', '268', 'Mumbai Suburban', 'मुंबई उपनगर'),
('27', 'Maharashtra', '269', 'Nagpur', 'नागपुर'),
('27', 'Maharashtra', '270', 'Nanded', 'नांदेड'),
('27', 'Maharashtra', '271', 'Nandurbar', 'नंदुरबार'),
('27', 'Maharashtra', '272', 'Nashik', 'नाशिक'),
('27', 'Maharashtra', '273', 'Osmanabad', 'उस्मानाबाद'),
('27', 'Maharashtra', '274', 'Palghar', 'पालघर'),
('27', 'Maharashtra', '275', 'Parbhani', 'परभणी'),
('27', 'Maharashtra', '276', 'Pune', 'पुणे'),
('27', 'Maharashtra', '277', 'Raigad', 'रायगड'),
('27', 'Maharashtra', '278', 'Ratnagiri', 'रत्नागिरी'),
('27', 'Maharashtra', '279', 'Sangli', 'सांगली'),
('27', 'Maharashtra', '280', 'Satara', 'सातारा'),
('27', 'Maharashtra', '281', 'Sindhudurg', 'सिंधुदुर्ग'),
('27', 'Maharashtra', '282', 'Solapur', 'सोलापूर'),
('27', 'Maharashtra', '283', 'Thane', 'ठाणे'),
('27', 'Maharashtra', '284', 'Wardha', 'वर्धा'),
('27', 'Maharashtra', '285', 'Washim', 'वाशिम'),
('27', 'Maharashtra', '286', 'Yavatmal', 'यवतमाळ');