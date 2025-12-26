-- ============================================
-- SQL Script: Добавление новых AI-инструментов
-- Дата создания: 2025-12-26
-- Автор: Senior Data Analyst
-- ============================================

-- Примечание: Некоторые инструменты уже существуют в базе (chatgpt, claude, dall-e, perplexity)
-- Для них мы используем ON CONFLICT DO UPDATE

-- ============================================
-- ЧАСТЬ 1: ВСТАВКА НОВЫХ ИНСТРУМЕНТОВ
-- ============================================

-- 1. ChatGPT (обновление существующей записи)
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'chatgpt',
    'ChatGPT',
    'Универсальный AI-ассистент для генерации текста, кода, идей и решения разнообразных задач.',
    'ChatGPT от OpenAI — один из самых популярных AI-ассистентов в мире. Инструмент способен генерировать тексты любой сложности, писать и отлаживать код, создавать креативные идеи, анализировать данные и помогать в обучении. Поддерживает GPT-4, GPT-4o и GPT-5 в платных версиях. Интегрирован с DALL-E для генерации изображений и Sora для создания видео.',
    ARRAY['Генерация текста', 'Программирование', 'Анализ', 'Креатив', 'Обучение'],
    'Бесплатная версия имеет ограничения по количеству запросов. Информация может быть устаревшей. Требуется проверка фактов.',
    'https://chat.openai.com/',
    '{"popular": true, "free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    categories = EXCLUDED.categories,
    limitations = EXCLUDED.limitations,
    external_url = EXCLUDED.external_url,
    badges = EXCLUDED.badges,
    updated_at = NOW();

-- 2. ChatGPT for Managers
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'chatgpt-for-managers',
    'Chat GPT for Managers',
    'Курс от OpenAI Academy с готовыми промтами и методиками для руководителей.',
    'Официальный образовательный ресурс от OpenAI Academy, разработанный специально для менеджеров и руководителей. Содержит готовые промты для управленческих задач: составление отчётов, планирование проектов, написание обратной связи сотрудникам, подготовка презентаций и стратегических документов. Включает методики эффективного использования ChatGPT в бизнес-контексте.',
    ARRAY['Обучение', 'Менеджмент', 'Продуктивность', 'Бизнес'],
    'Контент на английском языке. Требуется регистрация на платформе OpenAI Academy.',
    'https://academy.openai.com/public/clubs/work-users-ynjqu/resources/use-cases-for-managers',
    '{"free_tier": true, "educational": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    categories = EXCLUDED.categories,
    updated_at = NOW();

-- 3. GPT Excel (Excel AI)
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'gpt-excel',
    'GPT Excel (Excel AI)',
    'AI-ассистент для автоматизации работы в Excel: формулы, анализ данных, массовые операции.',
    'GPT Excel — специализированный GPT для работы с электронными таблицами. Позволяет автоматически генерировать сложные формулы Excel, проводить массовый анализ данных, переводить содержимое ячеек, классифицировать данные по категориям, выполнять sentiment-анализ отзывов и комментариев. Поддерживает работу с тысячами ячеек одновременно. Интегрируется как плагин прямо в Microsoft Excel.',
    ARRAY['Excel', 'Анализ данных', 'Автоматизация', 'Формулы', 'Продуктивность'],
    'Требуется подписка ChatGPT Plus для доступа к GPT. Работает через веб-интерфейс ChatGPT.',
    'https://chatgpt.com/g/g-R6VqLNHFM-excel-ai',
    '{"free_tier": false, "specialized": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 4. PDF AI
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'pdf-ai',
    'PDF AI',
    'AI-инструмент для извлечения и анализа информации из PDF-документов.',
    'PDF AI — специализированный GPT для работы с PDF-файлами. Позволяет загружать PDF-документы и задавать вопросы по их содержимому, извлекать ключевую информацию, создавать краткие резюме, находить конкретные данные в больших документах. Идеально подходит для анализа контрактов, отчётов, научных статей и технической документации.',
    ARRAY['PDF', 'Анализ документов', 'Извлечение данных', 'Резюмирование'],
    'Требуется подписка ChatGPT Plus. Ограничения на размер загружаемых файлов.',
    'https://chatgpt.com/g/g-dZyKGS17d-pdf-ai',
    '{"free_tier": false, "specialized": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 5. Microsoft Copilot
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'microsoft-copilot',
    'Microsoft Copilot',
    'AI-ассистент от Microsoft для работы с кодом, документами и повседневными задачами.',
    'Microsoft Copilot — интегрированный AI-помощник от Microsoft, работающий на базе GPT-5. Встроен в Windows, Microsoft 365 (Word, Excel, PowerPoint, Outlook, Teams), Visual Studio и браузер Edge. Помогает писать и редактировать документы, создавать презентации, анализировать данные в Excel, управлять почтой и календарём. Поддерживает поиск в интернете с актуальной информацией. Включает функции Computer Use для автоматизации действий в приложениях.',
    ARRAY['Программирование', 'Документы', 'Продуктивность', 'Microsoft 365', 'Автоматизация'],
    'Полный функционал требует подписки Microsoft 365 Copilot. Некоторые функции недоступны в бесплатной версии.',
    'https://copilot.microsoft.com/',
    '{"popular": true, "free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 6. NotebookLM
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'notebooklm',
    'NotebookLM',
    'Виртуальный исследовательский ассистент от Google для анализа сложных документов.',
    'NotebookLM от Google Labs — AI-инструмент для глубокого анализа документов на базе Gemini 3. Позволяет загружать PDF, Google Docs, веб-страницы, Google Slides и создавать "заземлённые" ответы на основе ваших материалов. Уникальная функция Audio Overviews превращает документы в подкаст-диалог двух AI-ведущих. Поддерживает создание флеш-карточек, тестов, инфографики и слайд-презентаций. Функция Video Overviews создаёт видео-объяснения с AI-озвучкой.',
    ARRAY['Исследования', 'Анализ документов', 'PDF', 'Обучение', 'Подкасты'],
    'Ограничения на количество источников в бесплатной версии. NotebookLM Plus требует подписку Google One AI Premium.',
    'https://notebooklm.google/',
    '{"popular": true, "free_tier": true, "google": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 7. Gamma
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'gamma',
    'Gamma',
    'AI-платформа для создания презентаций, документов и веб-страниц с помощью ИИ.',
    'Gamma — ведущая AI-платформа для визуального сторителлинга. Позволяет создавать профессиональные презентации, документы и веб-сайты просто описав идею текстом. Gamma 3.0 включает Gamma Agent — AI-партнёра, который исследует тему в интернете, добавляет цитаты, редактирует стили и даёт обратную связь. Smart Diagrams автоматически создаёт диаграммы из текстового описания. Поддерживает совместную работу в реальном времени и экспорт в PDF, PowerPoint, Google Slides.',
    ARRAY['Презентации', 'Дизайн', 'Веб-сайты', 'Документы', 'Визуализация'],
    'Бесплатный план ограничен 400 AI-кредитами. Расширенные функции требуют подписку Plus ($10/мес) или Pro ($20/мес).',
    'https://gamma.app/',
    '{"popular": true, "free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 8. Genspark
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'genspark',
    'Genspark',
    'Универсальный AI-воркспейс: презентации, таблицы, документы, чат и генерация медиа.',
    'Genspark — комплексная AI-платформа, объединяющая AI Slides, AI Sheets, AI Docs, AI Chat и генерацию изображений/видео в одном интерфейсе. AI Slides создаёт полные презентации с нуля, исследуя тему в интернете и добавляя релевантные визуалы и источники. Поддерживает импорт существующих PPTX-файлов как шаблонов. Функции Fix Layout и Polish Content автоматически исправляют вёрстку и улучшают контент. Экспорт в PowerPoint, PDF и публичные веб-ссылки.',
    ARRAY['Презентации', 'Документы', 'Таблицы', 'Генерация контента', 'Универсальный'],
    'Премиум-план около $25/месяц. Бесплатный план: 200 кредитов в день.',
    'https://www.genspark.ai/',
    '{"free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 9. Claude (обновление существующей записи)
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'claude',
    'Claude',
    'AI-ассистент от Anthropic для рутинных задач, анализа и программирования.',
    'Claude от Anthropic — продвинутый AI-ассистент, известный глубоким анализом и качественными ответами. Отлично справляется с программированием, написанием текстов, анализом документов и длинных материалов (контекст до 200K токенов). Claude 3.5 Sonnet и Claude Opus 4.5 — флагманские модели с улучшенным reasoning. Безопасен в использовании благодаря встроенным ограничениям от вредоносного контента. Идеален для рутинных рабочих задач и творческих проектов.',
    ARRAY['Программирование', 'Написание', 'Анализ', 'Исследования', 'Рутинные задачи'],
    'Бесплатный план имеет лимиты использования. Не умеет генерировать изображения. Нет доступа к интернету.',
    'https://claude.ai/new',
    '{"popular": true, "free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    categories = EXCLUDED.categories,
    limitations = EXCLUDED.limitations,
    external_url = EXCLUDED.external_url,
    updated_at = NOW();

-- 10. Perplexity AI (обновление существующей записи)
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'perplexity',
    'Perplexity AI',
    'AI-поисковик нового поколения с указанием источников и актуальной информацией.',
    'Perplexity AI — инновационный AI-поисковик, который даёт прямые ответы на вопросы с указанием источников вместо списка ссылок. Использует несколько AI-моделей (GPT-4, Claude, собственные модели) для генерации ответов. Проводит глубокий поиск по интернету в реальном времени. Функция Deep Research автоматически исследует тему и создаёт детальный отчёт. Идеален для исследований, проверки фактов и получения актуальной информации.',
    ARRAY['Поиск', 'Исследования', 'Факт-чекинг', 'Актуальная информация'],
    'Pro-план ($20/мес) для неограниченного доступа к продвинутым моделям. Бесплатный план имеет лимиты.',
    'https://www.perplexity.ai/',
    '{"popular": true, "free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    categories = EXCLUDED.categories,
    updated_at = NOW();

-- 11. Perplexity Comet
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'perplexity-comet',
    'Perplexity Comet',
    'AI-браузер от Perplexity с встроенным ассистентом, автоматизацией и персональными инструментами.',
    'Comet — AI-браузер на базе Chromium от Perplexity AI. Включает боковую панель с AI-ассистентом, который отвечает на вопросы о текущей странице, суммаризирует контент и помогает в навигации. Встроенный AI-поиск с указанием источников. Инструменты Discover (персонализированные новости), Spaces (организация проектов), Shopping (сравнение цен), Travel (планирование путешествий), Finance (бюджетирование). Max-подписчики получают email-ассистента и Background Assistants для асинхронных задач.',
    ARRAY['Браузер', 'Поиск', 'Продуктивность', 'Ассистент', 'Автоматизация'],
    'Полный функционал требует подписку Max. Comet Plus: $5/мес для AI-новостей. Доступен на Windows, macOS, Android.',
    'https://www.perplexity.ai/comet',
    '{"free_tier": true, "browser": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 12. Grok
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'grok',
    'Grok',
    'AI-чатбот от xAI с доступом к данным X (Twitter), генерацией изображений и видео.',
    'Grok — AI-ассистент от xAI (компания Илона Маска), работающий на моделях Grok 4 и Grok 4.1. Уникальная особенность — прямой доступ к данным социальной сети X (Twitter) в реальном времени. Поддерживает анализ корпоративной информации, создание инфографики, генерацию изображений и 6-секундных видеоклипов через Grok Imagine. Режим Heavy использует мультиагентную архитектуру для сложных задач. Контекстное окно до 2 млн токенов в версии Grok 4.1 Fast.',
    ARRAY['Чатбот', 'Социальные сети', 'Инфографика', 'Генерация медиа', 'Анализ'],
    'SuperGrok: $30/мес, SuperGrok Heavy: $300/мес. Бесплатный доступ ограничен через X Premium.',
    'https://grok.com/',
    '{"popular": true, "free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 13. Sora
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'sora',
    'Sora',
    'Революционный AI-генератор видео от OpenAI: создание видеороликов по текстовому описанию.',
    'Sora 2 — передовая модель генерации видео от OpenAI. Создаёт реалистичные видеоролики до 1080p и 20-25 секунд по текстовому описанию. Инструменты редактирования: Re-cut (обрезка и удлинение), Remix (изменение по описанию), Blend (переходы между видео), Loop (зацикливание). Функция Cameo позволяет добавлять реальных людей, животных и объекты в AI-сгенерированные сцены. Storyboards дают покадровый контроль над видео. Синхронизированные диалоги и звуковые эффекты.',
    ARRAY['Генерация видео', 'Креатив', 'Маркетинг', 'Контент', 'Анимация'],
    'Требуется ChatGPT Plus или Pro подписка. Plus: до 50 видео в месяц 480p/720p. Pro: 10x больше лимитов и выше разрешение.',
    'https://openai.com/sora',
    '{"popular": true, "free_tier": false}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 14. DALL-E (обновление существующей записи)
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'dall-e',
    'DALL-E',
    'AI-генератор изображений от OpenAI: создание картинок по текстовому описанию.',
    'DALL-E 3 — флагманская модель генерации изображений от OpenAI, интегрированная в ChatGPT. Создаёт высококачественные изображения по детальным текстовым описаниям. Отлично понимает сложные промпты и точно следует инструкциям. Подходит для создания иллюстраций, концепт-арта, маркетинговых материалов и визуализации идей. Поддерживает редактирование существующих изображений и вариации.',
    ARRAY['Генерация изображений', 'Дизайн', 'Арт', 'Маркетинг', 'Креатив'],
    'Лимитированное количество генераций в бесплатной версии. Полный доступ через ChatGPT Plus. Ограничения на контент.',
    'https://openai.com/dall-e',
    '{"popular": true, "free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    categories = EXCLUDED.categories,
    updated_at = NOW();

-- 15. DeepL Translator
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'deepl-translator',
    'DeepL Translator',
    'Высокоточный AI-переводчик с поддержкой 30+ языков и сохранением стиля текста.',
    'DeepL — ведущий AI-сервис машинного перевода, известный высоким качеством и естественностью переводов. Использует нейронные сети для понимания контекста и нюансов языка. Поддерживает перевод документов (Word, PowerPoint, PDF) с сохранением форматирования. DeepL Write помогает улучшить стиль и грамматику текста. Интеграция через API, браузерные расширения и десктоп-приложения. Превосходит Google Translate в качестве для многих языковых пар.',
    ARRAY['Перевод', 'Языки', 'Документы', 'Продуктивность'],
    'Бесплатная версия ограничена по объёму текста. Pro-план для API-доступа и расширенных функций.',
    'https://www.deepl.com/',
    '{"popular": true, "free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 16. Yandex.Translate
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'yandex-translate',
    'Yandex.Translate',
    'AI-переводчик от Яндекса с поддержкой казахского и других языков СНГ.',
    'Яндекс.Переводчик — бесплатный сервис машинного перевода от Яндекса. Особенно силён в переводе языков постсоветского пространства: русский, казахский, узбекский, украинский, белорусский и др. Поддерживает 100+ языков. Включает перевод текста, веб-страниц, документов и изображений. Функция перевода речи и диалогов в реальном времени. Интеграция с Яндекс Браузером для автоматического перевода страниц.',
    ARRAY['Перевод', 'Языки', 'Казахский', 'СНГ', 'Бесплатный'],
    'Некоторые языковые пары переводятся через английский. Качество варьируется для редких языков.',
    'https://translate.yandex.ru/',
    '{"free_tier": true, "regional": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 17. DeepSeek
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'deepseek',
    'DeepSeek',
    'Мощная AI-модель для анализа больших текстов и сложных рассуждений.',
    'DeepSeek — китайская AI-платформа с передовыми языковыми моделями. DeepSeek-V3.2 демонстрирует производительность уровня GPT-5 при значительно меньших затратах на обучение. Архитектура Mixture-of-Experts (MoE) активирует только релевантные части модели для эффективности. DeepSeek Sparse Attention (DSA) улучшает работу с длинными документами. Модель DeepSeekMath-V2 показала лучший результат на математической олимпиаде Putnam. Открытый исходный код под MIT лицензией.',
    ARRAY['LLM', 'Анализ текста', 'Математика', 'Программирование', 'Исследования'],
    'Данные хранятся в Китае. Заблокирован в некоторых государственных организациях США и других стран.',
    'https://www.deepseek.com/',
    '{"free_tier": true, "open_source": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 18. Gemini (Google)
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'gemini',
    'Gemini',
    'Мультимодальный AI-ассистент от Google с интеграцией в поиск и сервисы Google.',
    'Gemini — флагманский AI от Google, работающий на моделях Gemini 2.5 Pro/Flash и Gemini 3. Мультимодальный: понимает текст, изображения, аудио и видео. Глубоко интегрирован с сервисами Google: Gmail, Docs, Sheets, Drive, Maps. Функция Deep Research проводит комплексные исследования темы. Gemini Advanced доступен через Google One AI Premium ($20/мес). Отлично подходит для пользователей экосистемы Google.',
    ARRAY['Мультимодальный', 'Поиск', 'Google', 'Анализ', 'Продуктивность'],
    'Gemini Advanced требует подписку. Некоторые функции недоступны в России и СНГ.',
    'https://gemini.google.com/',
    '{"popular": true, "free_tier": true, "google": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 19. Suno AI
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'suno-ai',
    'Suno AI',
    'AI-генератор музыки и песен: создание полноценных треков с вокалом по текстовому описанию.',
    'Suno AI — революционная платформа для создания музыки с помощью ИИ. Генерирует полноценные песни с вокалом и инструментами по текстовому описанию стиля и настроения или по готовым текстам. Suno v4.5 поддерживает 1200+ музыкальных жанров, реалистичный вокал с вибрато и фразировкой, треки до 8 минут в качестве 44.1 kHz. Suno Studio — веб-DAW с AI-функциями. Можно загрузить инструментал и добавить AI-вокал. Интеграция с Microsoft Copilot.',
    ARRAY['Музыка', 'Генерация аудио', 'Креатив', 'Песни', 'Развлечения'],
    'Бесплатно: 10 песен в день. Есть юридические риски использования для коммерции.',
    'https://suno.com/',
    '{"popular": true, "free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 20. Ideogram
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'ideogram',
    'Ideogram',
    'AI-генератор изображений с лучшим в индустрии рендерингом текста на картинках.',
    'Ideogram — AI-платформа для генерации изображений, созданная бывшими инженерами Google. Уникальная специализация — чёткий и читаемый текст внутри изображений (точность 85-90%). Идеален для создания логотипов, постеров, маркетинговых материалов, типографики и мемов. Ideogram 3.0 поддерживает Style References (до 3 референсных изображений), Magic Prompt для улучшения промптов, работу с разными языками (латиница, испанский, французский, итальянский).',
    ARRAY['Генерация изображений', 'Логотипы', 'Типографика', 'Дизайн', 'Маркетинг'],
    'Бесплатный план ограничен. Сложности с нелатинскими алфавитами (китайский, арабский).',
    'https://ideogram.ai/',
    '{"free_tier": true, "specialized": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 21. Higgsfield AI
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'higgsfield',
    'Higgsfield AI',
    'AI-платформа для генерации видео и изображений с кинематографическими эффектами.',
    'Higgsfield AI — продвинутая платформа для создания AI-видео с фокусом на кинематографическое качество. Интегрирует лучшие модели: Sora 2, Veo 3.1, WAN 2.5, Kling, Minimax. Более 50 кинематографических пресетов камеры (zoom, pan, drone-съёмка). Продвинутая анимация персонажей: мимика, движения, эмоции. WAN 2.5 создаёт видео до 1080p с синхронизированным аудио. Инструменты: Create Image, Create Video, Edit Image, Kling Video Edit. Высококачественные пресеты упрощают получение профессионального результата.',
    ARRAY['Генерация видео', 'Генерация изображений', 'Анимация', 'Кинематограф', 'Креатив'],
    'Премиум-функции платные. Качество зависит от выбранной модели.',
    'https://higgsfield.ai/',
    '{"free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 22. Prompt Hackers
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'prompt-hackers',
    'Prompt Hackers',
    'База данных и генератор промптов для ChatGPT и других AI-моделей.',
    'Prompt Hackers — инструмент для создания эффективных промптов для ChatGPT и других AI-моделей. Бесплатный генератор промптов: указываете роль AI и задачу — получаете оптимизированный промпт. Обширная библиотека готовых промптов для разных сценариев: написание контента, бизнес-задачи, образование, программирование, техническая поддержка. Промпты созданы на основе обратной связи сообщества и постоянно улучшаются.',
    ARRAY['Промпты', 'Продуктивность', 'Обучение', 'ChatGPT', 'Утилиты'],
    'Контент на английском языке. Качество промптов варьируется.',
    'https://www.prompthackers.co/',
    '{"free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 23. Grammarly
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'grammarly',
    'Grammarly',
    'AI-ассистент для проверки грамматики, стиля и тона текста на английском языке.',
    'Grammarly — ведущий AI-инструмент для улучшения письменного английского. Проверяет грамматику, орфографию, пунктуацию, стиль и тон текста в реальном времени. Работает везде: браузеры, Microsoft Office, Google Docs, мобильные приложения. Premium-версия включает детальный анализ стиля, переписывание предложений, обнаружение плагиата и генерацию текста с помощью AI. Grammarly Business для команд с единым стилевым руководством.',
    ARRAY['Грамматика', 'Редактирование', 'Английский', 'Продуктивность', 'Написание'],
    'Оптимизирован для английского языка. Premium: $12/мес (годовая подписка).',
    'https://app.grammarly.com/',
    '{"popular": true, "free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 24. GPTZero
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'gptzero',
    'GPTZero',
    'Детектор AI-сгенерированного текста для выявления контента от ChatGPT, Claude и других моделей.',
    'GPTZero — ведущий инструмент для определения AI-сгенерированного текста. Определяет контент от ChatGPT, GPT-5, Claude, Gemini, Llama, DeepSeek и других моделей. Анализ на уровне предложений показывает вероятность AI-генерации для каждого фрагмента. Определяет "смешанный" контент (человек + AI). Защита от обхода: парафразинг, атаки омоглифами. Source Finder проверяет реальность цитат и ссылок. Origin Chrome Extension отслеживает авторство в Google Docs. Поддержка английского, немецкого, французского, испанского, португальского.',
    ARRAY['Детектор AI', 'Антиплагиат', 'Образование', 'Проверка контента', 'Безопасность'],
    'Бесплатно: 10000 слов/месяц. Не поддерживает PPT, XLS форматы.',
    'https://gptzero.me/',
    '{"popular": true, "free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 25. Excalidraw
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'excalidraw',
    'Excalidraw',
    'Бесплатная онлайн-доска для создания диаграмм и схем в стиле "от руки".',
    'Excalidraw — виртуальная доска с открытым исходным кодом для создания диаграмм, схем и иллюстраций в уникальном стиле "нарисовано от руки". Бесконечный холст, совместная работа в реальном времени с end-to-end шифрованием. Инструменты: прямоугольники, круги, стрелки, линии, свободное рисование, текст. Экспорт в PNG, SVG, сохранение в формате .excalidraw (JSON). Работает офлайн (PWA). Excalidraw+ включает голосовой чат, экспорт в PDF/PPTX и AI для создания диаграмм из текста.',
    ARRAY['Диаграммы', 'Whiteboard', 'Дизайн', 'Совместная работа', 'Бесплатный'],
    'Excalidraw+ (расширенные функции) платный. Стиль "от руки" подходит не для всех задач.',
    'https://excalidraw.com/',
    '{"popular": true, "free_tier": true, "open_source": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();

-- 26. Bolt.new
INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
VALUES (
    'bolt-new',
    'Bolt.new',
    'AI-платформа для создания веб- и мобильных приложений по текстовому описанию.',
    'Bolt.new от StackBlitz — революционная AI-платформа для разработки приложений. Создаёт полноценные full-stack приложения (frontend + backend + база данных) по текстовому описанию за минуты. Работает на Claude Agent и GPT-5. Технологии: React, Tailwind CSS, Node.js, Express, PostgreSQL, Prisma. WebContainers запускают Node.js прямо в браузере без серверов. Автоматическое создание базы данных с визуальным редактором. Интеграции: Supabase, Firebase, Stripe, GitHub, Expo (мобильные). Деплой одним кликом на bolt.host или собственный домен.',
    ARRAY['Разработка', 'No-code', 'Веб-приложения', 'Full-stack', 'Автоматизация'],
    'Бесплатно: 10M токенов/месяц. Pro: $20/мес. Сложные приложения могут требовать ручной доработки.',
    'https://bolt.new/',
    '{"popular": true, "free_tier": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    updated_at = NOW();


-- ============================================
-- ЧАСТЬ 2: ВСТАВКА НОВЫХ USE CASES
-- ============================================

-- Use Case 1: Генерация музыки и песен
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'generate-music',
    'Генерация музыки и песен',
    'Создание оригинальной музыки, песен с вокалом и инструментальных треков с помощью AI.',
    'Когда нужно создать фоновую музыку для видео, джингл для рекламы, демо-трек для презентации идеи, или полноценную песню для личного проекта.',
    'Контент-мейкеры, музыканты, маркетологи, подкастеры, геймдевелоперы'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    updated_at = NOW();

-- Use Case 2: Работа с PDF и документами
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'analyze-pdf-documents',
    'Анализ PDF и документов',
    'Извлечение информации, суммаризация и анализ содержимого PDF-файлов и документов с помощью AI.',
    'Когда нужно быстро понять суть длинного документа, найти конкретную информацию в контракте, создать резюме научной статьи или проанализировать отчёт.',
    'Юристы, исследователи, студенты, аналитики, менеджеры'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    updated_at = NOW();

-- Use Case 3: Генерация видео
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'generate-video',
    'Генерация видео по описанию',
    'Создание видеороликов, анимаций и визуального контента по текстовому описанию с помощью AI.',
    'Когда нужно создать рекламный ролик, визуализировать идею для презентации, сделать демо-видео продукта или анимацию для социальных сетей.',
    'Маркетологи, контент-мейкеры, рекламщики, продакт-менеджеры, SMM-специалисты'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    updated_at = NOW();

-- Use Case 4: Перевод текстов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'translate-content',
    'Перевод текстов и документов',
    'Высококачественный перевод текстов, документов и контента между различными языками с помощью AI.',
    'Когда нужно перевести документацию, локализовать контент для другого рынка, понять иноязычный текст или подготовить материалы на нескольких языках.',
    'Переводчики, контент-менеджеры, международные компании, исследователи, путешественники'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    updated_at = NOW();

-- Use Case 5: Исследования и поиск информации
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'research-information',
    'Исследование и поиск информации',
    'Глубокий поиск информации, исследование тем и создание обзоров с помощью AI-поисковиков.',
    'Когда нужно изучить новую тему, провести конкурентный анализ, проверить факты, подготовить исследовательский отчёт или найти актуальную информацию.',
    'Исследователи, аналитики, журналисты, студенты, маркетологи'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    updated_at = NOW();

-- Use Case 6: Проверка текста на AI
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'detect-ai-content',
    'Определение AI-сгенерированного текста',
    'Проверка текстов на предмет генерации искусственным интеллектом для обеспечения оригинальности контента.',
    'Когда нужно проверить студенческую работу, убедиться в оригинальности контента, верифицировать авторство текста или обнаружить AI-генерированный спам.',
    'Преподаватели, редакторы, HR-специалисты, контент-менеджеры, издатели'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    updated_at = NOW();

-- Use Case 7: Создание диаграмм и схем
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-diagrams',
    'Создание диаграмм и схем',
    'Визуализация идей, процессов и архитектуры с помощью диаграмм и интеллект-карт.',
    'Когда нужно визуализировать бизнес-процесс, нарисовать архитектуру системы, создать майндмэп для брейнсторма или объяснить сложную концепцию.',
    'Аналитики, архитекторы, менеджеры, разработчики, преподаватели'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    updated_at = NOW();

-- Use Case 8: Создание приложений без кода
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'build-apps-no-code',
    'Создание приложений без программирования',
    'Разработка веб- и мобильных приложений с помощью AI без написания кода или с минимальным кодированием.',
    'Когда нужно быстро создать прототип продукта, MVP для стартапа, внутренний инструмент для команды или автоматизировать рабочий процесс.',
    'Предприниматели, продакт-менеджеры, маркетологи, бизнес-аналитики, стартапы'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    updated_at = NOW();

-- Use Case 9: Работа с Excel и таблицами
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'automate-excel',
    'Автоматизация работы в Excel',
    'Генерация формул, анализ данных и массовые операции в электронных таблицах с помощью AI.',
    'Когда нужно создать сложную формулу, обработать большой массив данных, автоматизировать отчётность или провести анализ таблицы.',
    'Аналитики данных, финансисты, бухгалтеры, менеджеры, исследователи'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    updated_at = NOW();

-- Use Case 10: Улучшение текста и грамматики
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'improve-writing',
    'Улучшение текста и грамматики',
    'Проверка и улучшение грамматики, стиля и читаемости текстов на английском и других языках.',
    'Когда нужно написать профессиональное письмо, проверить грамматику статьи, улучшить стиль презентации или отредактировать документ.',
    'Все, кто пишет на английском, копирайтеры, студенты, бизнес-профессионалы'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    updated_at = NOW();

-- Use Case 11: Создание промптов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-prompts',
    'Создание эффективных промптов',
    'Генерация и оптимизация промптов для более качественных ответов от AI-моделей.',
    'Когда нужно получить лучший результат от ChatGPT, научиться формулировать запросы к AI, или найти готовые промпты для конкретной задачи.',
    'Все пользователи AI-инструментов, маркетологи, разработчики, контент-мейкеры'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    updated_at = NOW();

-- Use Case 12: Создание логотипов с текстом
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-logos-typography',
    'Создание логотипов и типографики',
    'Генерация изображений с чётким текстом, логотипов и типографического искусства с помощью AI.',
    'Когда нужно создать логотип для бренда, постер с текстом, типографическое оформление или маркетинговые материалы с надписями.',
    'Дизайнеры, маркетологи, предприниматели, SMM-специалисты, контент-мейкеры'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    updated_at = NOW();


-- ============================================
-- ЧАСТЬ 3: ВЫВОД СТАТИСТИКИ
-- ============================================

-- Подсчёт добавленных инструментов
SELECT 'Всего инструментов в базе:' as info, COUNT(*) as count FROM tools;

-- Подсчёт добавленных use cases
SELECT 'Всего use cases в базе:' as info, COUNT(*) as count FROM use_cases;

-- Список всех инструментов
SELECT slug, name, short_description FROM tools ORDER BY name;
