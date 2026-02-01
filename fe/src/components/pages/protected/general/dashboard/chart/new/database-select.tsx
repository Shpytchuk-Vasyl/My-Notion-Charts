"use client";

import Image from "next/image";
import { Database } from "lucide-react";
import { use, useState } from "react";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";

type DatabaseSelectProps = {
  placeholder: string;
  promise: Promise<{ databases: any[]; id: string }>;
};

export function DatabaseSelect({ placeholder, promise }: DatabaseSelectProps) {
  const { databases, id } = use(promise);
  const [values, setValues] = useState<string[]>([]);

  return (
    <MultiSelect
      values={values}
      onValuesChange={setValues}
      name="database"
      required
    >
      <input type="hidden" name="workspaceId" value={id || ""} readOnly />
      <MultiSelectTrigger id="database" className="w-full">
        <MultiSelectValue placeholder={placeholder} />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectGroup>
          {databases.map((database) => (
            <MultiSelectItem
              key={`database-select-${database.id}`}
              value={database.id}
            >
              <NotionDatabaseIcon database={database} />
              {database.title[0].plain_text}
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}

const NotionDatabaseIcon = ({ database }: { database: any }) => {
  if (
    database.icon == null ||
    database.icon.type === "emoji" ||
    database.icon.type === "custom_emoji"
  ) {
    return <Database />;
  } else {
    return (
      <Image
        src={
          database.icon?.type === "external"
            ? database.icon.external.url
            : database.icon?.type === "file"
              ? database.icon.file.url
              : "impossible"
        }
        alt="icon"
        width={16}
        height={16}
        className="size-4"
      />
    );
  }
};
