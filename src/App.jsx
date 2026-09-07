import { useEffect, useMemo, useState } from "react";
import { glossaryEntries } from "./data/glossary.js";
import headerLogoUrl from "./assets/shifa-logo-white.svg";

const localLanguages = ["Urdu", "Sindhi", "Punjabi", "Balochi", "Pashto", "Siraiki"];
const interfaceLanguages = ["English", ...localLanguages];
const languageShortLabels = {
  English: "Eng",
  Urdu: "Ur",
  Sindhi: "Sin",
  Punjabi: "Pun",
  Balochi: "Bal",
  Pashto: "Pas",
  Siraiki: "Sir",
};
const languageSlugs = {
  urdu: "Urdu",
  sindhi: "Sindhi",
  punjabi: "Punjabi",
  balochi: "Balochi",
  pashto: "Pashto",
  siraiki: "Siraiki",
};
const languageToSlug = Object.fromEntries(Object.entries(languageSlugs).map(([slug, language]) => [language, slug]));
const navItems = [
  ["Home", "/"],
  ["Languages", "/languages"],
  ["Dictionary", "/dictionary"],
  ["Blog", "/blog"],
  ["About Us", "/about"],
  ["Contact Us", "/contact"],
];

const healthcareCategories = [
  { title: "Doctors", text: "Pakistani doctors making medical language easier for patients and families." },
  { title: "Medicines", text: "Clear information that supports safer understanding of medicines and prescriptions." },
  { title: "Surgeries", text: "Simple explanations of surgical care, preparation and healthcare teamwork." },
  { title: "Labs", text: "Understand common laboratory tests, diagnostic terms and medical reports." },
];

const glossaryPalettes = [
  ["#f6fbf9", "#c9eadf", "#1f7a74", "#16495a"],
  ["#fbf8f1", "#f2d5a7", "#b56932", "#203f4d"],
  ["#f6f7fc", "#cdd8f2", "#4763a8", "#173b4a"],
  ["#fbf5f7", "#efc4d0", "#b34e6a", "#214654"],
  ["#f4fbfb", "#bfe3eb", "#2d7893", "#193f4d"],
];

function hashTerm(term) {
  return Array.from(term).reduce((hash, char) => hash + char.charCodeAt(0), 0);
}

function getGlossaryVisual(entry) {
  const text = `${entry.term} ${entry.englishMeaning}`.toLowerCase();
  if (/(heart|cardiac|angina|arter|blood pressure|hypertension|tachycardia|thrombosis|embolism)/.test(text)) {
    return "heart";
  }
  if (/(lung|respiratory|asthma|breath|cough|pneumonia|bronch|tuberculosis|flu|cold|covid)/.test(text)) {
    return "lungs";
  }
  if (/(brain|dementia|alzheimer|stroke|epilepsy|neuro|parkinson|migraine|anxiety|depression|schizo)/.test(text)) {
    return "brain";
  }
  if (/(skin|eczema|rash|acne|psoriasis|melanoma|wart|vitiligo|hives|hair|alopecia)/.test(text)) {
    return "skin";
  }
  if (/(bone|joint|arthritis|fracture|ankle|spine|spondyl|scoliosis|osteoporosis|muscular|tendon)/.test(text)) {
    return "bone";
  }
  if (/(eye|retina|glaucoma|myopia|uveitis|optic|xerophthalmia)/.test(text)) {
    return "eye";
  }
  if (/(kidney|urinary|bladder|cystitis|neph|uremia)/.test(text)) {
    return "kidney";
  }
  if (/(liver|hepat|cirrhosis|gall|bile|jaundice|pancrea|gastr|bowel|crohn|colitis|diarr|constipation)/.test(text)) {
    return "digestive";
  }
  if (/(cancer|tumour|leukaemia|leukemia|lymphoma|sarcoma|carcinoma)/.test(text)) {
    return "cells";
  }
  if (/(infection|virus|bacterial|measles|rubella|zika|ebola|rabies|tetanus|typhoid|malaria)/.test(text)) {
    return "microbe";
  }
  if (entry.category === "Drugs") {
    return "capsule";
  }
  return "cross";
}

function GlossaryPicture({ entry, size = "card" }) {
  return <ImagePlaceholder label={`${entry.term} image`} className={`glossary-picture glossary-picture-${size}`} />;
}

function GlossarySymbol({ type, color, accent }) {
  const common = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "heart") {
    return <path d="M120 98 C88 72 74 58 78 39 C82 20 105 17 120 36 C135 17 158 20 162 39 C166 58 152 72 120 98 Z" fill={color} stroke={accent} strokeWidth="5" />;
  }
  if (type === "lungs") {
    return (
      <g {...common} stroke={color} strokeWidth="7">
        <path d="M120 34 V84" />
        <path d="M118 66 C99 42 78 48 72 84 C66 120 100 118 112 92" />
        <path d="M122 66 C141 42 162 48 168 84 C174 120 140 118 128 92" />
      </g>
    );
  }
  if (type === "brain") {
    return <path d="M89 80 C72 73 74 48 91 46 C96 30 119 30 126 45 C146 38 164 53 156 72 C170 82 160 106 139 101 C128 114 102 109 101 93 C94 93 90 88 89 80 Z" fill={color} opacity="0.94" />;
  }
  if (type === "skin") {
    return (
      <g>
        <path d="M76 99 C96 63 143 55 166 87 C142 109 105 116 76 99 Z" fill={color} />
        <circle cx="118" cy="85" r="6" fill={accent} />
        <circle cx="143" cy="91" r="4" fill={accent} />
      </g>
    );
  }
  if (type === "bone") {
    return <path d="M82 57 C71 46 80 31 94 39 C100 24 121 31 116 49 L151 82 C169 76 176 97 161 103 C169 116 150 127 140 113 L105 80 C88 86 74 71 82 57 Z" fill={color} />;
  }
  if (type === "eye") {
    return (
      <g>
        <path d="M67 76 C92 47 146 47 173 76 C146 105 92 105 67 76 Z" fill={color} />
        <circle cx="120" cy="76" r="20" fill={accent} />
        <circle cx="120" cy="76" r="9" fill="#ffffff" />
      </g>
    );
  }
  if (type === "kidney") {
    return (
      <g fill={color}>
        <path d="M96 43 C75 48 68 77 79 102 C91 130 123 115 116 88 C110 65 117 39 96 43 Z" />
        <path d="M144 43 C165 48 172 77 161 102 C149 130 117 115 124 88 C130 65 123 39 144 43 Z" />
      </g>
    );
  }
  if (type === "digestive") {
    return <path d="M103 34 C127 32 143 48 137 67 C132 84 105 80 103 96 C101 110 122 113 139 105 C156 97 169 112 157 125 C138 143 87 128 80 99 C73 70 99 62 103 34 Z" fill={color} />;
  }
  if (type === "cells") {
    return (
      <g fill={color}>
        <circle cx="98" cy="67" r="22" />
        <circle cx="139" cy="82" r="27" opacity="0.88" />
        <circle cx="118" cy="105" r="15" opacity="0.72" />
      </g>
    );
  }
  if (type === "microbe") {
    return (
      <g {...common} stroke={color} strokeWidth="6">
        <circle cx="120" cy="78" r="30" fill={color} opacity="0.24" />
        <path d="M120 39 V27 M120 129 V117 M81 78 H68 M172 78 H159 M91 49 L82 40 M149 107 L158 116 M149 49 L158 40 M91 107 L82 116" />
      </g>
    );
  }
  if (type === "capsule") {
    return (
      <g transform="rotate(-28 120 76)">
        <rect x="73" y="54" width="94" height="44" rx="22" fill={color} />
        <path d="M120 54 V98" stroke={accent} strokeWidth="5" />
      </g>
    );
  }
  return (
    <g fill={color}>
      <rect x="107" y="43" width="26" height="70" rx="8" />
      <rect x="85" y="65" width="70" height="26" rx="8" />
    </g>
  );
}

const languageNotes = {
  Urdu: "English to Urdu glossary entries are available from the current document.",
  Sindhi: "Sindhi dictionary work is planned in the task list.",
  Punjabi: "Punjabi dictionary research source is listed in the document.",
  Balochi: "Balochi dictionary research source is listed in the document.",
  Pashto: "Pashto is part of the planned language set.",
  Siraiki: "Siraiki terms are part of the planned language work.",
};

const translations = {
  English: {
    search: "Search",
    selectLanguage: "Select language",
    heroKicker: "Medical glossary and language access",
    heroTitle: "Understand health words in the language people use every day.",
    heroText:
      "Shifa Translate bridges medical knowledge and everyday language in Pakistan through dictionaries, local-language definitions, awareness resources and fieldwork.",
    heroSearch: "Search glossary words, meanings, Urdu terms...",
    aboutButton: "About Shifa",
    dictionaryButton: "Open Dictionary",
    homepageSearch: "To search for words",
    aboutShort:
      "Shifa Translate is an initiative created to make healthcare terminology clear, relatable and culturally relevant for families, students and communities.",
    exploreLanguages: "Explore Different Languages",
    fieldwork: "Our Fieldwork",
    fieldworkText:
      "The project plan includes collecting important words from doctors and communities, asking people in different regions how they understand terms, and creating awareness camps.",
    wordOfDay: "Word of the Day",
    dictionary: "Dictionary",
    dictionaryText: "Search English words and view Urdu translation, meaning and category from the document glossary.",
    allCategories: "All categories",
    health: "Health",
    drugs: "Drugs",
    viewDefinition: "View definition",
    noResults: "No matching glossary words found.",
    languagesPage: "Languages Page",
    languagePageText:
      "Each language page is designed for Health and Drugs categories, alphabet browsing, definitions, pronunciation/audio later, and links to see the same word in other languages.",
    availableNow: "Available now",
    planned: "Planned",
    aboutUs: "About Us",
    ourStory: "Our Story",
    ourMission: "Our Mission",
    meetTeam: "Meet the Team",
    contactUs: "Contact Us",
    contribute: "Contribute to our Mission",
    connectForm: "Connect with us",
    queryForm: "For Any Queries",
    name: "Name",
    email: "Email",
    message: "Message",
    submit: "Submit",
    research: "Research",
    researchText:
      "The document includes literacy statistics and health literacy research to support why medical language access matters.",
    footerPolicy: "Health Information Policy",
    privacy: "Privacy Notice",
    glossary: "Glossary of words",
    formSaved: "Message saved in this demo. Backend/email can be connected next.",
  },
  Urdu: {
    search: "تلاش",
    selectLanguage: "زبان منتخب کریں",
    heroKicker: "طبی لغت اور زبان تک رسائی",
    heroTitle: "صحت کے الفاظ روزمرہ زبان میں سمجھیں۔",
    heroText: "Shifa Translate پاکستان میں medical knowledge اور everyday language کے درمیان gap کم کرتا ہے۔",
    heroSearch: "Glossary words، meanings، Urdu terms تلاش کریں...",
    aboutButton: "About Shifa",
    dictionaryButton: "Dictionary کھولیں",
    homepageSearch: "الفاظ تلاش کرنے کے لیے",
    aboutShort: "Shifa Translate healthcare terminology کو آسان، relatable اور culturally relevant بناتا ہے۔",
    exploreLanguages: "مختلف زبانیں دیکھیں",
    fieldwork: "Our Fieldwork",
    fieldworkText: "Project plan میں doctors اور communities سے important words collect کرنا شامل ہے۔",
    wordOfDay: "آج کا لفظ",
    dictionary: "Dictionary",
    dictionaryText: "English words search کریں اور Urdu translation/meaning دیکھیں۔",
    allCategories: "تمام categories",
    health: "Health",
    drugs: "Drugs",
    viewDefinition: "Definition دیکھیں",
    noResults: "کوئی glossary word نہیں ملا۔",
    languagesPage: "Languages Page",
    languagePageText: "ہر language page Health اور Drugs categories، alphabet browsing اور definitions کے لیے ہے۔",
    availableNow: "Available now",
    planned: "Planned",
    aboutUs: "About Us",
    ourStory: "Our Story",
    ourMission: "Our Mission",
    meetTeam: "Meet the Team",
    contactUs: "Contact Us",
    contribute: "Contribute to our Mission",
    connectForm: "Connect with us",
    queryForm: "For Any Queries",
    name: "نام",
    email: "ای میل",
    message: "پیغام",
    submit: "Submit",
    research: "Research",
    researchText: "Document میں literacy statistics اور health literacy research شامل ہے۔",
    footerPolicy: "Health Information Policy",
    privacy: "Privacy Notice",
    glossary: "Glossary of words",
    formSaved: "Message demo میں محفوظ ہو گیا۔ Backend/email بعد میں connect ہو سکتا ہے۔",
  },
};

const allTranslations = {
  ...translations,
  Sindhi: { ...translations.Urdu, selectLanguage: "ٻولي چونڊيو", search: "ڳوليو" },
  Punjabi: { ...translations.Urdu, selectLanguage: "زبان چنو", search: "لبھو" },
  Balochi: { ...translations.English, selectLanguage: "Language select kan" },
  Pashto: { ...translations.English, selectLanguage: "ژبه وټاکئ", search: "لټون" },
  Siraiki: { ...translations.Urdu, selectLanguage: "زبان چُنو", search: "ڳولو" },
};

const researchStats = [
  ["Pakistan overall literacy", "60%"],
  ["Punjab", "68%"],
  ["Sindh", "58%"],
  ["Khyber Pakhtunkhwa", "58%"],
  ["Balochistan", "49%"],
  ["Hunza", "99%"],
];

const dictionarySources = [
  ["Punjabi dictionary", "https://dsal.uchicago.edu/dictionaries/singh/"],
  ["Balochi dictionary", "https://www.webonary.org/balochidictionary/"],
  ["Hindko dictionary", "https://gandharahindko.com/2019/05/hindko-urdu-lughat/"],
];

const blogPosts = [
  {
    slug: "pcos-awareness",
    title: "Polycystic Ovarian Syndrome (PCOS)",
    author: "Sakina Fahad",
    category: "Women's Health",
    readTime: "4 min read",
    excerpt:
      "PCOS is one of the most common hormonal and gynaecological disorders in women of reproductive age, with symptoms and risk factors that vary across populations.",
    body: [
      "Polycystic ovarian syndrome (PCOS) is one of the most common hormonal and gynaecological disorders in women of reproductive age, affecting 5-20% of women worldwide depending on the diagnostic criteria applied. In India, the prevalence has been reported between 8.2% and 22.5%, with lifestyle factors such as diet, exercise, and urban versus rural residence influencing the rate.",
      "PCOS does not present uniformly; symptoms include irregular periods, acne, excess facial or body hair, infertility, weight gain, and polycystic ovarian morphology on ultrasound. Globally, prevalence estimates vary considerably by region and diagnostic criteria used. Reported rates in the United Kingdom range from approximately 5-10% up to 33% depending on the population and criteria applied, while Australian and New Zealand cohorts report some of the highest global rates, at approximately 15-23%. In the United States, PCOS affects an estimated 6-10% of women of reproductive age.",
      "Pakistani studies show particularly wide variation: some hospital-based cohorts report prevalence as high as 52%, compared with roughly 20-25% among UK Caucasian women, while other Pakistani studies report considerably lower figures closer to 10-23%, a discrepancy likely reflecting differences in study populations and diagnostic criteria.",
      "In teenagers, the condition often manifests as menstrual irregularities and elevated androgen levels, while difficulty conceiving is a primary concern in adult women. Women with PCOS face serious health risks including insulin resistance, type II diabetes, cardiovascular disease, and metabolic syndrome, which are especially pronounced in those with overweight or central obesity. Approximately half of women with PCOS are obese, worsening insulin resistance and hormonal dysfunction.",
    ],
  },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m21 21-4.35-4.35M18 11.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
    </svg>
  );
}

const pageRoutes = ["/languages", "/dictionary", "/blog", "/about", "/contact", "/research"];

function normalizePath(pathname) {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  if ([...pageRoutes, "/"].includes(cleanPath)) return cleanPath;
  if (cleanPath.startsWith("/languages/") && languageSlugs[cleanPath.split("/").at(-1)]) return cleanPath;
  if (cleanPath.startsWith("/blog/") && blogPosts.some((post) => post.slug === cleanPath.split("/").at(-1))) {
    return cleanPath;
  }
  return "/";
}

function getRouteInfo(pathname) {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  const matchedLanguageRoute = Object.keys(languageSlugs)
    .map((slug) => `/languages/${slug}`)
    .find((languageRoute) => cleanPath.endsWith(languageRoute));

  if (matchedLanguageRoute) {
    const basePath = cleanPath.slice(0, -matchedLanguageRoute.length) || "";
    return { basePath, route: matchedLanguageRoute };
  }

  const matchedBlogRoute = blogPosts
    .map((post) => `/blog/${post.slug}`)
    .find((blogRoute) => cleanPath.endsWith(blogRoute));

  if (matchedBlogRoute) {
    const basePath = cleanPath.slice(0, -matchedBlogRoute.length) || "";
    return { basePath, route: matchedBlogRoute };
  }

  const matchedRoute = pageRoutes.find((pageRoute) => cleanPath.endsWith(pageRoute));

  if (matchedRoute) {
    const basePath = cleanPath.slice(0, -matchedRoute.length) || "";
    return { basePath, route: matchedRoute };
  }

  if (cleanPath === "/") {
    return { basePath: "", route: "/" };
  }

  return { basePath: cleanPath, route: "/" };
}

function App() {
  const [appBasePath, setAppBasePath] = useState(() => getRouteInfo(window.location.pathname).basePath);
  const [route, setRoute] = useState(() => getRouteInfo(window.location.pathname).route);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [activeLetter, setActiveLetter] = useState("All");
  const [selectedWord, setSelectedWord] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const copy = allTranslations[selectedLanguage] || allTranslations.English;
  const t = (key) => copy[key] || allTranslations.English[key] || key;
  const wordOfDay = glossaryEntries.find((entry) => entry.term === "Diabetes") || glossaryEntries[0];

  useEffect(() => {
    const syncRoute = () => {
      const routeInfo = getRouteInfo(window.location.pathname);
      setAppBasePath(routeInfo.basePath);
      setRoute(routeInfo.route);
    };
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  useEffect(() => {
    if (route.startsWith("/languages/")) {
      const routeLanguage = languageSlugs[route.split("/").at(-1)];
      if (routeLanguage) {
        setSelectedLanguage(routeLanguage);
      }
    }
  }, [route]);

  const navigate = (path) => {
    const nextPath = normalizePath(path);
    const nextUrl = nextPath === "/" ? `${appBasePath || "/"}` : `${appBasePath}${nextPath}`;
    window.history.pushState({}, "", nextUrl);
    setRoute(nextPath);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredGlossary = useMemo(() => {
    const search = query.trim().toLowerCase();
    return glossaryEntries
      .filter((entry) => category === "All" || entry.category === category)
      .filter((entry) => activeLetter === "All" || entry.term.toUpperCase().startsWith(activeLetter))
      .filter((entry) => {
        if (!search) return true;
        return `${entry.term} ${entry.englishMeaning} ${entry.urdu} ${entry.urduMeaning} ${entry.category}`
          .toLowerCase()
          .includes(search);
      })
      .slice(0, 80);
  }, [query, category, activeLetter]);

  function submitForm(event) {
    event.preventDefault();
    setFormMessage(t("formSaved"));
    event.currentTarget.reset();
  }

  const pageProps = {
    t,
    navigate,
    query,
    setQuery,
    category,
    setCategory,
    activeLetter,
    setActiveLetter,
    filteredGlossary,
    selectedLanguage,
    setSelectedLanguage,
    setSelectedWord,
    wordOfDay,
    submitForm,
    formMessage,
  };

  return (
    <>
      <header className="site-header">
        <nav className="main-nav" aria-label="Primary navigation">
          <button className="brand" type="button" onClick={() => navigate("/")}>
            <img src={headerLogoUrl} alt="Shifa Translate logo" />
          </button>
          <button className="mobile-menu" type="button" onClick={() => setMobileOpen(!mobileOpen)}>
            Menu
          </button>
          <div className={`nav-menu ${mobileOpen ? "is-open" : ""}`}>
            {navItems.map(([label, path]) => (
              <button
                className={
                  route === path ||
                  (path === "/languages" && route.startsWith("/languages/")) ||
                  (path === "/blog" && route.startsWith("/blog/"))
                    ? "is-active"
                    : ""
                }
                key={path}
                type="button"
                onClick={() => navigate(path)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="nav-actions" aria-label={t("selectLanguage")}>
            <select
              className="nav-language-select"
              aria-label={t("selectLanguage")}
              value={selectedLanguage}
              onChange={(event) => {
                const nextLanguage = event.target.value;
                setSelectedLanguage(nextLanguage);
                if (languageToSlug[nextLanguage]) {
                  navigate(`/languages/${languageToSlug[nextLanguage]}`);
                }
              }}
            >
              {interfaceLanguages.map((language) => (
                <option key={language} value={language}>
                  {languageShortLabels[language]}
                </option>
              ))}
            </select>
            <button className="nav-search-button" type="button" onClick={() => navigate("/dictionary")} aria-label={t("search")}>
              <SearchIcon />
            </button>
          </div>
        </nav>
      </header>

      {route === "/" && <HomePage {...pageProps} />}
      {route === "/languages" && <LanguagesPage {...pageProps} />}
      {route.startsWith("/languages/") && <LanguageDictionaryPage {...pageProps} language={languageSlugs[route.split("/").at(-1)]} />}
      {route === "/dictionary" && <DictionaryPage {...pageProps} />}
      {route === "/blog" && <BlogPage navigate={navigate} />}
      {route.startsWith("/blog/") && <BlogDetailPage navigate={navigate} post={blogPosts.find((post) => post.slug === route.split("/").at(-1))} />}
      {route === "/about" && <AboutPage {...pageProps} />}
      {route === "/contact" && <ContactPage {...pageProps} />}
      {route === "/research" && <ResearchPage {...pageProps} />}

      {selectedWord && <WordModal entry={selectedWord} onClose={() => setSelectedWord(null)} />}
      <Footer t={t} navigate={navigate} />
    </>
  );
}

function HomePage({ t, navigate, query, setQuery, wordOfDay }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">{t("heroKicker")}</p>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroText")}</p>
          <div className="hero-search">
            <SearchIcon />
            <input
              type="search"
              placeholder={t("heroSearch")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => navigate("/dictionary")}
            />
            <button type="button" onClick={() => navigate("/dictionary")}>
              {t("search")}
            </button>
          </div>
          <div className="hero-actions">
            <button type="button" onClick={() => navigate("/about")}>
              {t("aboutButton")}
            </button>
            <button type="button" onClick={() => navigate("/dictionary")}>
              {t("dictionaryButton")}
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <ImagePlaceholder label="Homepage hero image" className="hero-placeholder" />
          <div className="hero-logo-card">
            <span>{glossaryEntries.length}+ glossary words</span>
          </div>
        </div>
      </section>

      <section className="home-about-section">
        <article className="home-about-card">
          <div>
            <p className="kicker">About Shifa Translate</p>
            <h2>{t("aboutShort")}</h2>
            <p>
              The project connects scientific terminology with everyday language, supports awareness, and helps people
              make sense of medical information in a culturally relevant way.
            </p>
            <div className="home-about-actions">
              <button type="button" onClick={() => navigate("/dictionary")}>
                Explore A to Z
              </button>
              <button type="button" onClick={() => navigate("/about")}>
                {t("aboutButton")}
              </button>
            </div>
            <div className="home-about-points">
              <span>Plain language</span>
              <span>Urdu meanings</span>
              <span>Community learning</span>
            </div>
          </div>
          <MedicalPhoto alt="About Shifa Translate image" />
        </article>
      </section>

      <section className="home-care-categories-section">
        <div className="section-heading">
          <p className="kicker">Healthcare categories</p>
          <h2>Medical knowledge across every step of care.</h2>
          <p>Explore terminology connected to doctors, medicines, surgeries and diagnostic laboratories.</p>
        </div>
        <div className="home-care-categories-grid">
          {healthcareCategories.map((category) => (
            <article key={category.title}>
              <ImagePlaceholder label={`${category.title} image`} className="category-image-placeholder" />
              <div>
                <h3>{category.title}</h3>
                <p>{category.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-word-highlight-section">
        <article className="home-word-card">
          <div>
            <p className="kicker">{t("wordOfDay")}</p>
            <h2>{wordOfDay.term}</h2>
            <p>{wordOfDay.englishMeaning}</p>
            <strong lang="ur" dir="rtl">
              {wordOfDay.urdu} - {wordOfDay.urduMeaning}
            </strong>
          </div>
          <MedicalPhoto alt="Word of the day image" />
        </article>
        <div className="home-stat-strip">
          <article>
            <strong>{glossaryEntries.length}+</strong>
            <span>Glossary words</span>
          </article>
          <article>
            <strong>{localLanguages.length}</strong>
            <span>Local languages planned</span>
          </article>
          <article>
            <strong>A-Z</strong>
            <span>Alphabet browsing</span>
          </article>
        </div>
      </section>

      <section className="home-language-section">
        <div className="section-heading">
          <p className="kicker">Language coverage</p>
          <h2>Designed for the languages people use at home.</h2>
        </div>
        <div className="home-language-layout">
          <MedicalPhoto alt="Language coverage image" />
          <div className="home-language-list">
            {localLanguages.map((language) => (
              <button key={language} type="button" onClick={() => navigate(`/languages/${languageToSlug[language]}`)}>
                <strong>{language}</strong>
                <span>{language === "Urdu" ? "Available now" : "Planned"}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="home-process-section">
        <div className="section-heading">
          <p className="kicker">How it works</p>
          <h2>From medical term to everyday understanding.</h2>
        </div>
        <div className="home-process-grid">
          <article>
            <span>01</span>
            <h3>Collect terms</h3>
            <p>Important medical and biological words are gathered from glossary material and community needs.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Translate clearly</h3>
            <p>English terms are paired with Urdu meanings that are easier for families to understand.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Browse A-Z</h3>
            <p>Users can search or filter alphabetically to reach the right word quickly.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Build awareness</h3>
            <p>Blogs and resources support better health conversations in schools, homes, and communities.</p>
          </article>
        </div>
      </section>

      <section className="home-blog-section">
        <div className="section-heading">
          <p className="kicker">Latest blog</p>
          <h2>Health awareness from the Shifa Translate team.</h2>
        </div>
        <div className="home-blog-layout">
          <ImagePlaceholder label="Latest blog image" className="blog-visual blog-visual-large" />
          <article>
            <span>{blogPosts[0].category}</span>
            <h3>{blogPosts[0].title}</h3>
            <p>{blogPosts[0].excerpt}</p>
            <small>Written by {blogPosts[0].author} - {blogPosts[0].readTime}</small>
            <button type="button" onClick={() => navigate(`/blog/${blogPosts[0].slug}`)}>
              Read article
            </button>
          </article>
        </div>
      </section>
    </main>
  );
}

function HomeHeroGraphic() {
  return (
    <div className="home-graphic home-hero-graphic" aria-hidden="true">
      <svg viewBox="0 0 640 620" preserveAspectRatio="xMidYMid slice" role="img">
        <rect width="640" height="620" rx="30" fill="#eef8f4" />
        <circle cx="112" cy="102" r="58" fill="#c9eadf" />
        <circle cx="536" cy="504" r="92" fill="#f2d5a7" opacity="0.9" />
        <path d="M74 430 C170 314 236 510 338 386 S500 226 576 320" fill="none" stroke="#bfe3eb" strokeWidth="34" strokeLinecap="round" />
        <g transform="translate(118 132)">
          <rect x="0" y="0" width="394" height="304" rx="28" fill="#ffffff" stroke="#c9ded7" strokeWidth="4" />
          <rect x="34" y="42" width="148" height="28" rx="14" fill="#1f4e78" />
          <rect x="34" y="96" width="248" height="18" rx="9" fill="#c9eadf" />
          <rect x="34" y="134" width="298" height="18" rx="9" fill="#dff0e5" />
          <rect x="34" y="172" width="212" height="18" rx="9" fill="#dff0e5" />
          <g transform="translate(250 78)">
            <circle cx="58" cy="58" r="54" fill="#f7fbfa" stroke="#75b7a6" strokeWidth="8" />
            <path d="M58 33 V83 M33 58 H83" stroke="#1f4e78" strokeWidth="14" strokeLinecap="round" />
          </g>
          <g transform="translate(34 230)" fill="#16495a" fontFamily="Arial, sans-serif" fontWeight="900">
            <text x="0" y="0" fontSize="24">DIABETES</text>
            <text x="0" y="32" fontSize="16">ذیابیطس / sugar</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

function ImagePlaceholder({ label, className = "" }) {
  return (
    <div className={`image-placeholder ${className}`.trim()} role="img" aria-label={`${label} placeholder`}>
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <rect x="22" y="18" width="76" height="54" rx="8" />
        <circle cx="43" cy="37" r="7" />
        <path d="M30 64 L50 47 L63 58 L73 50 L91 64" />
      </svg>
      <strong>Image placeholder</strong>
      <span>{label}</span>
    </div>
  );
}

function MedicalPhoto({ alt }) {
  return <ImagePlaceholder label={alt} className="home-graphic medical-photo" />;
}

function CommunityCareGraphic() {
  return (
    <div className="home-graphic community-care-graphic" aria-hidden="true">
      <svg viewBox="0 0 640 420" preserveAspectRatio="xMidYMid meet" role="img">
        <rect width="640" height="420" rx="28" fill="#f7fbfa" />
        <circle cx="106" cy="92" r="58" fill="#c9eadf" />
        <circle cx="536" cy="326" r="72" fill="#f2d5a7" opacity="0.9" />
        <path d="M70 298 C170 214 264 360 362 254 S520 142 586 202" fill="none" stroke="#bfe3eb" strokeWidth="20" strokeLinecap="round" />
        <g transform="translate(86 74)">
          <rect x="0" y="0" width="210" height="270" rx="24" fill="#ffffff" stroke="#c9ded7" strokeWidth="4" />
          <circle cx="105" cy="78" r="42" fill="#75b7a6" opacity="0.85" />
          <path d="M105 54 V102 M81 78 H129" stroke="#ffffff" strokeWidth="13" strokeLinecap="round" />
          <rect x="38" y="152" width="134" height="16" rx="8" fill="#dff0e5" />
          <rect x="38" y="188" width="104" height="16" rx="8" fill="#dff0e5" />
          <rect x="38" y="224" width="126" height="16" rx="8" fill="#dff0e5" />
        </g>
        <g transform="translate(336 92)">
          <rect x="0" y="0" width="210" height="92" rx="20" fill="#ffffff" stroke="#c9ded7" strokeWidth="4" />
          <text x="28" y="40" fill="#183d4a" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif">Medical term</text>
          <text x="28" y="68" fill="#1f7a74" fontSize="18" fontWeight="800" fontFamily="Arial, sans-serif">Simple meaning</text>
          <rect x="0" y="120" width="210" height="92" rx="20" fill="#ffffff" stroke="#c9ded7" strokeWidth="4" />
          <text x="28" y="158" fill="#183d4a" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif">English</text>
          <text x="28" y="188" fill="#1f7a74" fontSize="18" fontWeight="800" fontFamily="Arial, sans-serif">Urdu / local words</text>
        </g>
      </svg>
    </div>
  );
}

function KnowledgeCardsGraphic() {
  return (
    <div className="home-graphic knowledge-cards-graphic" aria-hidden="true">
      <svg viewBox="0 0 520 360" preserveAspectRatio="xMidYMid meet" role="img">
        <rect width="520" height="360" rx="26" fill="#eef8f4" />
        <circle cx="92" cy="288" r="54" fill="#efc4d0" opacity="0.75" />
        <circle cx="430" cy="76" r="46" fill="#f2d5a7" />
        <g transform="translate(84 68)">
          <rect x="0" y="0" width="260" height="172" rx="22" fill="#ffffff" stroke="#c9ded7" strokeWidth="4" />
          <rect x="34" y="34" width="112" height="16" rx="8" fill="#1f4e78" />
          <rect x="34" y="78" width="190" height="13" rx="7" fill="#c9eadf" />
          <rect x="34" y="112" width="150" height="13" rx="7" fill="#dff0e5" />
        </g>
        <g transform="translate(214 146)">
          <rect x="0" y="0" width="224" height="150" rx="22" fill="#ffffff" stroke="#c9ded7" strokeWidth="4" />
          <circle cx="54" cy="70" r="28" fill="#75b7a6" />
          <path d="M54 50 V90 M34 70 H74" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
          <rect x="98" y="48" width="82" height="12" rx="6" fill="#1f4e78" />
          <rect x="98" y="78" width="96" height="12" rx="6" fill="#dff0e5" />
        </g>
      </svg>
    </div>
  );
}

function LanguageBridgeGraphic() {
  return (
    <div className="home-graphic language-bridge-graphic" aria-hidden="true">
      <svg viewBox="0 0 640 420" preserveAspectRatio="xMidYMid meet" role="img">
        <rect width="640" height="420" rx="28" fill="#f7fbfa" />
        <path d="M92 220 C180 82 462 82 548 220" fill="none" stroke="#75b7a6" strokeWidth="18" strokeLinecap="round" />
        {["Eng", "Ur", "Sin", "Pun", "Bal", "Pas"].map((label, index) => (
          <g key={label} transform={`translate(${76 + index * 94} ${188 + (index % 2) * 44})`}>
            <circle cx="0" cy="0" r="42" fill={index % 2 ? "#f2d5a7" : "#c9eadf"} />
            <text x="0" y="7" textAnchor="middle" fill="#16495a" fontSize="18" fontWeight="900" fontFamily="Arial, sans-serif">
              {label}
            </text>
          </g>
        ))}
        <rect x="142" y="58" width="356" height="74" rx="20" fill="#ffffff" stroke="#c9ded7" strokeWidth="4" />
        <text x="320" y="104" textAnchor="middle" fill="#183d4a" fontSize="28" fontWeight="900" fontFamily="Arial, sans-serif">
          Language access
        </text>
      </svg>
    </div>
  );
}

function WordLearningGraphic() {
  return (
    <div className="home-graphic word-learning-graphic" aria-hidden="true">
      <svg viewBox="0 0 640 420" preserveAspectRatio="xMidYMid meet" role="img">
        <rect width="640" height="420" rx="28" fill="#fbf8f1" />
        <circle cx="512" cy="92" r="56" fill="#c9eadf" />
        <circle cx="118" cy="322" r="74" fill="#efc4d0" opacity="0.72" />
        <g transform="translate(140 82)">
          <rect x="0" y="0" width="360" height="250" rx="24" fill="#ffffff" stroke="#c9ded7" strokeWidth="4" />
          <path d="M66 76 H294 M66 126 H252 M66 176 H316" stroke="#dff0e5" strokeWidth="20" strokeLinecap="round" />
          <circle cx="78" cy="75" r="12" fill="#75b7a6" />
          <circle cx="78" cy="125" r="12" fill="#1f4e78" />
          <circle cx="78" cy="175" r="12" fill="#b56932" />
          <text x="194" y="224" textAnchor="middle" fill="#183d4a" fontSize="24" fontWeight="900" fontFamily="Arial, sans-serif">
            A-Z glossary
          </text>
        </g>
      </svg>
    </div>
  );
}

function LanguagesPage({ t, selectedLanguage, setSelectedLanguage, setCategory, navigate }) {
  return (
    <main>
      <section className="page-hero compact-page">
        <p className="kicker">{t("languagesPage")}</p>
        <h1>{t("exploreLanguages")}</h1>
        <p>{t("languagePageText")}</p>
      </section>
      <section className="languages-section page-section">
        <div className="language-grid">
          {localLanguages.map((language) => (
            <button
              className={selectedLanguage === language ? "is-selected" : ""}
              key={language}
              type="button"
              onClick={() => {
                setSelectedLanguage(language);
                navigate(`/languages/${languageToSlug[language]}`);
              }}
            >
              <strong>{language}</strong>
              <span>{language === "Urdu" ? t("availableNow") : t("planned")}</span>
              <small>{languageNotes[language]}</small>
            </button>
          ))}
        </div>
        <div className="category-strip">
          <button
            type="button"
            onClick={() => {
              setCategory("Health");
              navigate("/dictionary");
            }}
          >
            Health
          </button>
          <button
            type="button"
            onClick={() => {
              setCategory("Drugs");
              navigate("/dictionary");
            }}
          >
            Drugs
          </button>
        </div>
      </section>
    </main>
  );
}

function LanguageDictionaryPage({
  t,
  language,
  query,
  setQuery,
  category,
  setCategory,
  activeLetter,
  setActiveLetter,
  filteredGlossary,
  setSelectedWord,
  navigate,
}) {
  if (!language) {
    return <LanguagesPage t={t} selectedLanguage="English" setSelectedLanguage={() => {}} setCategory={setCategory} navigate={navigate} />;
  }

  const hasData = language === "Urdu";
  const alphabet = ["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  return (
    <main>
      <section className="page-hero compact-page">
        <p className="kicker">{language} Dictionary</p>
        <h1>{hasData ? "English to Urdu medical glossary" : `${language} dictionary is planned`}</h1>
        <p>
          {hasData
            ? "Browse the current Urdu glossary entries from the project document with Health and Drugs filters."
            : `${language} is part of the Shifa Translate language plan. This page is ready for the same dictionary structure once terms and definitions are finalized.`}
        </p>
      </section>

      {hasData ? (
        <section className="dictionary-section standalone">
          <div className="dictionary-tools">
            <div className="dictionary-search">
              <SearchIcon />
              <input
                type="search"
                placeholder={t("heroSearch")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="All">{t("allCategories")}</option>
              <option value="Health">{t("health")}</option>
              <option value="Drugs">{t("drugs")}</option>
            </select>
          </div>

          <div className="alphabet-strip" aria-label="Alphabet filter">
            {alphabet.map((letter) => (
              <button
                className={activeLetter === letter ? "is-active" : ""}
                key={letter}
                type="button"
                onClick={() => setActiveLetter(letter)}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="glossary-grid">
            {filteredGlossary.length ? (
              filteredGlossary.map((entry) => (
                <GlossaryCard entry={entry} key={entry.term} setSelectedWord={setSelectedWord} t={t} />
              ))
            ) : (
              <p className="empty-state">{t("noResults")}</p>
            )}
          </div>
        </section>
      ) : (
        <section className="languages-section page-section">
          <div className="coming-soon-panel">
            <span>{t("planned")}</span>
            <h2>{language} dictionary page</h2>
            <p>{languageNotes[language]}</p>
            <div className="category-strip">
              <button type="button" disabled>
                Health
              </button>
              <button type="button" disabled>
                Drugs
              </button>
              <button type="button" disabled>
                A-Z browsing
              </button>
              <button type="button" disabled>
                Pronunciation audio
              </button>
            </div>
            <button className="page-cta" type="button" onClick={() => navigate("/contact")}>
              Contribute {language} words
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

function DictionaryPage({
  t,
  query,
  setQuery,
  category,
  setCategory,
  activeLetter,
  setActiveLetter,
  filteredGlossary,
  setSelectedWord,
}) {
  const alphabet = ["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  return (
    <main>
      <section className="page-hero compact-page">
        <p className="kicker">{t("dictionary")}</p>
        <h1>{t("homepageSearch")}</h1>
        <p>{t("dictionaryText")}</p>
      </section>

      <section className="dictionary-section standalone">
        <div className="dictionary-tools">
          <div className="dictionary-search">
            <SearchIcon />
            <input
              type="search"
              placeholder={t("heroSearch")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="All">{t("allCategories")}</option>
            <option value="Health">{t("health")}</option>
            <option value="Drugs">{t("drugs")}</option>
          </select>
        </div>

        <div className="alphabet-strip" aria-label="Alphabet filter">
          {alphabet.map((letter) => (
            <button
              className={activeLetter === letter ? "is-active" : ""}
              key={letter}
              type="button"
              onClick={() => setActiveLetter(letter)}
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="glossary-grid">
          {filteredGlossary.length ? (
            filteredGlossary.map((entry) => (
              <GlossaryCard entry={entry} key={entry.term} setSelectedWord={setSelectedWord} t={t} />
            ))
          ) : (
            <p className="empty-state">{t("noResults")}</p>
          )}
        </div>
      </section>
    </main>
  );
}

function GlossaryCard({ entry, setSelectedWord, t }) {
  return (
    <article className="glossary-card">
      <GlossaryPicture entry={entry} />
      <div>
        <span>{entry.category}</span>
        <h3>{entry.term}</h3>
        <p>{entry.englishMeaning}</p>
      </div>
      <strong lang="ur" dir="rtl">
        {entry.urdu}
      </strong>
      <button type="button" onClick={() => setSelectedWord(entry)}>
        {t("viewDefinition")}
      </button>
    </article>
  );
}

function BlogPage({ navigate }) {
  return (
    <main>
      <section className="blog-banner">
        <div className="blog-banner-copy">
          <p className="kicker">Shifa Translate Blog</p>
          <h1>Health awareness articles</h1>
          <p>Read simple, research-aware articles connected to health, language, and community understanding.</p>
          <button type="button" onClick={() => navigate(`/blog/${blogPosts[0].slug}`)}>
            Read latest article
          </button>
        </div>
        <div className="blog-banner-art">
          <BlogVisual large alt="Blog hero image" />
        </div>
        <div className="blog-banner-stats" aria-label="Blog summary">
          <span>{blogPosts.length} Article</span>
          <span>Women's Health</span>
          <span>Community Awareness</span>
        </div>
      </section>

      <section className="blog-section page-section">
        <div className="section-heading blog-heading">
          <p className="kicker">Archive</p>
          <h2>Latest posts</h2>
        </div>
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <button className="blog-card" key={post.slug} type="button" onClick={() => navigate(`/blog/${post.slug}`)}>
              <BlogVisual alt={`${post.title} article image`} />
              <span>{post.category}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <small>Written by {post.author} - {post.readTime}</small>
              <b>Read article</b>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function BlogDetailPage({ navigate, post }) {
  if (!post) {
    return (
      <main>
        <section className="page-hero compact-page">
          <p className="kicker">Blog</p>
          <h1>Article not found</h1>
          <p>The selected article is not available.</p>
          <button type="button" onClick={() => navigate("/blog")}>
            Back to Blog
          </button>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="blog-detail-banner">
        <div className="blog-detail-banner-copy">
          <button className="text-link text-link-light" type="button" onClick={() => navigate("/blog")}>
            Back to Blog
          </button>
          <div className="blog-meta blog-meta-light">
            <span>{post.category}</span>
            <small>
              Written by {post.author} - {post.readTime}
            </small>
          </div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </div>
        <div className="blog-detail-banner-art">
          <BlogVisual large alt="Article hero image" />
        </div>
      </section>
      <article className="blog-detail">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
    </main>
  );
}

function BlogVisual({ large = false, alt = "Blog image" }) {
  return <ImagePlaceholder label={alt} className={`blog-visual ${large ? "blog-visual-large" : ""}`} />;
}

function AboutPage({ t, navigate }) {
  return (
    <main>
      <section className="about-section">
        <div className="about-banner">
          <ImagePlaceholder label="About Shifa Translate hero image" className="about-image-placeholder" />
        </div>
        <div className="section-heading">
          <p className="kicker">{t("aboutUs")}</p>
          <h1>Shifa Translate</h1>
          <p>
            Shifa Translate is an initiative created to bridge the gap between medical knowledge and everyday language
            in Pakistan. Many people hear medical and scientific terminology but do not fully understand the meanings.
          </p>
        </div>
        <div className="about-grid about-grid-wide">
          <article>
            <p className="kicker">Mission Statement</p>
            <h3>Creating awareness through language people understand.</h3>
            <p>
              Our mission is to create awareness in our community. We aim to make people cross boundaries and learn new
              terms in the language which they are comfortable in.
            </p>
            <p>
              We want to improve public understanding of health through simple and relatable language. We strive to
              bridge scientific terminology with everyday language in Pakistan, making knowledge easier to understand
              and use in life.
            </p>
            <p>
              Shifa Translate is more than a name. Its motto is to connect knowledge with people in a simple and
              relatable way. We want young minds to present new ideas and represent our country's intellect. We believe
              languages should never be a barrier between people.
            </p>
          </article>
          <article>
            <p className="kicker">Project Bio</p>
            <h3>Making healthcare terminology clear for everyone.</h3>
            <p>
              Shifa Translate was created to bridge the gap between medical knowledge and everyday language in Pakistan.
              Many people hear medical and scientific terminology, but do not fully understand the meanings. In such
              cases, informal or inaccurate names are used. For instance, diabetes, affecting approximately 34.5 million
              adults in Pakistan, is often simply referred to as "sugar".
            </p>
            <p>
              Through translation, awareness, and proper scientific terminology in local languages, we aim to help
              individuals and communities make sense of medical information in a way that is understandable and
              culturally relevant.
            </p>
            <p>
              We strongly believe that modern communication combined with cultural understanding makes healthcare
              education more accessible for families, students, and communities across Pakistan.
            </p>
          </article>
        </div>
        <div className="team-section">
          <div className="section-heading">
            <p className="kicker">{t("meetTeam")}</p>
            <h2>Meet the founder</h2>
          </div>
          <div className="about-grid single-founder-grid">
            <article>
              <div className="team-photo-placeholder" aria-hidden="true">
                <span>AA</span>
              </div>
              <h3>Abdullah Aamer</h3>
              <p>
                I am Abdullah Aamer, the founder of Shifa Translate. I strongly believe in learning information in
                your mother tongue. In Pakistan, a majority of people do not know the right biological terminology
                because language barriers do not allow people to learn biological terms.
              </p>
              <p>
                In many homes, illnesses are described with informal or incorrect terminologies, which creates fear or
                confusion for the patient. Our mission is to translate biological terms in native languages so
                understanding terminology is comfortable for everyone.
              </p>
              <p>
                Shifa Translate also focuses strongly on literacy rates in Pakistan. We aim to hold educational camps
                and audio translations for individuals who cannot read, helping them feel confident and aware when they
                hear scientific or biological terms.
              </p>
            </article>
          </div>
        </div>
        <div className="fieldwork-section inner-section">
          <div className="section-heading">
            <p className="kicker">{t("fieldwork")}</p>
            <h2>Community learning, doctors, definitions and audio translations.</h2>
            <p>{t("fieldworkText")}</p>
          </div>
          <div className="fieldwork-grid">
            <article>Talk to doctors for important words and meanings.</article>
            <article>Ask communities in different regions how they define health terms.</article>
            <article>Plan awareness bootcamps and camps around villages.</article>
            <article>Create audio translations for people who cannot read comfortably.</article>
          </div>
        </div>
        <button className="page-cta" type="button" onClick={() => navigate("/research")}>
          View research
        </button>
      </section>
    </main>
  );
}

function ResearchPage({ t }) {
  return (
    <main>
      <section className="research-section">
        <div className="section-heading">
          <p className="kicker">{t("research")}</p>
          <h1>Health literacy context and dictionary sources.</h1>
          <p>{t("researchText")}</p>
        </div>
        <div className="research-grid">
          {researchStats.map(([label, value]) => (
            <article key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
        <div className="source-list">
          {dictionarySources.map(([label, url]) => (
            <a href={url} key={url} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function ContactPage({ t, selectedLanguage, setSelectedLanguage, submitForm, formMessage }) {
  return (
    <main>
      <section className="contact-banner">
        <ImagePlaceholder label="Contact page hero image" className="contact-image-placeholder" />
        <div>
          <p className="kicker">{t("contactUs")}</p>
          <h1>{t("contribute")}</h1>
          <p>Send questions, share glossary suggestions, or connect with the Shifa Translate team.</p>
        </div>
      </section>
      <section className="contact-section">
        <div className="contact-copy">
          <p className="kicker">{t("contactUs")}</p>
          <h1>{t("contribute")}</h1>
          <p>
            Connect with Shifa Translate, submit questions, suggest missing glossary words, or contribute language
            definitions for future dictionary pages.
          </p>
          <div className="contact-info-card">
            <h3>Contact Info</h3>
            <a href="mailto:shifatranslate@gmail.com">shifatranslate@gmail.com</a>
            <span>Pakistan</span>
          </div>
          <div className="social-card">
            <h3>Social Media</h3>
            <div>
              <a href="https://www.instagram.com/shifa_translate?utm_source=qr" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <form className="question-form" onSubmit={submitForm}>
          <h3>{t("connectForm")}</h3>
          <label>
            {t("name")}
            <input type="text" name="name" placeholder="Your name" />
          </label>
          <label>
            {t("email")}
            <input type="email" name="email" placeholder="you@example.com" />
          </label>
          <label>
            {t("selectLanguage")}
            <select value={selectedLanguage} onChange={(event) => setSelectedLanguage(event.target.value)}>
              {interfaceLanguages.map((language) => (
                <option key={language}>{language}</option>
              ))}
            </select>
          </label>
          <label className="full">
            {t("queryForm")}
            <textarea name="message" rows="5" placeholder={t("message")} />
          </label>
          <button type="submit">{t("submit")}</button>
          <p aria-live="polite">{formMessage}</p>
        </form>
      </section>
    </main>
  );
}

function WordModal({ entry, onClose }) {
  return (
    <div className="word-modal" role="dialog" aria-modal="true" aria-label={entry.term}>
      <div className="word-modal-card">
        <button type="button" onClick={onClose}>
          Close
        </button>
        <GlossaryPicture entry={entry} size="modal" />
        <span>{entry.category}</span>
        <h2>{entry.term}</h2>
        <p>{entry.englishMeaning}</p>
        <div className="word-translation" lang="ur" dir="rtl">
          <strong>{entry.urdu}</strong>
          <p>{entry.urduMeaning}</p>
        </div>
        <small>Pronunciation voice and other-language links can be connected when audio/data is ready.</small>
      </div>
    </div>
  );
}

function Footer({ t, navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src={headerLogoUrl} alt="" />
        <h2>SHIFA TRANSLATE</h2>
        <p>Connecting knowledge with people in a simple and relatable way.</p>
      </div>
      <div>
        <h3>About Shifa Translate</h3>
        <button type="button" onClick={() => navigate("/about")}>
          {t("aboutUs")}
        </button>
        <button type="button" onClick={() => navigate("/contact")}>
          {t("contactUs")}
        </button>
        <button type="button" onClick={() => navigate("/about")}>
          {t("fieldwork")}
        </button>
        <button type="button" onClick={() => navigate("/about")}>
          Our Team
        </button>
      </div>
      <div>
        <h3>Resources</h3>
        <button type="button" onClick={() => navigate("/dictionary")}>
          {t("glossary")}
        </button>
        <button type="button" onClick={() => navigate("/research")}>
          {t("research")}
        </button>
        <button type="button" onClick={() => navigate("/languages")}>
          {t("languagesPage")}
        </button>
      </div>
      <div>
        <h3>Policy</h3>
        <button type="button" onClick={() => navigate("/research")}>
          {t("footerPolicy")}
        </button>
        <button type="button" onClick={() => navigate("/contact")}>
          {t("privacy")}
        </button>
        <p>Educational information only. It does not replace medical advice.</p>
      </div>
      <div className="footer-copyright">Copyright © 2026 SHIFA TRANSLATE. All rights reserved.</div>
    </footer>
  );
}

export default App;
