const baseUrl = 'http://localhost:5001/api/v1/collections/sub-admin';

async function deleteAllSubAdmins() {
  try {
    console.log('Fetching all sub-admins...');
    const res = await fetch(baseUrl);
    if (!res.ok) {
      console.log('Failed to fetch sub-admins:', res.status);
      return;
    }
    const json = await res.json();
    const items = json.data?.results || json.data || json.results || [];
    
    if (items.length === 0) {
      console.log('No sub-admins found in database.');
      return;
    }

    console.log(`Found ${items.length} sub-admin(s). Deleting...`);
    
    let deleted = 0;
    for (const item of items) {
      const id = item._id || item.id;
      if (!id) continue;
      const delRes = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
      if (delRes.ok) {
        console.log(`  ✓ Deleted: ${item.Email || item.Name || id}`);
        deleted++;
      } else {
        console.log(`  ✗ Failed to delete: ${item.Email || id}`);
      }
    }
    
    console.log(`\nDone! Deleted ${deleted} sub-admin(s).`);
    console.log('You can now register a fresh Super Admin at localhost:3000/register');
  } catch(e) {
    console.log('Error:', e.message);
  }
}

deleteAllSubAdmins();
