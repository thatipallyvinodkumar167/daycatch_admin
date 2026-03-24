const baseUrl = 'http://localhost:5001/api/v1/collections';
const collections = [
  'orders', 'day wise orders', 'complete orders', 'cancelled orders', 'pending orders', 
  'payment failed orders', 'out for delivery', 'ongoingorders', 'missed orders', 'Rejected orders',
  'storeList', 'storeProducts', 'products', 'tax_report', 'item_requirement', 'item_sale_report',
  'usercallbackrequests', 'storecallbackrequests', 'deliveryboycallbackrequests'
];

async function deleteAll() {
  for (const coll of collections) {
    try {
      console.log(`Fetching ${coll}...`);
      const res = await fetch(`${baseUrl}/${coll}`);
      if (!res.ok) {
        continue;
      }
      const json = await res.json();
      const items = json.data || json.results || [];
      if (items.length > 0) {
        console.log(`Found ${items.length} items in ${coll}. Deleting...`);
      }
      
      let deleted = 0;
      for (const item of items) {
        const id = item._id || item.id;
        if (!id) continue;
        const delRes = await fetch(`${baseUrl}/${coll}/${id}`, { method: 'DELETE' });
        if (delRes.ok) deleted++;
      }
      if (deleted > 0) {
        console.log(`Finished deleting ${deleted} items from ${coll}.`);
      }
    } catch(e) {
      console.log(`Error processing ${coll}:`, e.message);
    }
  }
}

deleteAll();
