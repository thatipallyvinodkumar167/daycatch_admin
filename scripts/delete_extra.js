const baseUrl = 'http://localhost:5001/api/v1/collections';
const usersUrl = 'http://localhost:5001/api/v1/users';

const collections = [
  'deliveryboy_incentives',
  'deliveryboyfeedback',
  'storefeedback',
  'Userfeedback'
];

async function deleteExtra() {
  // Delete from collections
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

  // Delete all users
  try {
    console.log(`Fetching users from ${usersUrl}...`);
    const res = await fetch(usersUrl);
    if (res.ok) {
      const json = await res.json();
      const users = json.data?.data || json.data?.results || json.results || json.data || [];
      if (users.length > 0) {
        console.log(`Found ${users.length} users. Deleting...`);
      }
      
      let deletedUsers = 0;
      for (const user of users) {
        const id = user._id || user.id;
        if (!id) continue;
        const delRes = await fetch(`${usersUrl}/${id}`, { method: 'DELETE' });
        if (delRes.ok) deletedUsers++;
      }
      if (deletedUsers > 0) {
        console.log(`Finished deleting ${deletedUsers} users.`);
      }
    }
  } catch(e) {
    console.log(`Error processing users:`, e.message);
  }
}

deleteExtra();
