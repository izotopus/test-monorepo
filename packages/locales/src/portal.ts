import { i18n } from './i18n-manager';
import pl from './data/portal/pl.json';
import en from './data/portal/en.json';

export const locales = { pl, en };

i18n.register('portal', locales);

export { i18n, currentLang } from './i18n-manager';