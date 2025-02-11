const property = PropertiesService.getScriptProperties().getProperties();

export const credentials = {
  PASSWORD_SALT: property['PASSWORD_SALT'] || 'salt',
  ADMIN_MAIL_ADDRESS: property['ADMIN_MAIL_ADDRESS'] || 'lihs-dev@gmail.com',
} as const;
