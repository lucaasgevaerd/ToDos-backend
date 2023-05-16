const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuração do banco de dados
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    port: 5432,
    password: 'root'
});

// Rota para obter todos os todos
app.get('/todos', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM todos');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao obter todos', error);
        res.status(500).json({ error: 'Erro ao obter todos' });
    }
});

// Rota para obter um produto pelo ID
app.get('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'ToDo não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao obter toDo', error);
        res.status(500).json({ error: 'Erro ao obter toDo' });
    }
});

// Rota para criar um novo todo
app.post('/todo', async (req, res) => {
    const { name } = req.body;
    try {
        const { rows } = await pool.query('INSERT INTO todos (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Erro ao criar todo', error);
        res.status(500).json({ error: 'Erro ao criar toDo' });
    }
});

// Rota para atualizar um produto
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const { rows } = await pool.query(
            'UPDATE todos SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'ToDo não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao atualizar todo', error);
        res.status(500).json({ error: 'Erro ao atualizar toDo' });
    }
});

// Rota para excluir um produto
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
        if (rowCount > 0) {
            res.sendStatus(204); // Resposta de sucesso sem conteúdo
        } else {
            res.status(404).json({ error: 'Todo não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao excluir todo', error);
        res.status(500).json({ error: 'Erro ao excluir todo' });
    }
});


// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});

