// api.test.js
const request = require('supertest');
const app = require('./server');

describe('🧪 Suíte de Testes da API Cyberpunk', () => {
    let tokenValido;
    const usuarioTeste = {
        username: `netrunner_${Date.now()}`,
        password: 'password123'
    };

    // CORREÇÃO: Aguarda o servidor assíncrono montar as rotas antes dos testes rodarem
    beforeAll(async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
    });

    it('Deve cadastrar um novo usuário com sucesso', async () => {
        const res = await request(app)
            .post('/api/registrar')
            .send(usuarioTeste);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Deve realizar login e receber um Token JWT válido', async () => {
        const res = await request(app)
            .post('/api/login')
            .send(usuarioTeste);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        tokenValido = res.body.token;
    });

    it('Deve negar o acesso à rota protegida se não enviar o token', async () => {
        const res = await request(app)
            .post('/api/conteudos')
            .send({
                titulo: 'Item Falho',
                texto: 'Teste',
                imagem: 'link',
                ordem_apresentacao: 9
            });

        expect(res.statusCode).toEqual(401);
    });
});