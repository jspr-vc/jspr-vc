import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTabler,
  IconBrandTwitter,
  IconMail,
  IconWorldWww,
} from "@tabler/icons-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LinkButton } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Props {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  publicEmail?: string | null;
}

export function SocialLinks(props: Props) {
  return (
    <div className="flex items-center gap-2 mt-4">
      {props.github && (
        <LinkButton href={props.github} variant="ghost" size="icon">
          <IconBrandGithub />
        </LinkButton>
      )}
      {props.linkedin && (
        <LinkButton href={props.linkedin} variant="ghost" size="icon">
          <IconBrandLinkedin />
        </LinkButton>
      )}
      {props.twitter && (
        <LinkButton href={props.twitter} variant="ghost" size="icon">
          <IconBrandTwitter />
        </LinkButton>
      )}
      {props.website && (
        <LinkButton href={props.website} variant="ghost" size="icon">
          <IconWorldWww />
        </LinkButton>
      )}
      {props.publicEmail && (
        <LinkButton
          href={`mailto:${props.publicEmail}`}
          variant="ghost"
          size="icon"
        >
          <IconMail />
        </LinkButton>
      )}
      <Separator orientation="vertical" />
      <ThemeToggle />
      <LinkButton href="/dashboard" variant="ghost" size="icon">
        <IconBrandTabler />
      </LinkButton>
    </div>
  );
}
