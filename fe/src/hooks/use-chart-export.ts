"use client";

export type ExportFormat = "png" | "csv" | "json" | "pdf" | "svg" | "power-bi";

type ChartPayload = {
  xKey: string;
  yKeys: string[];
  chartData: Array<Record<string, unknown>>;
  labels?: Record<string, string>;
  type?: string;
  id?: string;
  theme?: string;
};

function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

function downloadTextFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function getIframeByChartId(chartId: string): HTMLIFrameElement | null {
  return document.querySelector(
    `iframe[src*="/chart/${chartId}/view"]`,
  ) as HTMLIFrameElement | null;
}

function getIframeRootElement(iframe: HTMLIFrameElement): HTMLElement | null {
  const iframeDocument = iframe.contentDocument;

  if (!iframeDocument) {
    return null;
  }

  return iframeDocument.body;
}

function extractBalancedJsonObject(text: string, startIndex: number) {
  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let index = startIndex; index < text.length; index++) {
    const char = text[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === "\\") {
        isEscaped = true;
      } else if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth++;
      continue;
    }

    if (char === "}") {
      depth--;

      if (depth === 0) {
        return text.slice(startIndex, index + 1);
      }
    }
  }

  return null;
}

function parseChartPayloadFromScript(scriptText: string) {
  const normalized = scriptText.replaceAll('\\"', '"').replaceAll("\\n", "\n");
  const markerIndex = normalized.indexOf('{"xKey"');

  if (markerIndex < 0) {
    return [];
  }

  const jsonObject = extractBalancedJsonObject(normalized, markerIndex);

  if (!jsonObject) {
    return [];
  }

  try {
    const parsed = JSON.parse(jsonObject) as Partial<ChartPayload>;

    if (
      typeof parsed.xKey === "string" &&
      Array.isArray(parsed.yKeys) &&
      Array.isArray(parsed.chartData)
    ) {
      return (parsed.chartData || []).map((row) => {
        for (const oldKey in row) {
          const newKey = parsed.labels?.[oldKey] ?? oldKey;
          row[newKey] = row[oldKey];
          delete row[oldKey];
        }
        return row;
      });
    }
  } catch {}

  return [];
}

function findChartPayload(doc: Document) {
  const scripts = Array.from(doc.querySelectorAll("script"));

  for (const script of scripts) {
    const text = script.textContent ?? "";

    if (!text.includes("xKey") || !text.includes("chartData")) {
      continue;
    }

    const payload = parseChartPayloadFromScript(text);

    return payload;
  }

  return [];
}

function jsonToCsv(jsonRecords: any[]): string {
  if (!Array.isArray(jsonRecords) || jsonRecords.length === 0) {
    return "";
  }

  const headers = Object.keys(jsonRecords[0]);
  const csvHeader = headers.join(",");

  const csvRows = jsonRecords.map((record) => {
    const values = headers.map((header) => {
      const value =
        record[header] === null || record[header] === undefined
          ? ""
          : record[header];
      return JSON.stringify(value);
    });
    return values.join(",");
  });

  return [csvHeader, ...csvRows].join("\r\n");
}

export function useChartExport(chartId: string) {
  const exportChart = async (format: ExportFormat, chartName: string) => {
    const iframe = getIframeByChartId(chartId);

    if (!iframe) {
      return false;
    }

    const root = getIframeRootElement(iframe);
    const iframeDoc = iframe.contentDocument;

    if (!root || !iframeDoc) {
      return false;
    }

    try {
      if (format === "png") {
        const toPng = (await import("html-to-image")).toPng;
        const dataUrl = await toPng(root, {
          cacheBust: true,
          pixelRatio: 2,
        });
        downloadDataUrl(dataUrl, `${chartName}.png`);
      }

      if (format === "svg") {
        const toSvg = (await import("html-to-image")).toSvg;
        const dataUrl = await toSvg(root, {
          cacheBust: true,
        });
        downloadDataUrl(dataUrl, `${chartName}.svg`);
      }

      if (format === "pdf") {
        const jsPDF = (await import("jspdf")).jsPDF;
        const toPng = (await import("html-to-image")).toPng;

        const dataUrl = await toPng(root, {
          cacheBust: true,
          pixelRatio: 2,
        });

        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: "a4",
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(dataUrl, "PNG", 0, 0, pageWidth, pageHeight);
        pdf.save(`${chartName}.pdf`);
      }

      if (format === "json") {
        const payload = findChartPayload(iframeDoc);

        const json = JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            sourceUrl: iframe.src,
            data: payload,
          },
          null,
          2,
        );

        downloadTextFile(json, `${chartName}.json`, "application/json");
      }

      if (format === "csv") {
        const payload = findChartPayload(iframeDoc);

        const csv = jsonToCsv(payload);
        downloadTextFile(csv, `${chartName}.csv`, "text/csv");
      }

      if (format === "power-bi") {
        const payload = findChartPayload(iframeDoc);

        if (!payload) {
          return false;
        }

        const bi = "https://github.com/queryon/powerbi_notion_connector";
        downloadTextFile(bi, `${chartName}-power-bi.txt`, "text/plain");
      }

      return true;
    } catch {
      return false;
    }
  };

  return { exportChart };
}
