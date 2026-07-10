// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conectarBanco = require('./database');
const authMiddleware = require('./auth');

const app = express();
const SECRET_KEY = "NIGHT_CITY_SECRET";

app.use(cors());
app.use(express.json());

let db;

async function iniciarServidor() {
    db = await conectarBanco();

    // Limpa registros anteriores para repovoar do zero sem chaves duplicadas
    await db.run("DELETE FROM conteudos");

    // REPOVOAMENTO AUTOMÁTICO COMPLETO (Injeta todos os seus textos originais no SQLite)
    await db.run(`
        INSERT INTO conteudos (titulo, texto, imagem, ordem_apresentacao)
        VALUES
            ('David Martinez', 'Protagonista da série, David era um estudante promissor que abandonou sua vida acadêmica para se tornar um edgerunner. Possui uma resistência física incomum para implantes cibernéticos e um forte desejo de cumprir os sonhos das pessoas que ama. Personalidade: Impulsivo, extremamente determinado e leal. Possui um complexo de salvador e sacrifica a própria humanidade tentando proteger e carregar os sonhos de seus entes queridos (primeiro sua mãe, depois Maine e finalmente Lucy). É corajoso, mas sua ingenuidade juvenil em relação às suas próprias limitações corporais se prova letal.', 'david_martinez.png', 1),

            ('Lucy Kushinada', 'Uma netrunner extremamente habilidosa e enigmática. Criada originalmente nas corporações como uma arma cibernética, ela fugiu em busca de liberdade. Seu maior e mais verdadeiro sonho é escapar de Night City e viver na Lua. Personalidade: Misteriosa, introvertida e desconfiada. Moldada por uma infância traumática nas instalações da Arasaka, ela é fria na superfície para proteger a si mesma. Contudo, ao longo da série, demonstra um amor profundo e protetor por David, tornando-se disposta a matar sem hesitação ou arriscar sua própria vida apenas para mantê-lo a salvo da corporação.', 'lucy_kushinada.png', 2),

            ('Maine', 'Veterano líder do esquadrão de mercenários e o primeiro mentor de David. Um homem de postura imponente e caráter protetor com sua equipe, mas que lentamente perde o controle mental devido ao abuso de suas modificações corporais pesadas. Personalidade: Líder carismático, endurecido pelas ruas e com forte senso de companheirismo. Ele é uma figura paterna agressiva e protetora. No entanto, sua teimosia e recusa em aceitar seus limites, somadas ao vício em poder através de cyberwares pesados, demonstram uma personalidade orgulhosa e relutante em demonstrar fraqueza.', 'maine.png', 3),

            ('Dorio', 'Veterana musculosa e braço-direito leal de Maine. Dorio atua como o pilar de apoio emocional e físico para o líder da gangue, sendo uma lutadora brutal de perto e respeitada por todos os membros. Personalidade: Apesar de sua aparência intimidadora e força bruta, Dorio tem um lado maternal e compassivo, especialmente com os membros mais novos como David. Sua lealdade a Maine é inabalável, o que a leva a ficar ao lado dele mesmo quando a ciberpsicose começa a consumi-lo, sacrificando-se por amor.', 'dorio.png', 4),

            ('Kiwi', 'Netrunner sênior do grupo e mentora de Lucy. Reservada, pragmática e desconfiada por natureza, ela ensina as regras duras de sobrevivência corporativa e não acredita na lealdade incondicional dentro da sombria Night City. Personalidade: Pragmática, cínica e oportunista. Ela acredita firmemente que em Night City não se deve confiar em ninguém e aplica esse lema em suas ações. Possui uma atitude sempre calma, fria e calculista, nunca deixando suas emoções atrapalharem seus objetivos de sobrevivência, mesmo que isso signifique a traição.', 'kiwi.png', 5),

            ('Rebecca', 'Uma solo armada de temperamento explosivo e caótico. Apesar de seu tamanho e aparência infantil, carrega arsenais gigantescos de fogo pesado. É uma amiga ferozmente leal a David e um membro indispensável durante combates. Personalidade: Explosiva, caótica, hiperativa e destemida. Apesar de seu comportamento sádico e frequentemente violento em combates, onde ela age como uma maníaca por armas, ela esconde um lado surpreendentemente vulnerável e carinhoso com os membros de sua equipe, especialmente em relação a David, a quem ela dedica lealdade cega e afeto incondicional.', 'rebecca.png', 6),

            ('Pilar', 'Irmão mais velho de Rebecca, é o especialista em tecnologia e artilharia do grupo de Maine. Distingue-se por seus braços cibernéticos absurdamente alongados, úteis tanto para manutenção de equipamentos quanto para manuseio de armamento pesado. Personalidade: Excêntrico, desbocado e provocador. Pilar possui um senso de humor vulgar e gosta de importunar os novatos. Apesar de sua atitude irritante e caótica na superfície, ele é um técnico brilhante que leva seu trabalho com armas e a segurança da sua irmã a sério.', 'pilar.png', 7),

            ('Falco', 'O piloto de fuga do grupo de mercenários. Caracterizado por seu visual clássico e atitude profissional, ele garante as fugas da equipe das situações de maior perigo. Um dos membros mais confiáveis durante as crises finais da gangue. Personalidade: Profissional, pé-no-chão e estoico. Ao contrário da maioria da equipe, Falco mantém uma postura mais equilibrada e menos propensa ao drama ou loucura cibernética. Ele é centrado, confiável e cumpre seu dever sem questionar as ordens de seu líder, assumindo o papel de um porto seguro sensato durante o caos final.', 'falco.png', 8)
    `);

    console.log("-> ✅ Banco de dados SQLite repovoado com TODOS os personagens!");

    app.listen(3000, () => console.log("-> Servidor Cyberpunk ativo na porta 3000"));
}

// ==================== ROTAS DE AUTENTICAÇÃO ====================
app.post('/api/registrar', async (req, res) => {
    const { username, password } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        await db.run("INSERT INTO usuarios (username, password) VALUES (?, ?)", [username, passwordHash]);
        res.status(201).json({ mensagem: "Usuário registrado!" });
    } catch (err) {
        res.status(400).json({ erro: "Usuário já existente." });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const usuario = await db.get("SELECT * FROM usuarios WHERE username = ?", [username]);
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
        return res.status(401).json({ erro: "Credenciais inválidas." });
    }
    const token = jwt.sign({ id: usuario.id, username: usuario.username }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ token });
});

// ==================== ROTA PÚBLICA DE CONTEÚDO ====================
app.get('/api/conteudos', async (req, res) => {
    const lista = await db.all("SELECT * FROM conteudos ORDER BY ordem_apresentacao ASC");
    res.json(lista);
});

// ==================== ROTAS PROTEGIDAS DE MANIPULAÇÃO ====================
app.post('/api/conteudos', authMiddleware, async (req, res) => {
    const { titulo, texto, imagem, ordem_apresentacao } = req.body;

    if (!titulo || !texto || !imagem || !ordem_apresentacao) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    }

    try {
        await db.run(
            "INSERT INTO conteudos (titulo, texto, imagem, ordem_apresentacao) VALUES (?, ?, ?, ?)",
            [titulo, texto, imagem, parseInt(ordem_apresentacao, 10)]
        );
        res.status(201).json({ mensagem: "Artigo publicado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao salvar conteúdo." });
    }
});

// ==================== ROTA DE ATUALIZAÇÃO (EDITAR) ====================
app.put('/api/conteudos/:id', authMiddleware, async (req, res) => {
    const { titulo, texto, imagem, ordem_apresentacao } = req.body;
    const { id } = req.params;

    try {
        await db.run(
            "UPDATE conteudos SET titulo = ?, texto = ?, imagem = ?, ordem_apresentacao = ? WHERE id = ?",
            [titulo, texto, imagem, parseInt(ordem_apresentacao, 10), id]
        );
        res.json({ mensagem: "Registro atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar conteúdo." });
    }
});

app.delete('/api/conteudos/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await db.run("DELETE FROM conteudos WHERE id = ?", [id]);
        if (resultado.changes === 0) {
            return res.status(404).json({ erro: "Artigo não encontrado." });
        }
        res.json({ mensagem: "Artigo removido da rede." });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao deletar do banco." });
    }
});

module.exports = app;
iniciarServidor();