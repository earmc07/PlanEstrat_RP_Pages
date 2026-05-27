const normalizeFilterValue = (value) => (
  String(value || "")
    .trim()
    .toLowerCase()
);

const elementMatchesFilter = (element, filterKey, filterValue) => {
  if (!filterValue) {
    return true;
  }

  const rawValue = element.dataset[filterKey];

  if (!rawValue) {
    return true;
  }

  return String(rawValue)
    .split("|")
    .map(normalizeFilterValue)
    .includes(filterValue);
};

const getActiveFilters = (selects) => (
  Array.from(selects).reduce((filters, select) => {
    const key = select.dataset.filter;
    const value = normalizeFilterValue(select.value);

    if (key && value) {
      filters[key] = value;
    }

    return filters;
  }, {})
);

const updateActiveText = (selects, activeText) => {
  if (!activeText) {
    return;
  }

  const labels = Array.from(selects)
    .filter((select) => normalizeFilterValue(select.value))
    .map((select) => select.options[select.selectedIndex].text);

  activeText.textContent = labels.length
    ? `Filtros ativos: ${labels.join(" · ")}`
    : "Filtros ativos: Todos";
};

const applyGlobalFilters = () => {
  const selects = document.querySelectorAll("[data-filter]");
  const activeText = document.querySelector("[data-active-filters]");
  const filterableElements = document.querySelectorAll(
    ".objective-card, .objective-perspective-group, .initiative-item, .management-goal-row, .quadrant-bubble, .status-card, .kr-row, .kr-detail-panel, .kr-history-row"
  );
  const filters = getActiveFilters(selects);

  filterableElements.forEach((element) => {
    const isVisible = Object.entries(filters).every(
      ([key, value]) => elementMatchesFilter(element, key, value)
    );

    element.classList.toggle("is-hidden", !isVisible);
  });

  updateActiveText(selects, activeText);
};

const setupGlobalFilters = () => {
  const selects = document.querySelectorAll("[data-filter]");
  const clearButton = document.querySelector("[data-clear-filters]");

  if (!selects.length) {
    return;
  }

  selects.forEach((select) => {
    select.addEventListener("change", applyGlobalFilters);
  });

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      selects.forEach((select) => {
        select.value = "";
      });

      applyGlobalFilters();
    });
  }

  applyGlobalFilters();
};

document.addEventListener("DOMContentLoaded", setupGlobalFilters);

const setupKrSelector = () => {
  const selector = document.querySelector("[data-kr-selector]");
  const panels = document.querySelectorAll("[data-kr-panel]");

  if (!selector || !panels.length) {
    return;
  }

  const updateSelectedKr = () => {
    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.krPanel === selector.value);
    });

    applyGlobalFilters();
  };

  selector.addEventListener("change", updateSelectedKr);
  updateSelectedKr();
};

document.addEventListener("DOMContentLoaded", setupKrSelector);
