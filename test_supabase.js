const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://yylixmkvuzgyipgtkyci.supabase.co', 'sb_publishable_oNCAI5RvTHVjaG4oWrMQ2Q_HPBloLft');

async function test() {
  const { data, error } = await supabase.from('products').select('*');
  console.log("Data:", data);
  console.log("Error:", error);
}
test();
