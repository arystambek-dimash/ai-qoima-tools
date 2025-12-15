import { query } from '../db/index.js';

interface TranslationRow {
  field_name: string;
  translated_value: string;
}

/**
 * Get translations for a specific entity
 */
export async function getTranslations(
  entityType: string,
  entityId: string,
  locale: string
): Promise<Record<string, string>> {
  if (locale === 'en') {
    return {}; // English is the default, no translations needed
  }

  const translations = await query<TranslationRow>(
    `SELECT field_name, translated_value
     FROM translations
     WHERE entity_type = $1 AND entity_id = $2 AND locale = $3`,
    [entityType, entityId, locale]
  );

  const result: Record<string, string> = {};
  for (const t of translations) {
    result[t.field_name] = t.translated_value;
  }
  return result;
}

/**
 * Get translations for multiple entities at once
 */
export async function getBatchTranslations(
  entityType: string,
  entityIds: string[],
  locale: string
): Promise<Map<string, Record<string, string>>> {
  if (locale === 'en' || entityIds.length === 0) {
    return new Map();
  }

  const translations = await query<TranslationRow & { entity_id: string }>(
    `SELECT entity_id, field_name, translated_value
     FROM translations
     WHERE entity_type = $1 AND entity_id = ANY($2::uuid[]) AND locale = $3`,
    [entityType, entityIds, locale]
  );

  const result = new Map<string, Record<string, string>>();
  for (const t of translations) {
    if (!result.has(t.entity_id)) {
      result.set(t.entity_id, {});
    }
    result.get(t.entity_id)![t.field_name] = t.translated_value;
  }
  return result;
}

/**
 * Apply translations to an entity object
 */
export function applyTranslations<T extends Record<string, unknown>>(
  entity: T,
  translations: Record<string, string>
): T {
  if (Object.keys(translations).length === 0) {
    return entity;
  }

  const result = { ...entity };
  for (const [field, value] of Object.entries(translations)) {
    if (field in result) {
      (result as Record<string, unknown>)[field] = value;
    }
  }
  return result;
}

/**
 * Apply batch translations to an array of entities
 */
export function applyBatchTranslations<T extends { id: string } & Record<string, unknown>>(
  entities: T[],
  translationsMap: Map<string, Record<string, string>>
): T[] {
  return entities.map((entity) => {
    const translations = translationsMap.get(entity.id) || {};
    return applyTranslations(entity, translations);
  });
}
