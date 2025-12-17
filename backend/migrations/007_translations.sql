-- Create translations table for multilingual content
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  locale VARCHAR(5) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  translated_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, locale, field_name)
);

CREATE INDEX IF NOT EXISTS idx_translations_entity ON translations(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_translations_locale ON translations(locale);

-- Insert sample Russian translations for use_cases
INSERT INTO translations (entity_type, entity_id, locale, field_name, translated_value)
SELECT 'use_case', id, 'ru', 'title', 
  CASE slug
    WHEN 'write-marketing-copy' THEN 'Написание маркетингового текста'
    WHEN 'analyze-business-data' THEN 'Анализ бизнес-данных'
    WHEN 'build-a-website' THEN 'Создание веб-сайта'
    WHEN 'create-presentations' THEN 'Создание презентаций'
    WHEN 'automate-workflows' THEN 'Автоматизация рабочих процессов'
    WHEN 'generate-images' THEN 'Генерация изображений'
    ELSE title
  END
FROM use_cases
ON CONFLICT (entity_type, entity_id, locale, field_name) DO NOTHING;

INSERT INTO translations (entity_type, entity_id, locale, field_name, translated_value)
SELECT 'use_case', id, 'ru', 'summary',
  CASE slug
    WHEN 'write-marketing-copy' THEN 'Создавайте убедительный маркетинговый контент с помощью AI: рекламные тексты, email-рассылки, посты для социальных сетей и многое другое.'
    WHEN 'analyze-business-data' THEN 'Используйте AI для анализа бизнес-данных, создания отчётов и выявления ключевых трендов.'
    WHEN 'build-a-website' THEN 'Создавайте современные веб-сайты с помощью AI: от дизайна до кода и развёртывания.'
    WHEN 'create-presentations' THEN 'Создавайте профессиональные презентации с AI: генерация слайдов, визуальных элементов и контента.'
    WHEN 'automate-workflows' THEN 'Автоматизируйте рутинные задачи и рабочие процессы с помощью AI-инструментов.'
    WHEN 'generate-images' THEN 'Генерируйте уникальные изображения, графику и арт с помощью AI.'
    ELSE summary
  END
FROM use_cases
ON CONFLICT (entity_type, entity_id, locale, field_name) DO NOTHING;

-- Insert sample Kazakh translations for use_cases
INSERT INTO translations (entity_type, entity_id, locale, field_name, translated_value)
SELECT 'use_case', id, 'kk', 'title',
  CASE slug
    WHEN 'write-marketing-copy' THEN 'Маркетингтік мәтін жазу'
    WHEN 'analyze-business-data' THEN 'Бизнес деректерін талдау'
    WHEN 'build-a-website' THEN 'Веб-сайт құру'
    WHEN 'create-presentations' THEN 'Презентация жасау'
    WHEN 'automate-workflows' THEN 'Жұмыс процестерін автоматтандыру'
    WHEN 'generate-images' THEN 'Суреттер генерациялау'
    ELSE title
  END
FROM use_cases
ON CONFLICT (entity_type, entity_id, locale, field_name) DO NOTHING;

INSERT INTO translations (entity_type, entity_id, locale, field_name, translated_value)
SELECT 'use_case', id, 'kk', 'summary',
  CASE slug
    WHEN 'write-marketing-copy' THEN 'AI көмегімен сенімді маркетинг контентін жасаңыз: жарнама мәтіндері, email-хаттар, әлеуметтік желі посттары және т.б.'
    WHEN 'analyze-business-data' THEN 'Бизнес деректерін талдау, есептер жасау және негізгі трендтерді анықтау үшін AI қолданыңыз.'
    WHEN 'build-a-website' THEN 'AI көмегімен заманауи веб-сайттар жасаңыз: дизайннан бастап код пен орналастыруға дейін.'
    WHEN 'create-presentations' THEN 'AI көмегімен кәсіби презентациялар жасаңыз: слайдтар, визуал элементтер және контент генерациясы.'
    WHEN 'automate-workflows' THEN 'AI құралдарының көмегімен күнделікті тапсырмалар мен жұмыс процестерін автоматтандырыңыз.'
    WHEN 'generate-images' THEN 'AI көмегімен бірегей суреттер, графика және арт жасаңыз.'
    ELSE summary
  END
FROM use_cases
ON CONFLICT (entity_type, entity_id, locale, field_name) DO NOTHING;

-- Insert Russian translations for tools
INSERT INTO translations (entity_type, entity_id, locale, field_name, translated_value)
SELECT 'tool', id, 'ru', 'short_description',
  CASE slug
    WHEN 'chatgpt' THEN 'Мощный AI-ассистент для генерации текста, ответов на вопросы и помощи в различных задачах.'
    WHEN 'claude' THEN 'AI-ассистент от Anthropic с расширенными возможностями анализа и генерации контента.'
    WHEN 'midjourney' THEN 'Генерация потрясающих изображений и арта с помощью AI на основе текстовых описаний.'
    WHEN 'dall-e' THEN 'Создание уникальных изображений из текстовых описаний с помощью OpenAI DALL-E.'
    WHEN 'github-copilot' THEN 'AI-помощник для программирования, предлагающий код в реальном времени.'
    ELSE short_description
  END
FROM tools
ON CONFLICT (entity_type, entity_id, locale, field_name) DO NOTHING;

-- Insert Kazakh translations for tools
INSERT INTO translations (entity_type, entity_id, locale, field_name, translated_value)
SELECT 'tool', id, 'kk', 'short_description',
  CASE slug
    WHEN 'chatgpt' THEN 'Мәтін генерациялау, сұрақтарға жауап беру және түрлі тапсырмаларда көмектесу үшін қуатты AI-көмекші.'
    WHEN 'claude' THEN 'Anthropic компаниясының кеңейтілген талдау және контент генерациялау мүмкіндіктері бар AI-көмекшісі.'
    WHEN 'midjourney' THEN 'Мәтіндік сипаттамалар негізінде AI көмегімен керемет суреттер мен арт жасау.'
    WHEN 'dall-e' THEN 'OpenAI DALL-E көмегімен мәтіндік сипаттамалардан бірегей суреттер жасау.'
    WHEN 'github-copilot' THEN 'Нақты уақытта код ұсынатын бағдарламалауға арналған AI-көмекші.'
    ELSE short_description
  END
FROM tools
ON CONFLICT (entity_type, entity_id, locale, field_name) DO NOTHING;
