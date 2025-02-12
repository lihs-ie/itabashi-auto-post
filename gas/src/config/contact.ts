const property = PropertiesService.getScriptProperties().getProperties();

export const contact = {
  MAIL_TITLE: property['MAIL_TITLE'] || '【itabashi-auto-post-dev】',
} as const;
