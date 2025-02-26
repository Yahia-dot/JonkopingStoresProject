const {Client} = require('pg');

const client = new Client({
    host: 'database',
    port: 5432,
    user: 'admin',
    password: 'admin',
    database: 'postgres'
});

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to the database');
    } catch (err) {
        console.error('Failed to connect to the database', err);
    }
}

function createStoresTable() {
    const createTable = `
        CREATE TABLE IF NOT EXISTS stores (
            store_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            url VARCHAR(255),
            district VARCHAR(255),
            location VARCHAR(255) DEFAULT NULL
        );
    `;

    client.query(createTable, (err, res) => {
        if (err) {
            console.error('Error creating table', err);
        } else {
            console.log('Table created or already exists');
            
        }
    });
}

async function dropStoresTable() {
  try {
      await client.query('DROP TABLE IF EXISTS stores;');
      console.log('Stores table dropped successfully');
  } catch (err) {
      console.error('Error dropping stores table:', err);
  }
}
async function insertStoresData(storesData) {
    const insertQuery = `
      INSERT INTO stores (name, url, district, location)
      VALUES ($1, $2, $3, $4)
    `;
    
    try {
      for (let store of storesData) {
        await client.query(insertQuery, [
          store.name,
          store.url || null,
          store.district || null, // Handle null district
          store.location || null, // Handle null location
        ]);
      }
      console.log('Stores data inserted into the database');
    } catch (err) {
      console.error('Error inserting stores data', err);
    }
  }

async function clearStoresTable() {
    try {
        await client.query('TRUNCATE TABLE stores RESTART IDENTITY;');
        console.log('All rows deleted from stores table');
    } catch (err) {
        console.error('Error clearing stores table:', err);
    }
}


  

  async function getStores() {
    try {
      const result = await client.query('SELECT * FROM stores');
      //console.log('Query result:', result.rows); // Log the rows from the query
      return result.rows;
    } catch (err) {
      console.error('Error fetching stores:', err);
      throw new Error('Error fetching stores from the database');
    }
  }

async function add(name, url, district, location){
    try{
        const result = await client.query('INSERT INTO stores (name, url, district, location) VALUES ($1, $2, $3, $4) RETURNING *', 
          [name, url, district, location || null]);
          
        console.log('Store added:', result.rows[0]);
    } catch (err) {
        console.error('Error adding store:', err);
    }
}

async function deleteStore(id) {
    try {
        const result = await client.query('DELETE FROM stores WHERE store_id = $1 RETURNING *', [id]);
        console.log('Store deleted:', result.rows[0]);
    } catch (err) {
        console.error('Error deleting store:', err);
    }
}

// Fix the function
async function edite(id, name, url, district, location) {
  try {
      const result = await client.query(
          "UPDATE stores SET name = $2, url = $3, district = $4, location = $5 WHERE store_id = $1 RETURNING *", 
          [id, name, url, district, location]
      );

      if (result.rows.length > 0) {
          console.log("Store updated:", result.rows[0]);
          return result.rows[0]; // Return the updated store
      } else {
          console.error("No store found with the given ID.");
          return null;
      }
  } catch (err) {
      console.error("Error updating store:", err);
      throw err; // Throw error so it can be caught in the route
  }
}
module.exports = {dropStoresTable, connectDB, createStoresTable, insertStoresData, getStores, clearStoresTable, add, deleteStore, edite };