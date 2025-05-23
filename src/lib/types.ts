export interface Post {
  id: string;
  title: string;
  date: string; // ISO string format
  author: string;
  imageUrl: string;
  excerpt: string;
  content: string; // Full content, can be markdown or HTML string
  slug: string;
}

export interface Member {
  id: string; // ID do documento Firestore
  name: string; // Nome do integrante (Obrigatório)
  areaPesquisa?: string; // Área de pesquisa (Opcional)
  instituicao: string; // Instituição (Obrigatório)
  curriculoLattes?: string; // URL do Currículo Lattes (Opcional)
  imageUrl?: string; // URL da imagem do integrante (Opcional)
  // Campos role e bio removidos
}
