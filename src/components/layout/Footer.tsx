import { Mail, MessageSquare, School } from 'lucide-react'; // Using School for UFRRJ

const LaurelWreathIconFooter = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className="w-12 h-12 text-accent mx-auto mb-4"
    aria-hidden="true"
    data-ai-hint="laurel wreath"
  >
    <path 
      fill="currentColor"
      d="M12,2A10,10,0,0,0,2,12a10,10,0,0,0,10,10,10,10,0,0,0,10-10A10,10,0,0,0,12,2Zm5.71,6.71-0.71.7A5.77,5.77,0,0,1,12,8a5.77,5.77,0,0,1-5-1.29l-0.71-.7A8,8,0,0,0,4,12a8,8,0,0,0,2.29,5.71l0.71-.71A5.77,5.77,0,0,1,8,16a5.77,5.77,0,0,1,1.29-5l0.71,0.71A8,8,0,0,0,12,14a8,8,0,0,0,5.71-2.29l0.71,0.7A5.77,5.77,0,0,1,16,10a5.77,5.77,0,0,1,5-1.29A8,8,0,0,0,17.71,8.71Z M12,6A6,6,0,0,1,18,12H16A4,4,0,0,0,12,8Zm0,12a6,6,0,0,1-6-6H8A4,4,0,0,0,12,16Z"
    />
  </svg>
);


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contato" className="bg-primary text-primary-foreground py-12 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <LaurelWreathIconFooter />
        <h2 className="text-3xl font-semibold uppercase-ancient mb-6 text-accent">Contato</h2>
        <p className="mb-2 text-lg">
          Grupo de Estudos em Filosofia Stásis
        </p>
        <p className="mb-4 text-md text-primary-foreground/80">
          Universidade Federal Rural do Rio de Janeiro (UFRRJ)
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
          <a href="mailto:contato.stasis.ufrrj@gmail.com" className="hover:text-accent transition-colors flex items-center text-primary-foreground/90">
            <Mail className="mr-2" size={20} /> contato.stasis.ufrrj@gmail.com
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center text-primary-foreground/90"> {/* Placeholder for social media */}
            <MessageSquare className="mr-2" size={20} /> Redes Sociais (em breve)
          </a>
           <a href="https://portal.ufrrj.br/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center text-primary-foreground/90"> 
            <School className="mr-2" size={20} /> Portal UFRRJ
          </a>
        </div>
        <p className="text-sm text-primary-foreground/70">
          &copy; {currentYear} Stásis UFRRJ. Todos os direitos reservados.
        </p>
         {/* <p className="text-xs mt-2 text-primary-foreground/60">
          Design inspirado na cerâmica grega antiga e na busca pela sabedoria.
        </p> */}
      </div>
    </footer>
  );
}
