import type { Post, Member } from './types';

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'A Natureza da Stásis em Heráclito',
    slug: 'stasis-heraclito',
    date: '2024-07-15T10:00:00Z',
    author: 'Dr. Parmênides Silva',
    imageUrl: 'https://picsum.photos/seed/heraclito/800/400',
    excerpt: 'Uma análise profunda sobre o conceito de stásis (conflito, imobilidade) nos fragmentos de Heráclito e sua relevância para a ontologia pré-socrática.',
    content: `<p>Este ensaio explora a complexa noção de <strong>stásis</strong> em Heráclito de Éfeso. Tradicionalmente compreendida como conflito ou guerra (<em>polemos</em>), a stásis também pode implicar uma forma de imobilidade ou equilíbrio tenso, um contraponto dinâmico ao fluxo constante (<em>panta rhei</em>) que caracteriza o pensamento heracliteano.</p><p>Analisaremos os fragmentos DK B53, DK B80, entre outros, para desvendar as múltiplas camadas de significado que Heráclito atribui a este conceito fundamental. A stásis, longe de ser uma mera ausência de movimento, revela-se como uma força constitutiva do cosmos, intrinsecamente ligada ao Logos.</p><p>Exploraremos também como a stásis heracliteana se diferencia de concepções posteriores, como a stásis política em Tucídides, e sua influência em filósofos subsequentes que lidaram com a problemática da mudança e da permanência.</p><img src="https://picsum.photos/seed/manuscritoAntigo/600/300" alt="Manuscrito grego antigo" data-ai-hint="manuscript philosophy" class="my-4 rounded-md shadow-md" /> <p>Concluímos que a stásis em Heráclito não é apenas discórdia, mas uma harmonia oculta que sustenta a ordem do universo, um princípio vital para a compreensão de sua filosofia.</p>`,
  },
  {
    id: '2',
    title: 'Evento: Palestra sobre Ética Aristotélica',
    slug: 'evento-etica-aristotelica',
    date: '2024-07-20T14:30:00Z',
    author: 'Grupo Stásis',
    imageUrl: 'https://picsum.photos/seed/aristotelesEvento/800/400',
    excerpt: 'Convidamos a todos para a palestra "A Eudaimonia na Ética a Nicômaco de Aristóteles", que ocorrerá no próximo dia 10 de Agosto. Aberto ao público.',
    content: `<p>O Grupo de Estudos em Filosofia Stásis tem o prazer de convidar toda a comunidade acadêmica e o público interessado para a palestra intitulada <strong>"A Eudaimonia na Ética a Nicômaco de Aristóteles"</strong>.</p><p><strong>Palestrante:</strong> Profa. Dra. Sofia Oliveira (Especialista em Filosofia Antiga)</p><p><strong>Data:</strong> 10 de Agosto de 2024</p><p><strong>Horário:</strong> 16:00</p><p><strong>Local:</strong> Auditório Central, UFRRJ</p><p>A palestra abordará o conceito central de eudaimonia (felicidade, florescimento humano) na obra magna de Aristóteles, discutindo sua definição, os meios para alcançá-la e sua relevância para os debates éticos contemporâneos. Haverá espaço para perguntas e discussão após a apresentação.</p><img src="https://picsum.photos/seed/estatuaAristoteles/600/300" alt="Estátua de Aristóteles" data-ai-hint="statue philosopher" class="my-4 rounded-md shadow-md" /> <p>Entrada franca. Certificados serão emitidos para os participantes.</p>`,
  },
  {
    id: '3',
    title: 'Reflexões sobre o Tempo em Santo Agostinho',
    slug: 'tempo-agostinho',
    date: '2024-07-25T09:00:00Z',
    author: 'Ana Beatriz Costa',
    imageUrl: 'https://picsum.photos/seed/agostinhoTempo/800/400',
    excerpt: 'Uma breve meditação sobre a concepção agostiniana do tempo, como apresentada no Livro XI das Confissões. O que é, afinal, o tempo?',
    content: `<p>No Livro XI de suas <em>Confissões</em>, Santo Agostinho mergulha em uma das mais profundas e instigantes reflexões sobre a natureza do tempo na história da filosofia. "O que é, pois, o tempo? Se ninguém mo pergunta, sei; mas, se o quero explicar a quem me pergunta, não sei." Esta famosa citação encapsula a dificuldade paradoxal de definir algo tão fundamental à nossa existência.</p><p>Agostinho argumenta que o passado já não é, o futuro ainda não é, e o presente, se fosse sempre presente e não passasse para o pretérito, não seria tempo, mas eternidade. Ele propõe que o tempo é uma "distensão da alma" (<em>distentio animi</em>), onde o presente da memória se refere ao passado, o presente da intuição direta ao presente, e o presente da expectativa ao futuro.</p><img src="https://picsum.photos/seed/ampulheta/600/300" alt="Ampulheta simbolizando o tempo" data-ai-hint="hourglass time" class="my-4 rounded-md shadow-md" /><p>Este post visa revisitar essas ideias, explorando como a subjetividade do tempo em Agostinho contrasta com as concepções objetivas e cosmológicas da antiguidade clássica, e como sua análise continua a ressoar nos debates contemporâneos sobre a temporalidade.</p><p>Convidamos os leitores a compartilhar suas próprias reflexões sobre esta questão perene.</p>`,
  },
  {
    id: '4',
    title: 'A Dialética do Senhor e do Escravo em Hegel',
    slug: 'dialetica-hegel',
    date: '2024-08-01T11:00:00Z',
    author: 'Carlos Eduardo Lima',
    imageUrl: 'https://picsum.photos/seed/hegelDialetica/800/400',
    excerpt: 'Explorando uma das passagens mais cruciais da Fenomenologia do Espírito de Hegel: a luta por reconhecimento e a formação da autoconsciência.',
    content: `<p>A dialética do senhor e do escravo, apresentada por G.W.F. Hegel em sua <em>Fenomenologia do Espírito</em>, é um momento seminal na filosofia moderna, abordando a formação da autoconsciência através da interação e do conflito com o Outro. Este texto visa elucidar os principais aspectos dessa complexa passagem.</p><p>Hegel descreve uma luta de vida ou morte entre duas consciências, cada uma buscando o reconhecimento da outra como autoconsciente. Aquele que teme a morte mais do que a liberdade submete-se, tornando-se o escravo, enquanto o outro, que arrisca a vida, torna-se o senhor. No entanto, essa relação é instável e dialética.</p><p>O senhor, inicialmente, parece ter alcançado o reconhecimento, mas o reconhecimento vindo de um escravo (uma consciência não independente) é inadequado. O escravo, por outro lado, através do trabalho e da transformação da natureza, começa a desenvolver uma consciência de si e de seu poder formativo. É através do medo da morte e do serviço ao senhor que o escravo, paradoxalmente, alcança uma forma mais rica de autoconsciência.</p><img src="https://picsum.photos/seed/conflitoAbstrato/600/300" alt="Representação abstrata de conflito" data-ai-hint="abstract conflict" class="my-4 rounded-md shadow-md" /><p>Discutiremos as implicações dessa dialética para a compreensão da liberdade, do trabalho e da história, e sua influência em pensadores posteriores como Marx e Sartre.</p>`,
  },
];

export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Platão',
    role: 'Coordenador',
    imageUrl: 'https://picsum.photos/seed/plataoCoordenador/300/300',
    bio: 'Especialista em Filosofia Antiga e Metafísica. Fundador do grupo Stásis.',
  },
  {
    id: '2',
    name: 'Aristóteles',
    role: 'Membro Pesquisador',
    imageUrl: 'https://picsum.photos/seed/aristotelesPesquisador/300/300',
    bio: 'Foco em Ética, Filosofia Política e Teorias da Justiça.',
  },
  {
    id: '3',
    name: 'Simone de Beauvoir',
    role: 'Membro Pesquisador',
    imageUrl: 'https://picsum.photos/seed/simoneMembro/300/300',
    bio: 'Estudos em Fenomenologia, Existencialismo e Filosofia Feminista.',
  },
  {
    id: '4',
    name: 'Friedrich Nietzsche',
    role: 'Membro Pesquisador',
    imageUrl: 'https://picsum.photos/seed/nietzscheMembro/300/300',
    bio: 'Pesquisa sobre Filosofia da Vontade, Niilismo e Pós-Estruturalismo.',
  },
];
