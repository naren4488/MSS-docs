import { bhanuTemplates } from "../data/bhanu-templates";
import { saveQuotationRecord } from "./quotation-storage";

export function loadBhanuTemplates() {
  const savedIds = bhanuTemplates.map((template) => {
    const record = saveQuotationRecord({
      name: template.name,
      content: template.data,
    });
    return record.id;
  });
  return savedIds;
}

export function loadSingleBhanuTemplate(index: 0 | 1 | 2 | 3) {
  const template = bhanuTemplates[index];
  if (!template) {
    throw new Error(`Invalid template index: ${index}`);
  }
  const record = saveQuotationRecord({
    name: template.name,
    content: template.data,
  });
  return record;
}

export function getBhanuTemplateNames() {
  return bhanuTemplates.map((t, index) => ({
    index,
    name: t.name,
  }));
}
