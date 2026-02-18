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
import { type DataSourceObjectResponse } from "@notionhq/client";

type DatabaseSelectProps = {
  placeholder: string;
  databasesPromise?: Promise<{
    databases: DataSourceObjectResponse[];
    id: string;
  }>;
};

export function DatabaseSelect({ placeholder }: DatabaseSelectProps) {
  const promiseRef = useRef<
    Promise<{ databases: DataSourceObjectResponse[]; id: string }>
  >(fetch("/api/notion/databases").then((res) => res.json()));

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
      <DatabaseAutoJoinsField
        allDatabases={databases}
        selectedDatabaseIds={values}
      />
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

const DatabaseAutoJoinsField = ({
  allDatabases,
  selectedDatabaseIds,
}: {
  allDatabases: DataSourceObjectResponse[];
  selectedDatabaseIds: string[];
}) => {
  if (selectedDatabaseIds.length <= 1) return null;

  const selectedDatabases = selectedDatabaseIds
    .map((id) => allDatabases.find((db) => db.id === id))
    .filter(Boolean) as DataSourceObjectResponse[];

  const joins = Array.from(
    { length: selectedDatabases.length - 1 },
    (_, idx) => {
      const fromDbs = selectedDatabases.slice(0, idx + 1);
      const toDb = selectedDatabases[idx + 1];
      // first of all we are looking for relation properties, if they exist - we will use them for joining
      // if there are no relation properties - we will find properties with the same name and type and use them for joining

      let relationProprty: DataSourceObjectResponse["properties"][string];
      const relationProprtyDb = fromDbs.find(
        (db) =>
          (relationProprty = Object.values(db.properties).find(
            (prop) =>
              prop.type === "relation" &&
              toDb.id === prop.relation.data_source_id,
          ) as DataSourceObjectResponse["properties"][string]),
      );

      // @ts-expect-error
      if (relationProprty && relationProprty.type === "relation") {
        return {
          from: `${relationProprtyDb!.id}::${relationProprty.id}`,
          to: relationProprty.relation.data_source_id,
        };
      }

      const compProperty = (
        p: DataSourceObjectResponse["properties"][string],
        prop: DataSourceObjectResponse["properties"][string],
      ) => p.type !== "title" && p.name === prop.name && p.type === prop.type;

      const similarProperty = Object.values(toDb.properties).filter((prop) =>
        fromDbs.some((db) =>
          Object.values(db.properties).some((p) => compProperty(p, prop)),
        ),
      )[0];

      if (similarProperty) {
        const fromProperties = fromDbs.map((db) =>
          Object.values(db.properties).filter((p) =>
            compProperty(p, similarProperty),
          ),
        );

        const firstNotEmptyFromPropertieIdx = fromProperties.findIndex(
          (props) => props.length > 0,
        );

        return {
          from: `${fromDbs[firstNotEmptyFromPropertieIdx].id}::${fromProperties[firstNotEmptyFromPropertieIdx][0].id}`,
          to: `${toDb.id}::${similarProperty.id}`,
        };
      }

      return null;
    },
  );

  return joins.map((join, idx) => {
    if (!join) return null;
    return (
      <>
        <input
          type="hidden"
          name={`joins[${idx}][from]`}
          value={join.from}
          readOnly
        />
        <input
          type="hidden"
          name={`joins[${idx}][to]`}
          value={join.to}
          readOnly
        />
        <style>{`a
          button > div > span:nth-child(${idx + 2})::after {
            content: '🔗';
          }
        `}</style>
      </>
    );
  });
};

const NotionDatabaseIcon = ({
  database,
}: {
  database: DataSourceObjectResponse;
}) => {
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
