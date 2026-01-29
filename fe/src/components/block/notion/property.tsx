import {
  type LucideIcon,
  CaseSensitive,
  CheckSquare,
  Clock,
  Calendar,
  Mail,
  Paperclip,
  List,
  Hash,
  Users,
  Phone,
  MapPin,
  Link,
  Sigma,
  Tag,
  Loader,
  CircleQuestionMark,
  CircleUserRound,
  ArrowRight,
  TextAlignStart,
} from "lucide-react";

export const properties = [
  "checkbox",
  "created_by",
  "created_time",
  "date",
  "email",
  "files",
  "formula",
  "last_edited_by",
  "last_edited_time",
  "multi_select",
  "number",
  "people",
  "phone_number",
  "place",
  "relation",
  "rich_text",
  "rollup",
  "select",
  "status",
  "title",
  "url",
] as const;
export type PropertyType = (typeof properties)[number];
export const propertiesIcons: Record<PropertyType, LucideIcon> = {
  checkbox: CheckSquare,
  created_by: CircleUserRound,
  created_time: Clock,
  date: Calendar,
  email: Mail,
  files: Paperclip,
  formula: Sigma,
  last_edited_by: CircleUserRound,
  last_edited_time: Clock,
  multi_select: List,
  number: Hash,
  people: Users,
  phone_number: Phone,
  place: MapPin,
  relation: ArrowRight,
  rich_text: TextAlignStart,
  rollup: Sigma,
  select: Tag,
  status: Loader,
  title: CaseSensitive,
  url: Link,
} as const;

export const PropertyIcon = ({
  type,
  ...rest
}: { type: PropertyType } & React.ComponentProps<LucideIcon>) => {
  const IconComponent = propertiesIcons[type] || CircleQuestionMark;
  return <IconComponent {...rest} />;
};
