const { Pool } = require('pg');
require('dotenv').config();

const dbConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false 
      }
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    };

const pool = new Pool(dbConfig);

// Log para avisar se conectou
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro fatal ao conectar no Banco:', err.message);
  } else {
    console.log('📦 Banco de Dados conectado com sucesso!');
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};