import { mockMembers } from "@/lib/data";
import MemberCard from "@/components/integrantes/MemberCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrantes - ΣΤΑΣΙΣ UFRRJ",
  description:
    "Conheça os membros do Grupo de Estudos em Filosofia ΣΤΑΣΙΣ da UFRRJ.",
};

const GreekPatternDivider = () => (
  <div
    className="my-12 h-8 w-full max-w-md mx-auto overflow-hidden"
    aria-hidden="true"
    data-ai-hint="greek pattern divider"
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 30"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M0 15 L20 15 Q25 0 30 15 L50 15 Q55 30 60 15 L80 15 Q85 0 90 15 L110 15 Q115 30 120 15 L140 15 Q145 0 150 15 L170 15 Q175 30 180 15 L200 15 Q205 0 210 15 L230 15 Q235 30 240 15 L260 15 Q265 0 270 15 L290 15 Q295 30 300 15 L320 15 Q325 0 330 15 L350 15 Q355 30 360 15 L380 15 Q385 0 390 15 L400 15"
        stroke="hsl(var(--accent))"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  </div>
);

export default function IntegrantesPage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-8 bg-card shadow-lg rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold uppercase-ancient text-primary mb-3">
          Nossos Integrantes
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto px-4">
          Conheça a equipe que compõe o ΣΤΑΣΙΣ
        </p>
      </section>

      <GreekPatternDivider />

      {mockMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mockMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-foreground/70 py-10">
          Informações sobre os integrantes serão disponibilizadas em breve.
        </p>
      )}
    </div>
  );
}
