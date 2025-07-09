const { Client } = require('pg');
require('dotenv').config();

async function dropAllTables() {
  const client = new Client({
    user: 'postgres',
    password: '2005',
    host: 'localhost',
    port: 5432,
    database: 'GTSystem'
  });

  try {
    await client.connect();
    console.log('Conectado ao banco de dados');
    console.log('Iniciando limpeza radical do banco de dados...');

    // Desativar verificações de chave estrangeira temporariamente
    await client.query('SET session_replication_role = replica;');

    // Obter todas as tabelas do banco de dados (exceto as do schema pg_catalog e information_schema)
    const tablesResult = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    `);
    
    const tables = tablesResult.rows.map(row => row.tablename);
    
    if (tables.length === 0) {
      console.log('Não foram encontradas tabelas para remover.');
    } else {
      console.log(`Encontradas ${tables.length} tabelas para remover:`, tables);
      
      // Remover todas as tabelas encontradas
      for (const table of tables) {
        try {
          await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
          console.log(`Tabela ${table} removida com sucesso`);
        } catch (err) {
          console.log(`Erro ao remover tabela ${table}: ${err.message}`);
        }
      }
    }

    // Obter todas as sequências
    const sequencesResult = await client.query(`
      SELECT sequence_name FROM information_schema.sequences
      WHERE sequence_schema NOT IN ('pg_catalog', 'information_schema')
    `);
    
    const sequences = sequencesResult.rows.map(row => row.sequence_name);
    
    if (sequences.length > 0) {
      console.log(`Encontradas ${sequences.length} sequências para remover:`, sequences);
      
      // Remover todas as sequências
      for (const sequence of sequences) {
        try {
          await client.query(`DROP SEQUENCE IF EXISTS "${sequence}" CASCADE;`);
          console.log(`Sequência ${sequence} removida com sucesso`);
        } catch (err) {
          console.log(`Erro ao remover sequência ${sequence}: ${err.message}`);
        }
      }
    }

    // Obter todos os tipos personalizados (ENUMs)
    const typesResult = await client.query(`
      SELECT t.typname as name
      FROM pg_type t 
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      AND t.typtype = 'e'; -- 'e' para ENUM
    `);
    
    const types = typesResult.rows.map(row => row.name);
    
    if (types.length > 0) {
      console.log(`Encontrados ${types.length} tipos ENUM para remover:`, types);
      
      // Remover todos os tipos
      for (const type of types) {
        try {
          await client.query(`DROP TYPE IF EXISTS "${type}" CASCADE;`);
          console.log(`Tipo ENUM ${type} removido com sucesso`);
        } catch (err) {
          console.log(`Erro ao remover tipo ENUM ${type}: ${err.message}`);
        }
      }
    }

    // Reativar verificações de chave estrangeira
    await client.query('SET session_replication_role = DEFAULT;');

    console.log('Banco de dados completamente limpo! Todas as tabelas, sequências e tipos foram removidos.');
  } catch (err) {
    console.error('Erro ao limpar o banco de dados:', err);
  } finally {
    await client.end();
    console.log('Conexão com o banco de dados encerrada');
  }
}

dropAllTables(); 