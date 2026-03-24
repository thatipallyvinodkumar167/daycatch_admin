const usersUrl = 'http://localhost:5001/api/v1/users';

async function deleteUsers() {
  // Delete all users
  try {
    console.log(`Fetching users from ${usersUrl}...`);
    const res = await fetch(usersUrl);
    if (res.ok) {
      const json = await res.json();
      console.log('User response:', Object.keys(json));
      
      let users = [];
      if (Array.isArray(json)) users = json;
      else if (json.data && Array.isArray(json.data.results)) users = json.data.results;
      else if (json.data && Array.isArray(json.data.data)) users = json.data.data;
      else if (Array.isArray(json.data)) users = json.data;
      else if (Array.isArray(json.results)) users = json.results;
      
      if (users.length > 0) {
        console.log(`Found ${users.length} users. Deleting...`);
      } else {
        console.log("No users found or couldn't parse array.", json);
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
    } else {
      console.log("Failed to fetch users", res.status);
    }
  } catch(e) {
    console.log(`Error processing users:`, e.message);
  }
}

deleteUsers();
