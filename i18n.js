//i18n.js
const languages = {
    en: require('./locales/en.json'),
    zh: require('./locales/zh.json'),
    zhHK: require('./locales/zh-HK.json'),
  };
  
let currentLang = 'en'; // 默认语言
  
export const setLanguage = (lang) => {
    currentLang = lang;
};
  
export const t = (key) => {
    return languages[currentLang][key] || key; // 如果没有对应翻译，返回原始key
};
  