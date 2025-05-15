import type { Member } from "@/lib/types";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Award } from "lucide-react";

export default function MemberCard({ member }: { member: Member }) {
  return (
    <Card className="text-center shadow-xl hover:shadow-2xl transition-all duration-300 bg-card h-full flex flex-col group hover:scale-105">
      <CardHeader className="p-0 pt-6">
        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-background group-hover:border-accent/70 shadow-lg transition-colors duration-300">
          <Image
            src={member.imageUrl}
            alt={member.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-110 transition-transform duration-500"
            data-ai-hint="portrait person philosopher"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow flex flex-col">
        <CardTitle className="text-xl font-semibold uppercase-ancient text-primary mb-1 group-hover:text-accent transition-colors duration-300">
          {member.name}
        </CardTitle>
        <CardDescription className="text-accent font-medium mb-3 flex items-center justify-center text-sm">
          <Award size={16} className="mr-2" /> {member.role}
        </CardDescription>
        {member.bio && (
          <p className="text-sm text-card-foreground/80 leading-relaxed flex-grow">
            {member.bio}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
