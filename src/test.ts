import { config } from 'dotenv';
import { Library } from './models/Library';

// Charger les variables d'environnement
config();

// Récupérer les variables d'environnement
const apiKey = process.env.ZOTERO_API_KEY;
const id = process.env.ZOTERO_GROUP_ID;
const type = `groups`

if (!apiKey || !id || !type) {
  throw new Error('ZOTERO_API_KEY, ZOTERO_ID, and ZOTERO_TYPE must be set in the .env file');
}

// Exemple d'utilisation
(async () => {
  const library = new Library(apiKey, id, type);
  await library.connect();

  console.log(`Connected to library: ${library.name}`);

  const collections = await library.getCollections();
  console.log(`Found ${collections.length} collections`);

  const items = await library.getAllItems();
  console.log(`Found ${items.length} items`);

  items.forEach(item => {
    console.log(`Item Key: ${item.key}`);
    console.log(`Title: ${item.title}`);
    console.log(`Item Type: ${item.itemType}`);
    console.log(`URL: ${item.url}`);
    console.log(`Date : ${item.date}`);
    console.log(`Abstract note: ${item.abstractNote}`);
    console.log(`Language: ${item.language}`);
    console.log(`tags: ${item.tags.map(tag => tag.tag).join(', ')}`);
    // item.delete(); // Suppression de l'élément    
  });
})();