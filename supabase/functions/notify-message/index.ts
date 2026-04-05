import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const { record } = await req.json()
  
  // Logic to handle notifications (e.g. push notification via FCM or OneSignal)
  // This is a placeholder for the notification logic
  
  console.log("New message received for match:", record.match_id)

  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { "Content-Type": "application/json" },
  })
})