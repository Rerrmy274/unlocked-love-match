-- Enable Realtime for the messages table
begin;
  -- remove the table from the publication
  alter publication supabase_realtime replica identity full;
  -- add the table to the publication
  alter publication supabase_realtime add table public.messages;
commit;