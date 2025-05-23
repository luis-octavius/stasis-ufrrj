import type { Member } from "@/lib/types";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
// Assuming these are your button and icons imports
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Award } from "lucide-react"; // Added Pencil and Trash2

// Define the props interface including the new optional props
interface MemberCardProps {
  member: Member;
  isAdmin: boolean; // New prop to control admin button visibility
  onEdit?: (memberId: string) => void; // Optional callback for edit
  onDelete?: (memberId: string) => void; // Optional callback for delete
}

export default function MemberCard({
  member,
  isAdmin,
  onEdit,
  onDelete,
}: MemberCardProps) {
  return (
    <Card className="text-center shadow-xl hover:shadow-2xl transition-all duration-300 bg-card h-full flex flex-col group hover:scale-105">
      <CardHeader className="p-0 pt-6">
        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-background group-hover:border-accent/70 shadow-lg transition-colors duration-300">
          {/* Ensure member.imageUrl exists before rendering Image */}
          <Image
            src={member.imageUrl || "/placeholder-member.jpg"} // Use a fallback image if imageUrl is missing
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
        {/* Display Instituição and Área de Pesquisa instead of Role and Bio */}
        <CardDescription className="text-accent font-medium mb-3 text-sm flex flex-col items-center">
          {member.instituicao && (
            <span className="flex items-center justify-center mb-1">
              <Award size={16} className="mr-2" /> {member.instituicao}
            </span>
          )}
          {member.areaPesquisa && (
            <span className="text-card-foreground/80 italic">
              {member.areaPesquisa}
            </span>
          )}
        </CardDescription>
        {/* Optional: Link for Curriculo Lattes */}
        {member.curriculoLattes && (
          <a
            href={member.curriculoLattes}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm mb-3"
          >
            Currículo Lattes
          </a>
        )}
        {/* Removed bio display as per new requirements */}
        {/* {member.bio && (
          <p className="text-sm text-card-foreground/80 leading-relaxed flex-grow">
            {member.bio}
          </p>
        )} */}
      </CardContent>
      {/* Add admin buttons in CardFooter */}
      {isAdmin && (
        <CardFooter className="p-4 pt-0 flex justify-center space-x-2">
          {/* Edit Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(member.id)} // Call onEdit if it exists
            aria-label={`Editar ${member.name}`}
          >
            <Pencil size={16} />
          </Button>
          {/* Delete Button */}
          <Button
            variant="destructive" // Assuming you have a destructive variant for deletion
            size="sm"
            onClick={() => onDelete?.(member.id)} // Call onDelete if it exists
            aria-label={`Remover ${member.name}`}
          >
            <Trash2 size={16} />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
