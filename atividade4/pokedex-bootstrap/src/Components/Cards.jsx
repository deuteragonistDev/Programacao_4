import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function Card_pokemon({ pokemon }) {
    // Busca a arte oficial. Se não tiver (pokémons novos), usa o sprite pixelado padrão
    const imagem = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default;

    return (
        <Card className="bg-dark border-info text-white shadow" style={{ width: '14rem' }}>
            <div className="p-3 d-flex justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <Card.Img
                    variant="top"
                    src={imagem}
                    alt={pokemon.name}
                    style={{ height: '150px', objectFit: 'contain' }}
                />
            </div>
            <Card.Body className="text-center">
                <Card.Text className="text-secondary mb-1">Nº {pokemon.id}</Card.Text>
                <Card.Title className="text-capitalize text-warning fw-bold fs-4">{pokemon.name}</Card.Title>
                <div className="mt-3">
                    {/* Renderiza as tipagens do Pokémon dinamicamente */}
                    {pokemon.types.map((t, index) => (
                        <span key={index} className="badge bg-secondary me-1 text-uppercase border border-light">
                            {t.type.name}
                        </span>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
}

export default Card_pokemon;