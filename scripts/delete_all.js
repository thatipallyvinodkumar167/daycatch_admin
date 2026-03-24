const baseUrl = 'http://localhost:5001/api/v1/collections';
const collections = [
  'order', 'orders', // just in case
  'store', 'stores',
  'product', 'products',
  'item_sale_report', 
  'item_requirement', 
  'tax'
];

async function deleteAll() {
  for (const coll of collections) {
    try {
      console.log(`Fetching ${coll}...`);
      const res = await fetch(`${baseUrl}/${coll}`);
      if (!res.ok) {
        console.log(`Skipping ${coll}: status ${res.status}`);
        continue;
      }
      const json = await res.json();
      const items = json.data || json.results || [];
      console.log(`Found ${items.length} items in ${coll}. Deleting...`);
      
      let deleted = 0;
      for (const item of items) {
        const id = item._id || item.id;
        if (!id) continue;
        const delRes = await fetch(`${baseUrl}/${coll}/${id}`, { method: 'DELETE' });
        if (delRes.ok) deleted++;
      }
      console.log(`Finished deleting ${deleted} items from ${coll}.`);
    } catch(e) {
      console.log(`Error processing ${coll}:`, e.message);
    }
  }
}

deleteAll();
