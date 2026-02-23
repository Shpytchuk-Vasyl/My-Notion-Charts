import type { Tour } from "@/components/ui/tour";

export const TOUR_FIRST_EDIT_CHART_ID = "first-edit-chart";
export const TOUR_FIRST_EDIT_CHART_IDS = {
  WELCOME: "builder-accordion",
  SETTINGS_ACCORDION: "builder-settings-accordion",
  SETTINGS_NAME: "builder-settings-name",
  SETTINGS_TYPE: "builder-settings-type",
  SETTINGS_THEME: "builder-settings-theme",
  FILTERS_ACCORDION: "builder-filters-accordion",
  FILTERS_ACTION: "builder-filters-action",
  AXIS_ACCORDION: "builder-axis-accordion",
  AXIS_X: "builder-axis-x",
  AXIS_Y: "builder-axis-y",
  AXIS_ADD: "builder-axis-add",
  AXIS_REMOVE: "builder-axis-remove",
  CACHE_ACCORDION: "builder-cache-accordion",
  CACHE_DURATION: "builder-cache-duration",
  SORT_ACCORDION: "builder-sort-accordion",
  SORT_PROPERTY: "builder-sort-property",
  SORT_DIRECTION: "builder-sort-direction",
  LIMIT_ACCORDION: "builder-limit-accordion",
  LIMIT_VALUE: "builder-limit-value",
  COMPLETE: "builder-accordion",
};

function toggleAcordion(id: string) {
  const element = document.querySelector(
    `[data-tour-step-id='${id}']`,
  ) as HTMLElement;
  if (element) {
    element.click();
  }
}

export const getTours: (t: (key: string) => string) => Tour[] = (t) => {
  return [
    {
      id: TOUR_FIRST_EDIT_CHART_ID,
      steps: [
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.WELCOME,
          title: t("firstEdit.welcome.title"),
          content: t("firstEdit.welcome.content"),
          align: "start",
          side: "right",
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.SETTINGS_ACCORDION,
          title: t("firstEdit.settingsAccordion.title"),
          content: t("firstEdit.settingsAccordion.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterNext() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.SETTINGS_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.SETTINGS_NAME,
          title: t("firstEdit.settingsName.title"),
          content: t("firstEdit.settingsName.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterPrevious() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.SETTINGS_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.SETTINGS_TYPE,
          title: t("firstEdit.settingsType.title"),
          content: t("firstEdit.settingsType.content"),
          side: "right",
          align: "start",
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.SETTINGS_THEME,
          title: t("firstEdit.settingsTheme.title"),
          content: t("firstEdit.settingsTheme.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterNext() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.SETTINGS_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.FILTERS_ACCORDION,
          title: t("firstEdit.filtersAccordion.title"),
          content: t("firstEdit.filtersAccordion.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterNext() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.FILTERS_ACCORDION);
            },
            afterPrevious() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.SETTINGS_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.FILTERS_ACTION,
          title: t("firstEdit.filtersAction.title"),
          content: t("firstEdit.filtersAction.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterNext() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.FILTERS_ACCORDION);
            },
            afterPrevious() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.FILTERS_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.AXIS_ACCORDION,
          title: t("firstEdit.axisAccordion.title"),
          content: t("firstEdit.axisAccordion.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterNext() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.AXIS_ACCORDION);
            },
            afterPrevious() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.FILTERS_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.AXIS_X,
          title: t("firstEdit.axisX.title"),
          content: t("firstEdit.axisX.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterPrevious() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.AXIS_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.AXIS_Y,
          title: t("firstEdit.axisY.title"),
          content: t("firstEdit.axisY.content"),
          side: "right",
          align: "start",
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.AXIS_ADD,
          title: t("firstEdit.axisAdd.title"),
          content: t("firstEdit.axisAdd.content"),
          side: "right",
          align: "start",
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.AXIS_REMOVE,
          title: t("firstEdit.axisRemove.title"),
          content: t("firstEdit.axisRemove.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterNext() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.AXIS_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.CACHE_ACCORDION,
          title: t("firstEdit.cacheAccordion.title"),
          content: t("firstEdit.cacheAccordion.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterNext() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.CACHE_ACCORDION);
            },
            afterPrevious() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.AXIS_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.CACHE_DURATION,
          title: t("firstEdit.cacheDuration.title"),
          content: t("firstEdit.cacheDuration.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterNext() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.CACHE_ACCORDION);
            },
            afterPrevious() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.CACHE_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.SORT_ACCORDION,
          title: t("firstEdit.sortAccordion.title"),
          content: t("firstEdit.sortAccordion.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterNext() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.SORT_ACCORDION);
            },
            afterPrevious() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.CACHE_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.SORT_PROPERTY,
          title: t("firstEdit.sortProperty.title"),
          content: t("firstEdit.sortProperty.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterPrevious() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.SORT_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.SORT_DIRECTION,
          title: t("firstEdit.sortDirection.title"),
          content: t("firstEdit.sortDirection.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterNext() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.SORT_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.LIMIT_ACCORDION,
          title: t("firstEdit.limitAccordion.title"),
          content: t("firstEdit.limitAccordion.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterNext() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.LIMIT_ACCORDION);
            },
            afterPrevious() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.SORT_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.LIMIT_VALUE,
          title: t("firstEdit.limitValue.title"),
          content: t("firstEdit.limitValue.content"),
          side: "right",
          align: "start",
          sideEffects: {
            afterNext() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.LIMIT_ACCORDION);
            },
            afterPrevious() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.LIMIT_ACCORDION);
            },
          },
        },
        {
          id: TOUR_FIRST_EDIT_CHART_IDS.COMPLETE,
          title: t("firstEdit.complete.title"),
          content: t("firstEdit.complete.content"),
          align: "start",
          side: "right",
          sideEffects: {
            afterPrevious() {
              toggleAcordion(TOUR_FIRST_EDIT_CHART_IDS.LIMIT_ACCORDION);
            },
          },
        },
      ] as Tour["steps"],
    },
  ] as Tour[];
};
