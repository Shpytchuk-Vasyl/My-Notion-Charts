"use client";

import { Database } from "lucide-react";
import Image from "next/image";
import { Suspense, use, useRef, useState } from "react";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { Skeleton } from "@/components/ui/skeleton";

type DatabaseSelectProps = {
  placeholder: string;
  databasesPromise?: Promise<{ databases: any[]; id: string }>;
};

export function DatabaseSelect({ placeholder }: DatabaseSelectProps) {
  const promiseRef = useRef<Promise<{ databases: any[]; id: string }>>(
    fetch("/api/notion/databases").then((res) => res.json()),
  );

  return (
    <Suspense fallback={<Skeleton className="h-9 w-full" />}>
      <DatabaseSelectInner
        placeholder={placeholder}
        databasesPromise={promiseRef.current}
      />
    </Suspense>
  );
}

function DatabaseSelectInner({
  placeholder,
  databasesPromise,
}: DatabaseSelectProps) {
  const { databases, id } = use(databasesPromise!);
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
