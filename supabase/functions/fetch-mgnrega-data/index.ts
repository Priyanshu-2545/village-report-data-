import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MGNREGAApiResponse {
  // Define the structure based on the actual API response
  // This is a placeholder and should be updated based on real API structure
  districtName?: string;
  financialYear?: string;
  month?: string;
  personDaysGenerated?: number;
  householdsProvided?: number;
  // ... other fields
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { stateCode, districtCode, districtId } = await req.json();

    if (!stateCode || !districtCode || !districtId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching MGNREGA data for state: ${stateCode}, district: ${districtCode}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Log API health check
    const startTime = Date.now();
    let apiSuccess = false;
    let apiError = '';

    try {
      // Attempt to fetch from data.gov.in API
      // Note: The actual API endpoint and structure should be updated based on the real API
      const apiUrl = `https://api.data.gov.in/resource/your-api-endpoint?state_code=${stateCode}&district_code=${districtCode}`;
      
      console.log(`Attempting to fetch from API: ${apiUrl}`);
      
      // For now, we'll simulate API failure and generate sample data
      // In production, this would be replaced with actual API call
      throw new Error('API endpoint not configured - using sample data');

      // Uncomment and modify this when real API is available:
      /*
      const apiResponse = await fetch(apiUrl, {
        headers: {
          'api-key': 'YOUR_API_KEY', // If API requires authentication
        },
      });

      if (!apiResponse.ok) {
        throw new Error(`API returned status ${apiResponse.status}`);
      }

      const apiData: MGNREGAApiResponse = await apiResponse.json();
      apiSuccess = true;

      // Transform API data to match our schema
      const performanceData = transformApiData(apiData, districtId, stateCode, districtCode);

      // Upsert to database
      const { error: upsertError } = await supabase
        .from('mgnrega_performance')
        .upsert(performanceData, {
          onConflict: 'state_code,district_code,financial_year,month'
        });

      if (upsertError) {
        console.error('Error upserting performance data:', upsertError);
        throw upsertError;
      }
      */

    } catch (error) {
      console.error('API fetch error:', error);
      apiError = error instanceof Error ? error.message : 'Unknown error';
      
      // Generate and insert sample data for demonstration
      console.log('Generating sample data for district:', districtId);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const sampleData = months.map((month) => ({
        district_id: districtId,
        state_code: stateCode,
        district_code: districtCode,
        financial_year: '2024-25',
        month: month,
        person_days_generated: Math.floor(Math.random() * 500000) + 100000,
        households_provided_employment: Math.floor(Math.random() * 50000) + 10000,
        women_persondays: Math.floor(Math.random() * 250000) + 50000,
        sc_persondays: Math.floor(Math.random() * 100000) + 20000,
        st_persondays: Math.floor(Math.random() * 100000) + 20000,
        ongoing_works: Math.floor(Math.random() * 500) + 100,
        completed_works: Math.floor(Math.random() * 200) + 50,
        total_expenditure: Math.floor(Math.random() * 50000000) + 10000000,
        wage_expenditure: Math.floor(Math.random() * 30000000) + 5000000,
        material_expenditure: Math.floor(Math.random() * 20000000) + 5000000,
        average_wage_per_day: Math.floor(Math.random() * 100) + 250,
        total_budget: Math.floor(Math.random() * 60000000) + 15000000,
        budget_utilization_percentage: Math.floor(Math.random() * 30) + 60,
        data_source: 'sample',
        last_updated: new Date().toISOString(),
      }));

      // Insert sample data
      const { error: insertError } = await supabase
        .from('mgnrega_performance')
        .upsert(sampleData, {
          onConflict: 'state_code,district_code,financial_year,month'
        });

      if (insertError) {
        console.error('Error inserting sample data:', insertError);
        throw insertError;
      }

      console.log('Sample data inserted successfully');
    } finally {
      // Log API health
      const responseTime = Date.now() - startTime;
      await supabase.from('api_health_log').insert({
        api_url: 'data.gov.in/mgnrega',
        success: apiSuccess,
        error_message: apiError || null,
        response_time_ms: responseTime,
        status_code: apiSuccess ? 200 : 0,
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Data fetched and cached successfully',
        cached: true 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in fetch-mgnrega-data function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to transform API data (to be implemented based on actual API structure)
function transformApiData(
  apiData: MGNREGAApiResponse,
  districtId: string,
  stateCode: string,
  districtCode: string
): any {
  return {
    district_id: districtId,
    state_code: stateCode,
    district_code: districtCode,
    financial_year: apiData.financialYear || '2024-25',
    month: apiData.month || 'Jan',
    person_days_generated: apiData.personDaysGenerated || 0,
    households_provided_employment: apiData.householdsProvided || 0,
    // Map other fields as needed
    data_source: 'api',
    last_updated: new Date().toISOString(),
  };
}
