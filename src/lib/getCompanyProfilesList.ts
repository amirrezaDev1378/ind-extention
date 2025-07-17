const getCompanyProfilesList = (): Element[] => {
  const possibleProfileSelectors = [
    ".base-search-card__info > h4 > a",
    "ul div > div.job-card-container div.ember-view.artdeco-entity-lockup__subtitle span",
    "div.job-details-jobs-unified-top-card__company-name > a",
    ".top-card-layout__entity-info-container  span.topcard__flavor > a",
    ".top-card-layout__card   h1.top-card-layout__title",
    ".org-top-card__primary-content    h1.org-top-card-summary__title",
    "span[data-testid=company-name]",
    "div[data-testid=inlineHeader-companyName] a",
  ];

  const elements = possibleProfileSelectors.flatMap((selector) =>
    Array.from(document.querySelectorAll(selector)),
  );
  // Remove duplicates (in case an element matches multiple selectors)
  return Array.from(new Set(elements));
};

export default getCompanyProfilesList;
