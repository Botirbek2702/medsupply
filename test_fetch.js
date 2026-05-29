const url = 'https://yylixmkvuzgyipgtkyci.supabase.co/rest/v1/products?select=*';
const key = 'sb_publishable_oNCAI5RvTHVjaG4oWrMQ2Q_HPBloLft';
fetch(url, {
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
}).then(r => r.json()).then(console.log).catch(console.error);
