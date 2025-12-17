-- Add Russian translations for news articles
INSERT INTO translations (entity_type, entity_id, locale, field_name, translated_value)
VALUES
  ('news', 'ee001111-1111-1111-1111-111111111111', 'ru', 'title', 'OpenAI запускает GPT-4 Turbo с поддержкой изображений'),
  ('news', 'ee001111-1111-1111-1111-111111111111', 'ru', 'description', 'Новая модель GPT-4 Turbo теперь поддерживает анализ изображений и имеет расширенное контекстное окно.'),
  ('news', 'ee002222-2222-2222-2222-222222222222', 'ru', 'title', 'Anthropic выпускает Claude 3.5 Sonnet'),
  ('news', 'ee002222-2222-2222-2222-222222222222', 'ru', 'description', 'Новая модель Claude 3.5 Sonnet показывает улучшенную производительность в задачах программирования и анализа.'),
  ('news', 'ee005555-5555-5555-5555-555555555555', 'ru', 'title', 'Google выпускает Gemini Pro 1.5'),
  ('news', 'ee005555-5555-5555-5555-555555555555', 'ru', 'description', 'Google представила обновленную модель Gemini Pro 1.5 с расширенными возможностями.'),
  ('news', 'ee006666-6666-6666-6666-666666666666', 'ru', 'title', 'Canva представляет AI-набор Magic Studio'),
  ('news', 'ee006666-6666-6666-6666-666666666666', 'ru', 'description', 'Canva запустила набор AI-инструментов Magic Studio для создания и редактирования контента.'),
  ('news', 'c8f74467-c831-4a6e-9796-8cb21ba85db9', 'ru', 'title', 'OpenAI запускает Академию для обучения редакций работе с AI'),
  ('news', '5e10eaf9-8c48-4307-8d1f-d7b55f9b5540', 'ru', 'title', 'Gemini 3 Flash: быстрый интеллект революционизирует AI-инструменты'),
  ('news', '9006290b-2c5f-4e89-9a5d-f4d49492c5b9', 'ru', 'title', 'Рост внедрения AI: готова ли сетевая безопасность?')
ON CONFLICT (entity_type, entity_id, locale, field_name) DO NOTHING;

-- Add Kazakh translations for news articles
INSERT INTO translations (entity_type, entity_id, locale, field_name, translated_value)
VALUES
  ('news', 'ee001111-1111-1111-1111-111111111111', 'kk', 'title', 'OpenAI сурет қолдауымен GPT-4 Turbo шығарды'),
  ('news', 'ee001111-1111-1111-1111-111111111111', 'kk', 'description', 'Жаңа GPT-4 Turbo моделі енді суреттерді талдауды қолдайды және кеңейтілген контекст терезесіне ие.'),
  ('news', 'ee002222-2222-2222-2222-222222222222', 'kk', 'title', 'Anthropic Claude 3.5 Sonnet шығарды'),
  ('news', 'ee002222-2222-2222-2222-222222222222', 'kk', 'description', 'Жаңа Claude 3.5 Sonnet моделі бағдарламалау және талдау тапсырмаларында жақсартылған өнімділікті көрсетеді.'),
  ('news', 'ee005555-5555-5555-5555-555555555555', 'kk', 'title', 'Google Gemini Pro 1.5 шығарды'),
  ('news', 'ee005555-5555-5555-5555-555555555555', 'kk', 'description', 'Google кеңейтілген мүмкіндіктері бар жаңартылған Gemini Pro 1.5 моделін таныстырды.'),
  ('news', 'ee006666-6666-6666-6666-666666666666', 'kk', 'title', 'Canva Magic Studio AI жинағын таныстырды'),
  ('news', 'ee006666-6666-6666-6666-666666666666', 'kk', 'description', 'Canva контент жасау және өңдеуге арналған Magic Studio AI құралдар жинағын іске қосты.'),
  ('news', 'c8f74467-c831-4a6e-9796-8cb21ba85db9', 'kk', 'title', 'OpenAI редакцияларды AI-мен жұмыс істеуге үйрету үшін Академия іске қосты'),
  ('news', '5e10eaf9-8c48-4307-8d1f-d7b55f9b5540', 'kk', 'title', 'Gemini 3 Flash: жылдам интеллект AI құралдарын революциялайды'),
  ('news', '9006290b-2c5f-4e89-9a5d-f4d49492c5b9', 'kk', 'title', 'AI енгізу өсуде: желілік қауіпсіздік дайын ба?')
ON CONFLICT (entity_type, entity_id, locale, field_name) DO NOTHING;
