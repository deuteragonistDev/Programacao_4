import { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from "react-bootstrap";

function Search_bar({ onResult, onError, setLoading }) {
    const [searchTerm, setSearchTerm] = useState('');

    async function buscarPokemon(query) {
        setLoading(true);
        onError(""); // Limpa o erro anterior antes de uma nova busca

        const termoLimpo = query.trim().toLowerCase();

        try {
            if (termoLimpo === '') {
                // BUSCA INICIAL: Traz os 20 primeiros da lista
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20`);
                const data = await res.json();

                const listaDetalhada = await Promise.all(
                    data.results.map(async (poke) => {
                        const resp = await fetch(poke.url);
                        return resp.json();
                    })
                );
                onResult(listaDetalhada);
            } else {
                // BUSCA ESPECÍFICA: Só dispara com o nome exato ou ID
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${termoLimpo}`);
                if (!res.ok) throw new Error("Pokémon não encontrado! Verifique o nome ou ID.");

                const data = await res.json();
                onResult([data]);
            }
        } catch (error) {
            onError(error.message);
            onResult([]); // Apaga os cartões velhos da tela caso a nova busca falhe
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        buscarPokemon('');
    }, []);

    function handleChange(e) {
        setSearchTerm(e.target.value);
    }

    // Função que intercepta o 'Enter' de forma segura no formulário
    function handleSubmit(e) {
        e.preventDefault(); // Impede a página de recarregar
        buscarPokemon(searchTerm);
    }

    return (
        <div className="bg-dark rounded-3 p-4 border border-info shadow-sm text-center">

            <Form.Label className="text-info fs-5 mb-3">
                Banco de Dados da PokéAPI
            </Form.Label>

            {/* O formulário agora gerencia o Enter automaticamente com o onSubmit */}
            <Form onSubmit={handleSubmit} className="d-flex justify-content-center">
                <InputGroup style={{ maxWidth: '600px' }}>
                    <Form.Control
                        className="bg-black text-warning border-secondary"
                        placeholder="Digite o nome exato ou ID e aperte Enter..."
                        type="text"
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    <Button variant="outline-info" type="submit">
                        Escanear
                    </Button>
                </InputGroup>
            </Form>

        </div>
    );
}

export default Search_bar;