// database.js
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function conectarBanco() {
    const db = await open({
        filename: './cyberpunk.db',
        driver: sqlite3.Database
    });

    // 1. Tabela de Usuários (Obrigatória para Autenticação JWT)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    `);

    // 2. Tabela de Conteúdos (Título, Texto, Imagem, Ordem + Categoria)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS conteudos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            texto TEXT NOT NULL,
            imagem TEXT NOT NULL,
            ordem_apresentacao INTEGER NOT NULL,
            categoria TEXT NOT NULL -- Nova coluna para separar 'personagem' de 'episodio'
        );
    `);

    return db;
}

module.exports = conectarBanco;