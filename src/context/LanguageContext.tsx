"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Language = "ru" | "kk";

type TranslationParams = Record<string, string | number>;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.ru, params?: TranslationParams) => string;
};

const translations = {
  ru: {
    navPractice: "Пробные тесты",
    navQuestionBank: "Банк вопросов",
    navScoreCalculator: "Калькулятор баллов",
    navScorePredictor: "Прогноз баллов",
    navReviews: "Отзывы",
    navSignIn: "Войти",
    timerPrefix: "До {label}:",
    timerDays: "д",
    timerHours: "ч",
    timerMinutes: "м",
    timerSeconds: "с",
    heroBadge: "MVP для 5–6 классов",
    heroTitle: "Готовьтесь к НИШ, БИЛ и РФМШ умнее.",
    heroBody:
      "BilimBridge объединяет пробные тесты, банк вопросов и аналитику в одной удобной платформе для школьников Казахстана.",
    heroCtaPractice: "Начать практику",
    heroCtaQuestionBank: "Открыть банк вопросов",
    feature1Title: "Точная подготовка",
    feature1Body: "Короткие уроки и практика по НИШ, БИЛ и РФМШ.",
    feature2Title: "Понятный прогресс",
    feature2Body: "Сразу видно, что получается, а где нужно больше практики.",
    feature3Title: "Удобно родителям",
    feature3Body: "Простые отчеты и результаты для родителей.",
    sectionBadge: "Готово к тренировкам",
    sectionTitle: "Все, что нужно для регулярной подготовки.",
    sectionCalculator: "Калькулятор баллов",
    sectionPredictor: "Прогноз баллов",
    examNisTitle: "Поступление в НИШ",
    examNisDetail: "База по математике и логике",
    examNisBadge: "База",
    examBilTitle: "Поступление в БИЛ",
    examBilDetail: "Скорость и точность",
    examBilBadge: "Пробный",
    examRfmshTitle: "Отбор в РФМШ",
    examRfmshDetail: "Углубленные задания",
    examRfmshBadge: "Скоро",
    instructionsTitle: "Инструкции и структура экзаменов",
    nisTitle: "Структура экзамена НИШ",
    nisDay1Title: "День 1 (Естественно-математическое направление)",
    nisDay1Item1: "Математика: 40 вопросов, 1 час (максимум 400 баллов).",
    nisDay1Item2:
      "Количественные характеристики: 60 вопросов, 30 минут (максимум 300 баллов).",
    nisDay1Item3: "Естествознание: 20 вопросов, 30 минут (максимум 200 баллов).",
    nisDay2Title: "День 2 (Языковое направление)",
    nisDay2Item1: "Казахский язык: 20 вопросов, 40 минут.",
    nisDay2Item2: "Русский язык: 20 вопросов, 40 минут.",
    nisDay2Item3: "Английский язык: 20 вопросов, 40 минут.",
    nisDay2Note: "Каждый языковой тест оценивается максимум в 200 баллов.",
    bilTitle: "БИЛ",
    bilRoundTitle: "1 тур (Отборочный)",
    bilIntro: "Это общее тестирование для проверки базовых знаний и логики.",
    bilItem1: "Количество вопросов: 60 вопросов.",
    bilItem2:
      "Предметы: Математика и Логика — 50 вопросов; Грамотность чтения — 10 вопросов (на языке обучения — казахском или русском).",
    bilItem3: "Время: 110 минут.",
    bilItem4:
      "Система баллов: За правильный ответ — +4 балла, за неправильный — минус 1 балл (метод штрафных баллов).",
    rfmshTitle: "Формат экзамена (РФМШ)",
    rfmshItem1: "Дисциплины: Математика и логика.",
    rfmshItem2:
      "Тип заданий: «Открытый тест» — без вариантов ответа. Ответ нужно вписать самостоятельно.",
    rfmshItem3: "Количество заданий: 30 вопросов.",
    rfmshItem4: "Длительность: 120 минут (2 часа).",
    rfmshScoreTitle: "Сложность и баллы (всего 150 баллов)",
    rfmshScoreItem1: "10 задач уровня A (базовые) — по 3 балла.",
    rfmshScoreItem2: "10 задач уровня B (средние) — по 5 баллов.",
    rfmshScoreItem3: "10 задач уровня C (сложные) — по 7 баллов.",
    footerAbout:
      "Подготовка к НИШ, БИЛ и РФМШ с пробными тестами и понятным прогрессом.",
    footerServices: "Сервисы",
    footerResources: "Материалы",
    footerContacts: "Контакты",
    footerServicePractice: "Пробные тесты",
    footerServiceBank: "Банк вопросов",
    footerServiceCalculator: "Калькулятор баллов",
    footerServicePredictor: "Прогноз баллов",
    footerServiceReviews: "Отзывы",
    footerResourceTips: "Советы по экзаменам",
    footerResourcePlan: "План занятий на неделю",
    footerResourceParents: "Памятка для родителей",
    footerContactInstagram: "Instagram — скоро",
    footerContactTelegram: "Telegram — скоро",
    footerContactEmail: "Почта: hello@bilimbridge.kz",
    practiceTitle: "Пробные тесты",
    practiceSubtitle: "Отвечайте на вопросы и следите за прогрессом. Данные учебные.",
    practiceProgress: "Прогресс",
    practiceBack: "Назад",
    practiceNext: "Дальше",
    practiceResults: "Результаты",
    practiceTotal: "Всего вопросов",
    practiceCorrect: "Правильно",
    practiceIncorrect: "Неправильно",
    questionPrompt: "Выберите ответ",
    reviewsTitle: "Отзывы",
    reviewsSubtitle: "Поделитесь отзывом, чтобы улучшить проект.",
    reviewsLeave: "Оставить отзыв",
    reviewsNamePlaceholder: "Ваше имя",
    reviewsMessagePlaceholder: "Что улучшить в первую очередь?",
    reviewsSend: "Отправить",
    scoreCalcTitle: "Калькулятор баллов",
    scoreCalcSubtitle: "Правила БИЛ: +4 за правильный, −1 за неправильный, 0 за пропуск.",
    scoreCalcCorrect: "Правильные ответы",
    scoreCalcIncorrect: "Неправильные ответы",
    scoreCalcSkipped: "Пропущенные вопросы",
    scoreCalcEstimate: "Оценка баллов",
    scoreCalcPoints: "{value} баллов",
    scoreCalcTotal: "Всего отвечено",
    scoreCalcSkippedLabel: "Пропущено",
    scoreCalcTip:
      "Старайтесь меньше пропускать и отвечать точнее, чтобы набрать больше.",
    scorePredictTitle: "Прогноз баллов",
    scorePredictSubtitle: "Оцените результат по вашей недавней точности.",
    scorePredictAccuracy: "Точность (%) за последнее время",
    scorePredictTotalQuestions: "Всего вопросов в тесте",
    scorePredictOutcome: "Прогноз",
    scorePredictPoints: "{value} баллов",
    scorePredictCorrect: "Правильно",
    scorePredictIncorrect: "Неправильно",
    scorePredictTip: "Используйте это, чтобы поставить реальную цель на следующий тест.",
    bankTitle: "Банк вопросов",
    bankSubtitle: "Выберите раздел. Контент пополняется каждую неделю.",
    bankQuestions: "{value} вопросов",
    bankOpen: "Открыть",
    categoryArithmetic: "Арифметика",
    categoryArithmeticDesc: "Дроби, проценты и быстрые вычисления.",
    categoryAlgebra: "Основы алгебры",
    categoryAlgebraDesc: "Линейные уравнения и простые задачи.",
    categoryLogic: "Логика и закономерности",
    categoryLogicDesc: "Последовательности, головоломки и тренировка мышления.",
    categoryGeometry: "Геометрия",
    categoryGeometryDesc: "Фигуры, углы и пространственное мышление.",
    authTitle: "Вход",
    authSubtitle: "Вход через Google включен для проверки MVP.",
    authContinue: "Продолжить с Google",
    authBody: "Войдите, чтобы сохранять прогресс и синхронизировать устройство.",
    authFooter: "Полная интеграция OAuth будет добавлена после проверки MVP.",
    authLoading: "Загружаем вход...",
    authAvatarAlt: "Аватар пользователя",
    authStudent: "Ученик",
    authSignOut: "Выйти",
    authSignInGoogle: "Войти через Google",
    authError: "Ошибка: {error}",
    reviewName1: "Айгерим К.",
    reviewMessage1: "Пробные тесты похожи на реальные, все понятно и удобно.",
    reviewName2: "Родитель 6-классника",
    reviewMessage2: "Простой интерфейс и понятный прогресс. Хотим больше математики.",
  },
  kk: {
    navPractice: "Сынақ тесттері",
    navQuestionBank: "Сұрақтар банкі",
    navScoreCalculator: "Ұпай калькуляторы",
    navScorePredictor: "Ұпай болжамы",
    navReviews: "Пікірлер",
    navSignIn: "Кіру",
    timerPrefix: "Келесі {label}:",
    timerDays: "к",
    timerHours: "сағ",
    timerMinutes: "мин",
    timerSeconds: "с",
    heroBadge: "5–6 сыныптарға арналған MVP",
    heroTitle: "НИШ, БИЛ және РФМШ емтихандарына ақылды дайындалыңыз.",
    heroBody:
      "BilimBridge сынақ тесттерін, сұрақтар банкін және талдауды бір ыңғайлы платформада біріктіреді.",
    heroCtaPractice: "Жаттығуды бастау",
    heroCtaQuestionBank: "Сұрақтар банкін ашу",
    feature1Title: "Нақты дайындық",
    feature1Body: "НИШ, БИЛ және РФМШ бойынша қысқа сабақтар мен жаттығулар.",
    feature2Title: "Түсінікті прогресс",
    feature2Body: "Не жақсы, қай жерде көбірек жаттығу керек екенін көріңіз.",
    feature3Title: "Ата-аналарға ыңғайлы",
    feature3Body: "Қарапайым есептер мен нәтижелер.",
    sectionBadge: "Жаттығуға дайын",
    sectionTitle: "Тұрақты дайындыққа керек нәрсенің бәрі.",
    sectionCalculator: "Ұпай калькуляторы",
    sectionPredictor: "Ұпай болжамы",
    examNisTitle: "НИШ-ке түсу",
    examNisDetail: "Математика және логика негіздері",
    examNisBadge: "Негізгі",
    examBilTitle: "БИЛ-ге түсу",
    examBilDetail: "Жылдамдық пен дәлдік",
    examBilBadge: "Сынақ",
    examRfmshTitle: "РФМШ іріктеуі",
    examRfmshDetail: "Күрделі тапсырмалар",
    examRfmshBadge: "Жақында",
    instructionsTitle: "Емтихан нұсқаулары мен құрылымы",
    nisTitle: "НИШ емтиханының құрылымы",
    nisDay1Title: "1-күн (Жаратылыстану-математикалық бағыт)",
    nisDay1Item1: "Математика: 40 сұрақ, 1 сағат (ең көбі 400 ұпай).",
    nisDay1Item2:
      "Сандық сипаттамалар: 60 сұрақ, 30 минут (ең көбі 300 ұпай).",
    nisDay1Item3: "Жаратылыстану: 20 сұрақ, 30 минут (ең көбі 200 ұпай).",
    nisDay2Title: "2-күн (Тілдік бағыт)",
    nisDay2Item1: "Қазақ тілі: 20 сұрақ, 40 минут.",
    nisDay2Item2: "Орыс тілі: 20 сұрақ, 40 минут.",
    nisDay2Item3: "Ағылшын тілі: 20 сұрақ, 40 минут.",
    nisDay2Note: "Әр тілдік тест ең көбі 200 ұпайға бағаланады.",
    bilTitle: "БИЛ",
    bilRoundTitle: "1 тур (Іріктеу)",
    bilIntro: "Негізгі білім мен логиканы тексеретін жалпы тест.",
    bilItem1: "Сұрақ саны: 60 сұрақ.",
    bilItem2:
      "Пәндер: Математика және логика — 50 сұрақ; Оқу сауаттылығы — 10 сұрақ (оқыту тілі — қазақ немесе орыс).",
    bilItem3: "Уақыты: 110 минут.",
    bilItem4:
      "Ұпайлау жүйесі: Дұрыс жауап — +4, қате жауап — −1 (айып ұпай әдісі).",
    rfmshTitle: "РФМШ емтиханының форматы",
    rfmshItem1: "Пәндер: Математика және логика.",
    rfmshItem2:
      "Тапсырма түрі: «Ашық тест» — жауап нұсқалары жоқ, жауапты өзіңіз жазасыз.",
    rfmshItem3: "Тапсырма саны: 30 сұрақ.",
    rfmshItem4: "Ұзақтығы: 120 минут (2 сағат).",
    rfmshScoreTitle: "Күрделілік және ұпай (барлығы 150 ұпай)",
    rfmshScoreItem1: "A деңгейі 10 есеп (негізгі) — 3 ұпайдан.",
    rfmshScoreItem2: "B деңгейі 10 есеп (орташа) — 5 ұпайдан.",
    rfmshScoreItem3: "C деңгейі 10 есеп (күрделі) — 7 ұпайдан.",
    footerAbout:
      "НИШ, БИЛ және РФМШ бойынша сынақ тесттерімен және түсінікті прогреспен дайындық.",
    footerServices: "Қызметтер",
    footerResources: "Материалдар",
    footerContacts: "Байланыс",
    footerServicePractice: "Сынақ тесттері",
    footerServiceBank: "Сұрақтар банкі",
    footerServiceCalculator: "Ұпай калькуляторы",
    footerServicePredictor: "Ұпай болжамы",
    footerServiceReviews: "Пікірлер",
    footerResourceTips: "Емтихан кеңестері",
    footerResourcePlan: "Апталық оқу жоспары",
    footerResourceParents: "Ата-аналарға нұсқаулық",
    footerContactInstagram: "Instagram — жақында",
    footerContactTelegram: "Telegram — жақында",
    footerContactEmail: "Пошта: hello@bilimbridge.kz",
    practiceTitle: "Сынақ тесттері",
    practiceSubtitle: "Сұрақтарға жауап беріп, прогресті бақылаңыз. Бұл оқу деректері.",
    practiceProgress: "Прогресс",
    practiceBack: "Артқа",
    practiceNext: "Келесі",
    practiceResults: "Нәтижелер",
    practiceTotal: "Барлық сұрақ",
    practiceCorrect: "Дұрыс",
    practiceIncorrect: "Қате",
    questionPrompt: "Жауапты таңдаңыз",
    reviewsTitle: "Пікірлер",
    reviewsSubtitle: "Жобаны жақсарту үшін пікір қалдырыңыз.",
    reviewsLeave: "Пікір қалдыру",
    reviewsNamePlaceholder: "Атыңыз",
    reviewsMessagePlaceholder: "Нені жақсартқан дұрыс?",
    reviewsSend: "Жіберу",
    scoreCalcTitle: "Ұпай калькуляторы",
    scoreCalcSubtitle: "БИЛ ережесі: дұрыс — +4, қате — −1, өткізу — 0.",
    scoreCalcCorrect: "Дұрыс жауаптар",
    scoreCalcIncorrect: "Қате жауаптар",
    scoreCalcSkipped: "Өткізілген сұрақтар",
    scoreCalcEstimate: "Ұпай бағасы",
    scoreCalcPoints: "{value} ұпай",
    scoreCalcTotal: "Барлығы жауап берілді",
    scoreCalcSkippedLabel: "Өткізілді",
    scoreCalcTip: "Көбірек ұпай үшін қателікті азайтып, өткізбеуге тырысыңыз.",
    scorePredictTitle: "Ұпай болжамы",
    scorePredictSubtitle: "Жақындағы дәлдікке қарап нәтижені бағалаңыз.",
    scorePredictAccuracy: "Соңғы дәлдік (%)",
    scorePredictTotalQuestions: "Тесттегі сұрақ саны",
    scorePredictOutcome: "Болжам",
    scorePredictPoints: "{value} ұпай",
    scorePredictCorrect: "Дұрыс",
    scorePredictIncorrect: "Қате",
    scorePredictTip: "Келесі сынаққа нақты мақсат қою үшін қолданыңыз.",
    bankTitle: "Сұрақтар банкі",
    bankSubtitle: "Бөлімді таңдаңыз. Контент апта сайын жаңартылады.",
    bankQuestions: "{value} сұрақ",
    bankOpen: "Ашу",
    categoryArithmetic: "Арифметика",
    categoryArithmeticDesc: "Бөлшек, пайыз және жылдам есептеу.",
    categoryAlgebra: "Алгебра негіздері",
    categoryAlgebraDesc: "Сызықтық теңдеулер және қарапайым есептер.",
    categoryLogic: "Логика және заңдылық",
    categoryLogicDesc: "Тізбектер, жұмбақтар және ойлау жаттығулары.",
    categoryGeometry: "Геометрия",
    categoryGeometryDesc: "Фигуралар, бұрыштар және кеңістіктік ойлау.",
    authTitle: "Кіру",
    authSubtitle: "MVP тексерісі үшін Google арқылы кіру қосылған.",
    authContinue: "Google арқылы жалғастыру",
    authBody: "Прогресті сақтау және құрылғыларды синхрондау үшін кіріңіз.",
    authFooter: "Толық OAuth интеграциясы MVP тексерісінен кейін қосылады.",
    authLoading: "Кіру жүктелуде...",
    authAvatarAlt: "Қолданушы аватары",
    authStudent: "Оқушы",
    authSignOut: "Шығу",
    authSignInGoogle: "Google арқылы кіру",
    authError: "Қате: {error}",
    reviewName1: "Айгерім К.",
    reviewMessage1: "Сынақ тесттері шынайыға ұқсайды, бәрі түсінікті.",
    reviewName2: "6-сынып оқушысының ата-анасы",
    reviewMessage2: "Интерфейс қарапайым, прогресс түсінікті. Көбірек математика керек.",
  },
} as const;

const LanguageContext = createContext<LanguageContextValue | null>(null);

const applyParams = (value: string, params?: TranslationParams) => {
  if (!params) return value;
  return Object.entries(params).reduce(
    (result, [key, paramValue]) =>
      result.replaceAll(`{${key}}`, String(paramValue)),
    value
  );
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ru");

  useEffect(() => {
    const stored = window.localStorage.getItem("language");
    if (stored === "ru" || stored === "kk") {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key: keyof typeof translations.ru, params?: TranslationParams) =>
      applyParams(translations[language][key], params),
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
