-- ============================================
-- SQL Script: Дополнительные Use Cases
-- Дата создания: 2025-12-26
-- Автор: Senior Data Analyst
-- Описание: Полный набор use cases для всех AI-инструментов
-- ============================================

-- ============================================
-- КОНТЕНТ И МАРКЕТИНГ
-- ============================================

-- 1. Создание контента для соцсетей
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-social-media-content',
    'Создание контента для соцсетей',
    'Генерация постов, сторис, карусель-контента и визуалов для Instagram, TikTok, LinkedIn, Telegram и других социальных сетей с помощью AI.',
    'Когда нужно регулярно публиковать контент в соцсетях, создать вовлекающие посты, подобрать хештеги, адаптировать контент под разные платформы или сгенерировать идеи для контент-плана.',
    'SMM-специалисты, маркетологи, блогеры, предприниматели, контент-менеджеры'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 2. Написание email-рассылок
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'write-email-campaigns',
    'Написание email-рассылок',
    'Создание эффективных email-кампаний: welcome-серии, промо-письма, триггерные рассылки, newsletters с помощью AI.',
    'Когда нужно написать цепочку писем для email-маркетинга, улучшить открываемость и кликабельность рассылок, персонализировать сообщения или создать шаблоны для автоматических писем.',
    'Email-маркетологи, CRM-специалисты, маркетологи, владельцы бизнеса'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 3. SEO-оптимизация контента
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'seo-content-optimization',
    'SEO-оптимизация контента',
    'Создание и оптимизация контента для поисковых систем: подбор ключевых слов, написание мета-тегов, структурирование статей для лучшего ранжирования.',
    'Когда нужно написать SEO-оптимизированную статью, улучшить позиции сайта в поиске, подобрать ключевые слова, создать мета-описания или проанализировать контент конкурентов.',
    'SEO-специалисты, контент-маркетологи, копирайтеры, владельцы сайтов'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 4. Создание рекламных креативов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-ad-creatives',
    'Создание рекламных креативов',
    'Генерация визуальных и текстовых материалов для рекламных кампаний: баннеры, объявления, рекламные видеоролики, посты для таргетинга.',
    'Когда нужно быстро создать рекламные баннеры, написать тексты объявлений для контекстной рекламы, подготовить креативы для A/B тестов или сгенерировать видео для рекламы.',
    'Таргетологи, PPC-специалисты, дизайнеры, маркетологи, рекламные агентства'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 5. Генерация идей и брейншторм
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'brainstorm-ideas',
    'Генерация идей и брейншторм',
    'Использование AI для креативного брейнсторминга: генерация идей для продуктов, названий, слоганов, стратегий и нестандартных решений.',
    'Когда нужно придумать название для продукта или бренда, найти нестандартное решение проблемы, сгенерировать идеи для контента или провести мозговой штурм без команды.',
    'Предприниматели, продакт-менеджеры, креативные директора, маркетологи, стартаперы'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 6. Написание сценариев для видео
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'write-video-scripts',
    'Написание сценариев для видео',
    'Создание сценариев для YouTube-видео, рекламных роликов, обучающих курсов, подкастов и корпоративных видеоматериалов с помощью AI.',
    'Когда нужно написать сценарий для видео, структурировать контент для YouTube-канала, подготовить текст для озвучки или создать раскадровку.',
    'Видеографы, блогеры, контент-мейкеры, маркетологи, продюсеры'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 7. Разработка контент-стратегии
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'develop-content-strategy',
    'Разработка контент-стратегии',
    'Планирование контент-маркетинга: создание контент-плана, определение тем и форматов, анализ аудитории и конкурентного контента.',
    'Когда нужно разработать контент-стратегию на месяц/квартал, определить темы для блога, спланировать публикации или проанализировать эффективность текущего контента.',
    'Контент-стратеги, CMO, маркетологи, главные редакторы'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 8. Мониторинг репутации и упоминаний
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'reputation-monitoring',
    'Мониторинг репутации и упоминаний',
    'Отслеживание упоминаний бренда в социальных сетях и СМИ, анализ тональности отзывов, выявление репутационных рисков.',
    'Когда нужно отследить, что говорят о бренде в интернете, проанализировать отзывы клиентов, выявить негативные тренды или оценить эффект PR-кампании.',
    'PR-специалисты, бренд-менеджеры, маркетологи, руководители'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- ============================================
-- БИЗНЕС-ПРОЦЕССЫ
-- ============================================

-- 9. Подготовка к совещаниям
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'prepare-for-meetings',
    'Подготовка к совещаниям',
    'Сбор информации, подготовка повестки, создание презентаций и брифингов для эффективных рабочих встреч с помощью AI.',
    'Когда нужно быстро подготовиться к встрече, собрать информацию о теме обсуждения, создать повестку, подготовить talking points или сделать резюме предыдущих встреч.',
    'Менеджеры, руководители, аналитики, консультанты'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 10. Анализ конкурентов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'competitor-analysis',
    'Анализ конкурентов',
    'Исследование конкурентов: их продукты, цены, маркетинговые стратегии, позиционирование и слабые места.',
    'Когда нужно понять конкурентную среду, выявить преимущества и недостатки конкурентов, найти рыночные возможности или подготовить конкурентный анализ для инвесторов.',
    'Продакт-менеджеры, маркетологи, стратеги, бизнес-аналитики, основатели стартапов'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 11. Создание бизнес-отчётов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-business-reports',
    'Создание бизнес-отчётов',
    'Автоматизация создания регулярных отчётов: аналитические дашборды, KPI-отчёты, финансовые сводки и операционные обзоры.',
    'Когда нужно подготовить ежемесячный отчёт для руководства, визуализировать бизнес-показатели, автоматизировать рутинную отчётность или создать презентацию результатов.',
    'Бизнес-аналитики, финансисты, операционные менеджеры, руководители'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 12. Подготовка коммерческих предложений
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-commercial-proposals',
    'Подготовка коммерческих предложений',
    'Создание персонализированных коммерческих предложений, КП, proposal документов для клиентов с помощью AI.',
    'Когда нужно быстро подготовить коммерческое предложение, персонализировать шаблон под конкретного клиента, обосновать ценность решения или улучшить структуру КП.',
    'Менеджеры по продажам, аккаунт-менеджеры, предприниматели, консультанты'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 13. Анализ обратной связи клиентов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'analyze-customer-feedback',
    'Анализ обратной связи клиентов',
    'Обработка и анализ отзывов клиентов, NPS-опросов, тикетов поддержки для выявления инсайтов и улучшения продукта.',
    'Когда нужно проанализировать большой объём отзывов, выявить частые жалобы, определить драйверы удовлетворённости или подготовить отчёт Voice of Customer.',
    'Продакт-менеджеры, CX-специалисты, аналитики, служба поддержки'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 14. Анализ рыночных трендов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'market-trend-analysis',
    'Анализ рыночных трендов',
    'Исследование рыночных тенденций, emerging technologies, изменений в поведении потребителей и прогнозирование развития рынка.',
    'Когда нужно понять куда движется рынок, выявить новые возможности для бизнеса, оценить перспективность направления или подготовить рыночный обзор.',
    'Стратеги, аналитики, инвесторы, руководители, продакт-менеджеры'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 15. Финансовое моделирование
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'financial-modeling',
    'Финансовое моделирование',
    'Создание финансовых моделей, прогнозов, unit-экономики и сценарного анализа с помощью AI и таблиц.',
    'Когда нужно построить финансовую модель для стартапа, рассчитать unit-экономику, смоделировать различные сценарии развития или подготовить финансовые прогнозы для инвесторов.',
    'Финансовые аналитики, CFO, основатели стартапов, инвестиционные аналитики'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 16. Due diligence и проверка компаний
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'due-diligence',
    'Due diligence и проверка компаний',
    'Комплексная проверка компаний перед сделкой: анализ финансов, репутации, юридических рисков и рыночной позиции.',
    'Когда нужно оценить компанию перед инвестицией или поглощением, проверить надёжность поставщика, изучить потенциального партнёра или провести background check.',
    'Инвесторы, M&A специалисты, юристы, закупщики, руководители'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- ============================================
-- РАЗРАБОТКА И IT
-- ============================================

-- 17. Код-ревью и отладка
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'code-review-debugging',
    'Код-ревью и отладка',
    'Анализ кода на ошибки, уязвимости и возможности оптимизации, помощь в отладке и рефакторинге.',
    'Когда нужно найти баг в коде, провести ревью pull request, оптимизировать производительность, улучшить читаемость кода или найти security-уязвимости.',
    'Разработчики, тимлиды, DevOps-инженеры, QA-инженеры'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 18. Создание технической документации
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-technical-docs',
    'Создание технической документации',
    'Написание API-документации, README, архитектурных описаний, руководств пользователя и технических спецификаций.',
    'Когда нужно задокументировать API, написать README для проекта, создать руководство по установке, описать архитектуру системы или подготовить техническое задание.',
    'Разработчики, технические писатели, архитекторы, DevRel-специалисты'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 19. Прототипирование интерфейсов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'prototype-interfaces',
    'Прототипирование интерфейсов',
    'Быстрое создание прототипов веб- и мобильных интерфейсов, wireframes и интерактивных макетов.',
    'Когда нужно быстро визуализировать идею продукта, создать wireframe для обсуждения с командой, построить кликабельный прототип или протестировать UX-гипотезу.',
    'UX/UI дизайнеры, продакт-менеджеры, разработчики, предприниматели'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 20. Архитектурное проектирование
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'architecture-design',
    'Архитектурное проектирование систем',
    'Проектирование архитектуры ПО: выбор технологий, создание диаграмм, описание микросервисов и интеграций.',
    'Когда нужно спроектировать архитектуру нового сервиса, выбрать технологический стек, нарисовать C4-диаграмму или описать взаимодействие компонентов системы.',
    'Архитекторы ПО, тимлиды, senior-разработчики, CTO'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 21. Автоматизация DevOps
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'devops-automation',
    'Автоматизация DevOps',
    'Создание CI/CD пайплайнов, Dockerfile, конфигураций Kubernetes, скриптов автоматизации и IaC.',
    'Когда нужно настроить автоматический деплой, написать GitHub Actions workflow, создать Docker-конфигурацию или автоматизировать инфраструктуру.',
    'DevOps-инженеры, SRE, разработчики, системные администраторы'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- ============================================
-- ОБРАЗОВАНИЕ
-- ============================================

-- 22. Подготовка учебных материалов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-educational-content',
    'Подготовка учебных материалов',
    'Создание лекций, курсов, учебных пособий, методических материалов и образовательного контента с помощью AI.',
    'Когда нужно разработать программу курса, создать конспект лекции, подготовить раздаточные материалы или адаптировать контент под разные уровни подготовки.',
    'Преподаватели, методисты, создатели курсов, корпоративные тренеры'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 23. Создание тестов и квизов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-tests-quizzes',
    'Создание тестов и квизов',
    'Генерация тестовых вопросов, викторин, флеш-карточек и проверочных заданий для оценки знаний.',
    'Когда нужно создать тест для проверки знаний студентов, подготовить квиз для вовлечения аудитории, сгенерировать флеш-карточки для запоминания или создать экзаменационные вопросы.',
    'Преподаватели, HR-специалисты, контент-мейкеры, методисты'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 24. Объяснение сложных концепций
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'explain-complex-concepts',
    'Объяснение сложных концепций',
    'Упрощение и объяснение сложных тем: научных теорий, технических процессов, финансовых механизмов доступным языком.',
    'Когда нужно объяснить сложную тему простыми словами, подготовить аналогии для обучения, разобраться в новой области или создать понятное объяснение для клиента.',
    'Преподаватели, менторы, технические специалисты, журналисты, консультанты'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 25. Подготовка к экзаменам
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'exam-preparation',
    'Подготовка к экзаменам',
    'Помощь в подготовке к экзаменам: структурирование материала, создание планов изучения, проверка знаний и разбор сложных тем.',
    'Когда нужно систематизировать материал для экзамена, создать план подготовки, разобрать сложные вопросы или проверить понимание темы.',
    'Студенты, школьники, соискатели сертификаций, абитуриенты'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 26. Проверка академической честности
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'academic-integrity-check',
    'Проверка академической честности',
    'Определение AI-генерированного контента и плагиата в студенческих работах для обеспечения честности обучения.',
    'Когда нужно проверить оригинальность студенческой работы, выявить использование AI для написания эссе, проверить на плагиат или верифицировать авторство.',
    'Преподаватели, научные руководители, редакторы научных журналов, администрация вузов'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- ============================================
-- HR И УПРАВЛЕНИЕ
-- ============================================

-- 27. Написание вакансий
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'write-job-descriptions',
    'Написание вакансий',
    'Создание привлекательных и информативных описаний вакансий, оптимизированных для привлечения нужных кандидатов.',
    'Когда нужно написать описание новой позиции, улучшить существующую вакансию для лучшего отклика, адаптировать описание под разные площадки или создать шаблоны вакансий.',
    'HR-специалисты, рекрутеры, нанимающие менеджеры, руководители'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 28. Подготовка onboarding материалов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-onboarding-materials',
    'Подготовка onboarding материалов',
    'Создание программы адаптации новых сотрудников: welcome-книга, чек-листы, обучающие материалы и справочники.',
    'Когда нужно разработать программу онбординга, создать welcome-пакет для новичков, подготовить обучающие материалы или систематизировать корпоративные знания.',
    'HR-специалисты, L&D менеджеры, руководители команд, основатели стартапов'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 29. Проведение performance review
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'performance-review',
    'Проведение performance review',
    'Подготовка и проведение оценки эффективности сотрудников: формулирование обратной связи, постановка целей, написание характеристик.',
    'Когда нужно подготовить ревью для подчинённых, сформулировать конструктивную обратную связь, написать характеристику сотрудника или поставить цели на следующий период.',
    'Руководители, HR-специалисты, тимлиды, менеджеры'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 30. Создание корпоративных политик
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-corporate-policies',
    'Создание корпоративных политик',
    'Разработка внутренних политик компании: регламенты, процедуры, кодексы поведения, политики безопасности.',
    'Когда нужно разработать политику удалённой работы, создать кодекс этики, написать процедуру согласования или обновить внутренние регламенты.',
    'HR-специалисты, юристы, compliance-офицеры, руководители, основатели'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 31. Планирование развития сотрудников
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'employee-development-planning',
    'Планирование развития сотрудников',
    'Создание индивидуальных планов развития (IDP), карьерных треков, программ обучения и развития компетенций.',
    'Когда нужно составить план развития для сотрудника, определить карьерный путь, выявить gaps в компетенциях или подобрать обучающие программы.',
    'HR-специалисты, руководители, L&D менеджеры, менторы'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- ============================================
-- ЮРИДИЧЕСКИЕ ЗАДАЧИ
-- ============================================

-- 32. Анализ контрактов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'analyze-contracts',
    'Анализ контрактов и договоров',
    'Анализ юридических документов: выявление рисков, ключевых условий, сравнение версий договоров.',
    'Когда нужно быстро понять суть контракта, выявить невыгодные условия, сравнить два варианта договора или подготовить резюме ключевых пунктов.',
    'Юристы, менеджеры по закупкам, предприниматели, руководители'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 33. Составление юридических документов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'draft-legal-documents',
    'Составление юридических документов',
    'Подготовка проектов юридических документов: договоров, NDA, политик конфиденциальности, terms of service.',
    'Когда нужно подготовить черновик договора, создать NDA, написать политику конфиденциальности или пользовательское соглашение.',
    'Юристы, предприниматели, стартаперы, менеджеры'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 34. Правовые исследования
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'legal-research',
    'Правовые исследования',
    'Поиск и анализ законодательства, судебной практики, правовых прецедентов и регуляторных требований.',
    'Когда нужно найти релевантное законодательство, изучить судебную практику по вопросу, понять регуляторные требования или подготовить правовое заключение.',
    'Юристы, compliance-специалисты, аналитики, исследователи'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- ============================================
-- ПРОДАЖИ
-- ============================================

-- 35. Создание pitch deck презентаций
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-pitch-deck',
    'Создание pitch deck презентаций',
    'Подготовка презентаций для инвесторов, клиентов и партнёров: структура, контент, визуальное оформление.',
    'Когда нужно подготовить презентацию для инвесторов, создать pitch для клиента, структурировать историю продукта или улучшить существующий deck.',
    'Основатели стартапов, sales-менеджеры, BD-менеджеры, маркетологи'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 36. Персонализация коммуникаций с клиентами
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'personalize-client-communication',
    'Персонализация коммуникаций с клиентами',
    'Создание персонализированных писем, предложений и сообщений для клиентов на основе их данных и контекста.',
    'Когда нужно написать персональное письмо важному клиенту, подготовить индивидуальное предложение, создать follow-up после встречи или персонализировать массовую рассылку.',
    'Sales-менеджеры, аккаунт-менеджеры, customer success, предприниматели'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 37. Создание демо-видео продукта
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-product-demo-video',
    'Создание демо-видео продукта',
    'Создание видеопрезентаций продукта: демо-ролики, explainer-видео, обучающие туториалы.',
    'Когда нужно показать продукт в действии, создать видео для лендинга, подготовить демо для клиента или сделать обучающий ролик.',
    'Продакт-менеджеры, маркетологи, sales-менеджеры, основатели'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 38. Подготовка ответов на тендеры
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'prepare-tender-responses',
    'Подготовка ответов на тендеры',
    'Создание документации для участия в тендерах: технические предложения, ответы на RFP/RFI, презентации решений.',
    'Когда нужно подготовить ответ на тендер, написать техническое предложение, заполнить RFP или создать презентацию решения для госзаказчика.',
    'Тендерные специалисты, presale-менеджеры, руководители проектов, BD-менеджеры'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- ============================================
-- ЛИЧНАЯ ПРОДУКТИВНОСТЬ
-- ============================================

-- 39. Подготовка резюме и CV
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'prepare-resume-cv',
    'Подготовка резюме и CV',
    'Создание и улучшение резюме: структурирование опыта, подбор ключевых слов, адаптация под вакансию.',
    'Когда нужно написать резюме с нуля, улучшить существующее CV, адаптировать резюме под конкретную вакансию или перевести на другой язык.',
    'Соискатели работы, карьерные консультанты, студенты, профессионалы'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 40. Написание сопроводительных писем
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'write-cover-letters',
    'Написание сопроводительных писем',
    'Создание убедительных cover letter для откликов на вакансии, грантов, программ и возможностей.',
    'Когда нужно написать мотивационное письмо для вакансии, подать заявку на программу, откликнуться на грант или написать письмо-представление.',
    'Соискатели работы, студенты, исследователи, предприниматели'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 41. Планирование и тайм-менеджмент
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'planning-time-management',
    'Планирование и тайм-менеджмент',
    'Организация личного времени: создание планов, приоритизация задач, декомпозиция проектов, формирование привычек.',
    'Когда нужно спланировать рабочую неделю, разбить большой проект на задачи, определить приоритеты или создать систему личной продуктивности.',
    'Все профессионалы, предприниматели, студенты, менеджеры'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 42. Изучение новых навыков
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'learn-new-skills',
    'Изучение новых навыков',
    'Самообразование с помощью AI: создание учебных планов, объяснение концепций, практика и обратная связь.',
    'Когда нужно освоить новый навык, разобраться в сложной теме, создать персональный план обучения или получить ответы на вопросы в процессе учёбы.',
    'Все, кто учится, профессионалы, студенты, карьерные переключенцы'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- ============================================
-- ДОПОЛНИТЕЛЬНЫЕ СПЕЦИАЛИЗИРОВАННЫЕ СЦЕНАРИИ
-- ============================================

-- 43. Создание подкастов и аудиоконтента
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-podcasts-audio',
    'Создание подкастов и аудиоконтента',
    'Производство аудиоконтента: написание сценариев подкастов, генерация подкаст-стиля обсуждений, создание аудио-резюме документов.',
    'Когда нужно превратить материал в формат подкаста, создать аудиоверсию статьи, сгенерировать обсуждение темы или написать сценарий для аудиошоу.',
    'Подкастеры, контент-мейкеры, маркетологи, образовательные платформы'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 44. Анализ социальных сетей
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'social-media-analysis',
    'Анализ социальных сетей',
    'Мониторинг и анализ активности в социальных сетях: тренды, вовлечённость, настроения аудитории, viral-контент.',
    'Когда нужно понять, что обсуждают в соцсетях, выявить trending topics, проанализировать реакцию на кампанию или найти инфлюенсеров.',
    'SMM-специалисты, маркетологи, PR-специалисты, аналитики'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 45. Создание инфографики
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-infographics',
    'Создание инфографики',
    'Визуализация данных и информации в виде инфографики: статистика, процессы, сравнения, таймлайны.',
    'Когда нужно представить данные наглядно, создать визуальное резюме отчёта, объяснить процесс графически или подготовить материал для соцсетей.',
    'Маркетологи, дизайнеры, аналитики, журналисты, преподаватели'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 46. Локализация продукта
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'product-localization',
    'Локализация продукта',
    'Адаптация продукта для разных рынков: перевод интерфейса, локализация контента, культурная адаптация.',
    'Когда нужно выйти на новый географический рынок, перевести приложение, адаптировать маркетинговые материалы или локализовать документацию.',
    'Продакт-менеджеры, локализаторы, маркетологи, разработчики'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 47. Написание пресс-релизов
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'write-press-releases',
    'Написание пресс-релизов',
    'Создание пресс-релизов, медиа-питчей и PR-материалов для освещения новостей компании.',
    'Когда нужно анонсировать новый продукт, сообщить о достижении компании, подготовить материал для СМИ или написать питч для журналиста.',
    'PR-специалисты, маркетологи, основатели, пресс-секретари'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 48. Создание чат-ботов и FAQ
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'create-chatbots-faq',
    'Создание чат-ботов и FAQ',
    'Разработка скриптов для чат-ботов, создание базы знаний и FAQ для автоматизации поддержки клиентов.',
    'Когда нужно автоматизировать ответы на частые вопросы, создать базу знаний для продукта, написать сценарии для чат-бота или улучшить self-service.',
    'Специалисты поддержки, продакт-менеджеры, разработчики, CX-специалисты'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 49. Подготовка грантов и заявок
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'prepare-grant-applications',
    'Подготовка грантов и заявок',
    'Написание заявок на гранты, конкурсы, акселераторы и программы поддержки.',
    'Когда нужно подать заявку на грант, написать application для акселератора, подготовить документы для программы поддержки или оформить научную заявку.',
    'Исследователи, основатели стартапов, НКО, учёные, предприниматели'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();

-- 50. Медицинские и научные исследования
INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
VALUES (
    'medical-scientific-research',
    'Медицинские и научные исследования',
    'Анализ научной литературы, обзор исследований, поиск клинических данных и подготовка научных материалов.',
    'Когда нужно провести литературный обзор, найти релевантные исследования, проанализировать научные данные или подготовить обзорную статью.',
    'Исследователи, врачи, учёные, аспиранты, медицинские специалисты'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    when_to_use = EXCLUDED.when_to_use,
    audience = EXCLUDED.audience,
    updated_at = NOW();


-- ============================================
-- СТАТИСТИКА
-- ============================================

SELECT 'Всего use cases в базе:' as info, COUNT(*) as count FROM use_cases;

-- Вывод всех use cases
SELECT slug, title FROM use_cases ORDER BY title;
