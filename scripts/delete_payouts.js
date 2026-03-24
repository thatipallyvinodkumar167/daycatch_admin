const baseUrl = 'http://localhost:5001/api/v1/collections';

const collections = [
  'payouts',
  'payout requests',
  'Wallet_Rechage_History' // just in case
];

async function deletePayouts() {
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
      } else if (items.length === 0) {
        console.log(`No items found in ${coll}.`);
      }
    } catch(e) {
      console.log(`Error processing ${coll}:`, e.message);
    }
  }
}

deletePayouts();
