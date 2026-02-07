
CREATE TABLE site_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_key TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL,
  content_value TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_key ON site_content(content_key);

INSERT INTO site_content (content_key, content_type, content_value) VALUES
('hero_title', 'text', 'Funilaria e pintura com padrão de acabamento que valoriza seu veículo.'),
('hero_subtitle', 'text', 'Nada de improviso. Nada de surpresas. Só resultado impecável.'),
('authority_title', 'text', 'Referência em funilaria e pintura automotiva em Santa Bárbara do Leste e região.'),
('authority_description', 'text', 'Especialistas em funilaria, pintura e embelezamento automotivo, utilizando processos modernos, materiais premium e um padrão rigoroso de acabamento.'),
('quote', 'text', 'Ambiente profissional, atendimento humano e cuidado extremo com cada detalhe. Seu carro não precisa apenas de reparo — ele merece valorização.'),
('gallery_title', 'text', 'Resultados que falam por si.'),
('gallery_subtitle', 'text', 'Veja a transformação dos nossos trabalhos'),
('final_cta_title', 'text', 'Seu carro merece um serviço à altura.'),
('final_cta_subtitle', 'text', 'Agende agora e surpreenda-se com o resultado.'),
('admin_password', 'secret', 'mila2024');
