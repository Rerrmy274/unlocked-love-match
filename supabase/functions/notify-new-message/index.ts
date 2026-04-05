import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const { record, table, type } = await req.json()

    if (table === 'messages' && type === 'INSERT') {
      const { match_id, sender_id, text } = record

      // Get the other user in the match
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('user1_id, user2_id')
        .eq('id', match_id)
        .single()

      if (matchError) throw matchError

      const receiver_id = match.user1_id === sender_id ? match.user2_id : match.user1_id

      // Send a notification (Placeholder for Push/In-app)
      console.log(`Sending notification to user ${receiver_id} for message from ${sender_id}: ${text}`)

      // Implementation: Call FCM or a custom notification table
      await supabase.from('notifications').insert({
        user_id: receiver_id,
        title: 'New Message',
        body: text,
        data: { match_id, sender_id }
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
})