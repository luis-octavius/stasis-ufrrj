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
  id: string;
  name: string;
  role: string; // e.g., "Coordenador", "Membro Pesquisador"
  imageUrl: string;
  bio?: string; // Optional short bio
}
