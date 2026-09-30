import { useEffect, useState } from "react";
import "./App.css";

type FeatureValue = "+" | "-";
type SoundCategory = "consonant" | "vowel";
type PracticePreset =
  | "all"
  | "consonants"
  | "vowels"
  | "custom";
type FeatureMap = Record<string, FeatureValue>;
type PlaceName = "labial" | "coronal" | "dorsal";

interface Sound {
  symbol: string;
  description: string;
  category: SoundCategory;
  features: FeatureMap;
  places?: Partial<Record<PlaceName, FeatureMap>>;
}

interface HistoryError {
  feature: string;
  selected: string;
  correct: string;
}

interface HistoryEntry {
  id: string;
  symbol: string;
  description: string;
  isCorrect: boolean;
  errors: HistoryError[];
  submittedAt: string;
}

const consonantFeatureNames = [
  "syllabic",
  "consonantal",
  "sonorant",
  "voice",
  "continuant",
  "nasal",
  "lateral",
  "D.R."
] as const;

const vowelFeatureNames = [
  "syllabic",
  "consonantal",
  "sonorant",
  "high",
  "low",
  "back",
  "round",
  "tense",
] as const;

const placeNames: PlaceName[] = [
  "labial",
  "coronal",
  "dorsal",
];

const placeDefinitions: Record<PlaceName, readonly string[]> = {
  labial: ["round"],
  coronal: ["anterior", "strident"],
  dorsal: ["high", "low", "back"],
};

function createEmptyPlaces(): Record<PlaceName, boolean> {
  return {
    labial: false,
    coronal: false,
    dorsal: false,
  };
}

function getOrdinaryFeatureNames(
  sound: Sound,
): readonly string[] {
  return sound.category === "consonant"
    ? consonantFeatureNames
    : vowelFeatureNames;
}

function createActiveFeatures():
  Record<string, boolean> {
  const active: Record<string, boolean> = {};
  const ordinaryFeatures = new Set<string>([
    ...consonantFeatureNames,
    ...vowelFeatureNames,
  ]);

  for (const feature of ordinaryFeatures) {
    active[feature] = true;
  }

  for (const place of placeNames) {
    for (const feature of placeDefinitions[place]) {
      active[placeAnswerKey(place, feature)] = true;
    }
  }

  return active;
}

function makeFeatureMap(
  featureNames: readonly string[],
  positiveFeatures: readonly string[],
): FeatureMap {
  return Object.fromEntries(
    featureNames.map((feature) => [
      feature,
      positiveFeatures.includes(feature) ? "+" : "-",
    ]),
  ) as FeatureMap;
}

function consonant(
  symbol: string,
  description: string,
  positiveFeatures: string[],
  places: Partial<Record<PlaceName, FeatureMap>>,
): Sound {
  return {
    symbol,
    description,
    category: "consonant",
    features: makeFeatureMap(
      consonantFeatureNames,
      positiveFeatures,
    ),
    places,
  };
}

function vowel(
  symbol: string,
  description: string,
  positiveFeatures: string[],
): Sound {
  return {
    symbol,
    description,
    category: "vowel",
    features: makeFeatureMap(vowelFeatureNames, [
      "syllabic",
      "sonorant",
      ...positiveFeatures,
    ]),
  };
}

const sounds: Sound[] = [
  /*
   * CONSONANTS
   */

  consonant(
    "p",
    "voiceless bilabial stop",
    ["consonantal"],
    {
      labial: {
        round: "-",
      },
    },
  ),

  consonant(
    "b",
    "voiced bilabial stop",
    ["consonantal", "voice"],
    {
      labial: {
        round: "-",
      },
    },
  ),

  consonant(
    "t",
    "voiceless alveolar stop",
    ["consonantal"],
    {
      coronal: {
        anterior: "+",
        strident: "-",
      },
    },
  ),

  consonant(
    "d",
    "voiced alveolar stop",
    ["consonantal", "voice"],
    {
      coronal: {
        anterior: "+",
        strident: "-",
      },
    },
  ),

  consonant(
    "k",
    "voiceless velar stop",
    ["consonantal"],
    {
      dorsal: {
        high: "+",
        low: "-",
        back: "+",
      },
    },
  ),

  consonant(
    "ɡ",
    "voiced velar stop",
    ["consonantal", "voice"],
    {
      dorsal: {
        high: "+",
        low: "-",
        back: "+",
      },
    },
  ),

  consonant(
    "f",
    "voiceless labiodental fricative",
    ["consonantal", "continuant"],
    {
      labial: {
        round: "-",
      },
    },
  ),

  consonant(
    "v",
    "voiced labiodental fricative",
    ["consonantal", "voice", "continuant"],
    {
      labial: {
        round: "-",
      },
    },
  ),

  consonant(
    "θ",
    "voiceless interdental fricative",
    ["consonantal", "continuant"],
    {
      coronal: {
        anterior: "+",
        strident: "-",
      },
    },
  ),

  consonant(
    "ð",
    "voiced interdental fricative",
    ["consonantal", "voice", "continuant"],
    {
      coronal: {
        anterior: "+",
        strident: "-",
      },
    },
  ),

  consonant(
    "s",
    "voiceless alveolar fricative",
    ["consonantal", "continuant"],
    {
      coronal: {
        anterior: "+",
        strident: "+",
      },
    },
  ),

  consonant(
    "z",
    "voiced alveolar fricative",
    ["consonantal", "voice", "continuant"],
    {
      coronal: {
        anterior: "+",
        strident: "+",
      },
    },
  ),

  consonant(
    "ʃ",
    "voiceless postalveolar fricative",
    ["consonantal", "continuant"],
    {
      coronal: {
        anterior: "-",
        strident: "+",
      },
    },
  ),

  consonant(
    "ʒ",
    "voiced postalveolar fricative",
    ["consonantal", "voice", "continuant"],
    {
      coronal: {
        anterior: "-",
        strident: "+",
      },
    },
  ),

  consonant(
    "h",
    "voiceless glottal fricative",
    ["continuant"],
    {},
  ),

  consonant(
    "ʔ",
    "voiceless glottal stop",
    [],
    {},
  ),

  consonant(
    "t͡ʃ",
    "voiceless postalveolar affricate",
    ["consonantal", "D.R."],
    {
      coronal: {
        anterior: "-",
        strident: "+",
      },
    },
  ),

  consonant(
    "d͡ʒ",
    "voiced postalveolar affricate",
    ["consonantal", "voice", "D.R."],
    {
      coronal: {
        anterior: "-",
        strident: "+",
      },
    },
  ),

  consonant(
    "m",
    "voiced bilabial nasal",
    [
      "consonantal",
      "sonorant",
      "voice",
      "nasal",
    ],
    {
      labial: {
        round: "-",
      },
    },
  ),

  consonant(
    "n",
    "voiced alveolar nasal",
    [
      "consonantal",
      "sonorant",
      "voice",
      "nasal",
    ],
    {
      coronal: {
        anterior: "+",
        strident: "-",
      },
    },
  ),

  consonant(
    "ŋ",
    "voiced velar nasal",
    [
      "consonantal",
      "sonorant",
      "voice",
      "nasal",
    ],
    {
      dorsal: {
        high: "+",
        low: "-",
        back: "+",
      },
    },
  ),

  consonant(
    "l",
    "voiced alveolar lateral liquid",
    [
      "consonantal",
      "sonorant",
      "voice",
      "continuant",
      "lateral",
    ],
    {
      coronal: {
        anterior: "+",
        strident: "-",
      },
    },
  ),

  consonant(
    "ɹ",
    "voiced alveolar rhotic liquid",
    [
      "consonantal",
      "sonorant",
      "voice",
      "continuant",
    ],
    {
      coronal: {
        anterior: "+",
        strident: "-",
      },
    },
  ),

  consonant(
    "j",
    "voiced palatal glide",
    [
      "sonorant",
      "voice",
      "continuant",
    ],
    {
      dorsal: {
        high: "+",
        low: "-",
        back: "-",
      },
    },
  ),

  consonant(
    "w",
    "voiced labiovelar glide",
    [
      "sonorant",
      "voice",
      "continuant",
    ],
    {
      labial: {
        round: "+",
      },
      dorsal: {
        high: "+",
        low: "-",
        back: "+",
      },
    },
  ),

  /*
   * VOWELS
   */

  vowel(
    "i",
    "high front unrounded tense vowel, as in FLEECE",
    ["high", "tense"],
  ),

  vowel(
    "ɪ",
    "high front unrounded lax vowel, as in KIT",
    ["high"],
  ),

  vowel(
    "ɛ",
    "mid front unrounded lax vowel, as in DRESS",
    [],
  ),

  vowel(
    "æ",
    "low front unrounded lax vowel, as in TRAP",
    ["low"],
  ),

  vowel(
    "ɑ",
    "low back unrounded lax vowel, as in LOT or PALM",
    ["low", "back"],
  ),



  vowel(
    "ʊ",
    "high back rounded lax vowel, as in FOOT",
    ["high", "back", "round"],
  ),

  vowel(
    "u",
    "high back rounded tense vowel, as in GOOSE",
    ["high", "back", "round", "tense"],
  ),

  vowel(
    "ʌ",
    "mid back unrounded lax vowel, as in STRUT",
    ["back"],
  ),

  vowel(
    "ə",
    "mid central unrounded lax vowel, or schwa",
    ["back"],
  ),

  vowel(
    "ɚ",
    "mid central unrounded lax rhotic vowel, as in LEARN",
    ["back"],
  ),

  vowel(
    "e",
    "mid front unrounded tense vowel, beginning of the diphthong in BAIT",
    ["tense"],
  ),

  vowel(
    "o",
    "mid back rounded tense vowel, beginning of the diphthong in BOAT",
    ["back", "tense", "round"],
  ),

];

const allSoundSymbols = sounds.map((sound) => sound.symbol);

const consonantSymbols = sounds
  .filter(
    (sound) =>
      sound.category === "consonant",
  )
  .map((sound) => sound.symbol);

const vowelSymbols = sounds
  .filter(
    (sound) =>
      sound.category === "vowel",
  )
  .map((sound) => sound.symbol);

function getRandomSound(
  selectedSymbols: readonly string[],
  excludedSymbol?: string,
): Sound | null {
  let choices = sounds.filter((sound) =>
    selectedSymbols.includes(sound.symbol),
  );

  /*
   * Avoid immediately repeating the current sound when
   * more than one sound is available.
   */
  if (excludedSymbol && choices.length > 1) {
    choices = choices.filter(
      (sound) => sound.symbol !== excludedSymbol,
    );
  }

  if (choices.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(
    Math.random() * choices.length,
  );

  return choices[randomIndex];
}

function placeAnswerKey(
  place: PlaceName,
  feature: string,
): string {
  return `${place}.${feature}`;
}

const HISTORY_STORAGE_KEY =
  "ipa-feature-trainer-history-v3";

const FEATURE_FILTER_STORAGE_KEY =
  "ipa-feature-trainer-feature-filters-v3";

function loadActiveFeatures(): Record<string, boolean> {
  const defaults = createActiveFeatures();

  try {
    const stored = localStorage.getItem(
      FEATURE_FILTER_STORAGE_KEY,
    );

    return stored
      ? { ...defaults, ...JSON.parse(stored) }
      : defaults;
  } catch {
    return defaults;
  }
}

function loadHistory(): HistoryEntry[] {
  try {
    const savedHistory = localStorage.getItem(
      HISTORY_STORAGE_KEY,
    );

    if (!savedHistory) {
      return [];
    }

    return JSON.parse(savedHistory) as HistoryEntry[];
  } catch {
    return [];
  }
}

function displayFeatureAnswer(
  feature: string,
  value: FeatureValue | undefined,
): string {
  if (value === undefined) {
    return "Unanswered";
  }

  return `[${value}${feature}]`;
}

function formatCategory(category: SoundCategory): string {
  return category === "consonant" ? "Consonant" : "Vowel";
}

function App() {
  const [currentSound, setCurrentSound] = useState<Sound>(
  () => {
    const randomIndex = Math.floor(
      Math.random() * sounds.length,
    );

    return sounds[randomIndex];
  },
);

  const [selectedSymbols, setSelectedSymbols] = useState<
  string[]
>(() => [...allSoundSymbols]);

  const [
    activePracticeSet,
    setActivePracticeSet,
  ] = useState<PracticePreset>("all");

  const [answers, setAnswers] = useState<
    Record<string, FeatureValue | undefined>
  >({});

  const [
    activeFeatures,
    setActiveFeatures,
  ] = useState<Record<string, boolean>>(
    () => loadActiveFeatures(),
  );

  const [selectedPlaces, setSelectedPlaces] = useState<
    Record<PlaceName, boolean>
  >(createEmptyPlaces);

  const [result, setResult] = useState<
    "correct" | "incorrect" | null
  >(null);

  const [score, setScore] = useState({
    correct: 0,
    total: 0,
  });

  const [history, setHistory] = useState<HistoryEntry[]>(
  () => loadHistory(),
  );

  useEffect(() => {
    localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(history),
    );
  }, [history]);

  useEffect(() => {
    localStorage.setItem(
      FEATURE_FILTER_STORAGE_KEY,
      JSON.stringify(activeFeatures),
    );
  }, [activeFeatures]);

  const featureNames =
    currentSound.category === "consonant"
      ? consonantFeatureNames
      : vowelFeatureNames;

  function selectValue(
    feature: string,
    value: FeatureValue,
  ) {
    if (result !== null) {
      return;
    }

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [feature]: value,
    }));
  }

  function toggleFeature(
    feature: string,
  ) {
    if (result !== null) {
      return;
    }

    const willBeActive =
      !activeFeatures[feature];

    setActiveFeatures(
      (previousFeatures) => ({
        ...previousFeatures,
        [feature]: willBeActive,
      }),
    );

    if (!willBeActive) {
      setAnswers((previousAnswers) => {
        const nextAnswers = {
          ...previousAnswers,
        };

        delete nextAnswers[feature];
        return nextAnswers;
      });
    }
  }

  function setAllOrdinaryFeatures(
    active: boolean,
  ) {
    if (result !== null) {
      return;
    }

    const featureNames =
      getOrdinaryFeatureNames(currentSound);

    setActiveFeatures((previousFeatures) => {
      const nextFeatures = {
        ...previousFeatures,
      };

      for (const feature of featureNames) {
        nextFeatures[feature] = active;
      }

      return nextFeatures;
    });

    if (!active) {
      setAnswers((previousAnswers) => {
        const nextAnswers = {
          ...previousAnswers,
        };

        for (const feature of featureNames) {
          delete nextAnswers[feature];
        }

        return nextAnswers;
      });
    }
  }

  function setAllDependentFeatures(
    active: boolean,
  ) {
    if (
      result !== null ||
      currentSound.category !== "consonant"
    ) {
      return;
    }

    const keys = placeNames.flatMap(
      (place) =>
        placeDefinitions[place].map(
          (feature) =>
            placeAnswerKey(place, feature),
        ),
    );

    setActiveFeatures((previousFeatures) => {
      const nextFeatures = {
        ...previousFeatures,
      };

      for (const key of keys) {
        nextFeatures[key] = active;
      }

      return nextFeatures;
    });

    if (!active) {
      setAnswers((previousAnswers) => {
        const nextAnswers = {
          ...previousAnswers,
        };

        for (const key of keys) {
          delete nextAnswers[key];
        }

        return nextAnswers;
      });
    }
  }

  function togglePlace(place: PlaceName) {
    if (result !== null) {
      return;
    }

    const willBeChecked = !selectedPlaces[place];

    setSelectedPlaces((previousPlaces) => ({
      ...previousPlaces,
      [place]: willBeChecked,
    }));

    if (!willBeChecked) {
      setAnswers((previousAnswers) => {
        const newAnswers = { ...previousAnswers };

        for (const feature of placeDefinitions[place]) {
          delete newAnswers[
            placeAnswerKey(place, feature)
          ];
        }

        return newAnswers;
      });
    }
  }


  function applyPracticeSet(
    symbols: string[],
    preset: PracticePreset,
  ) {
    setSelectedSymbols(symbols);
    setActivePracticeSet(preset);

    if (
      symbols.length > 0 &&
      !symbols.includes(currentSound.symbol)
    ) {
      const nextSound = getRandomSound(symbols);

      if (nextSound) {
        setCurrentSound(nextSound);
        setAnswers({});
        setSelectedPlaces(
          createEmptyPlaces(),
        );
        setResult(null);
      }
    }
  }

  function toggleSound(symbol: string) {
    const nextSymbols =
      selectedSymbols.includes(symbol)
        ? selectedSymbols.filter(
            (selectedSymbol) =>
              selectedSymbol !== symbol,
          )
        : [
            ...selectedSymbols,
            symbol,
          ];

    applyPracticeSet(
      nextSymbols,
      "custom",
    );
  }

  function clearHistory() {
    setHistory([]);
  }

  function selectAllSounds() {
    applyPracticeSet(
      [...allSoundSymbols],
      "all",
    );
  }

  function selectJustConsonants() {
    applyPracticeSet(
      [...consonantSymbols],
      "consonants",
    );
  }

  function selectJustVowels() {
    applyPracticeSet(
      [...vowelSymbols],
      "vowels",
    );
  }

  function clearAllSounds() {
    applyPracticeSet(
      [],
      "custom",
    );
  }

  function checkAnswer() {
  const ordinaryActiveCount =
    featureNames.filter(
      (feature) =>
        activeFeatures[feature] ?? true,
    ).length;

  if (
    currentSound.category === "vowel" &&
    ordinaryActiveCount === 0
  ) {
    alert(
      "Turn on at least one vowel feature before submitting.",
    );
    return;
  }

  const errors: HistoryError[] = [];

  /*
   * Check the ordinary binary features.
   */
  for (const feature of featureNames) {
    if (!activeFeatures[feature]) {
      continue;
    }

    const selectedValue = answers[feature];
    const correctValue =
      currentSound.features[feature];

    if (selectedValue !== correctValue) {
      errors.push({
        feature: `[±${feature}]`,
        selected: displayFeatureAnswer(
          feature,
          selectedValue,
        ),
        correct: displayFeatureAnswer(
          feature,
          correctValue,
        ),
      });
    }
  }

  /*
   * Check consonant place nodes and their
   * dependent features.
   */
  if (currentSound.category === "consonant") {
    for (const place of placeNames) {
      const expectedPlaceFeatures =
        currentSound.places?.[place];

      const shouldBeChecked =
        expectedPlaceFeatures !== undefined;

      const isChecked = selectedPlaces[place];

      if (isChecked !== shouldBeChecked) {
        errors.push({
          feature: `${place.toUpperCase()}`,
          selected: isChecked
            ? "Checked"
            : "Not checked",
          correct: shouldBeChecked
            ? "Checked"
            : "Not checked",
        });
      }

      /*
       * Check the dependent features whenever
       * the target sound contains this place node.
       */
      if (expectedPlaceFeatures) {
        for (const feature of placeDefinitions[place]) {
          const answerKey = placeAnswerKey(
            place,
            feature,
          );

          if (!activeFeatures[answerKey]) {
            continue;
          }

          const selectedValue = answers[answerKey];
          const correctValue =
            expectedPlaceFeatures[feature];

          if (selectedValue !== correctValue) {
            errors.push({
              feature: `[±${feature}]`,
              selected: displayFeatureAnswer(
                feature,
                selectedValue,
              ),
              correct: displayFeatureAnswer(
                feature,
                correctValue,
              ),
            });
          }
        }
      }
    }
  }

  const isCorrect = errors.length === 0;

  setResult(isCorrect ? "correct" : "incorrect");

  setScore((previousScore) => ({
    correct:
      previousScore.correct + (isCorrect ? 1 : 0),
    total: previousScore.total + 1,
  }));

  const newHistoryEntry: HistoryEntry = {
    id: `${Date.now()}-${Math.random()}`,
    symbol: currentSound.symbol,
    description: currentSound.description,
    isCorrect,
    errors,
    submittedAt: new Date().toISOString(),
  };

  /*
   * Put the newest attempt first and retain
   * the most recent 50 submissions.
   */
  setHistory((previousHistory) => [
    newHistoryEntry,
    ...previousHistory,
  ].slice(0, 50));
}

  function showNewRandomSound() {
  const nextRandomSound = getRandomSound(
    selectedSymbols,
    currentSound.symbol,
  );

  if (!nextRandomSound) {
    alert(
      "Select at least one sound in the sound list.",
    );
    return;
  }

  setCurrentSound(nextRandomSound);
  setAnswers({});
  setSelectedPlaces(createEmptyPlaces());
  setResult(null);
}

  
  const consonantSounds = sounds.filter(
  (sound) => sound.category === "consonant",
);

const vowelSounds = sounds.filter(
  (sound) => sound.category === "vowel",
);


  return (
    <div className={`app-layout ${currentSound.category}-theme`}>
      <aside className="sound-selector">
        <div className="selector-heading">
          <p className="eyebrow">Sound inventory</p>
          <h2>Choose your practice set</h2>

          <div className="selector-count">
            <strong>{selectedSymbols.length}</strong>
            <span>of {sounds.length} sounds active</span>
          </div>
        </div>

        <section className="quick-filter-section">
          <h3>Quick filters</h3>

          <div className="quick-filter-grid">
            <button
              type="button"
              className={
                activePracticeSet === "all"
                  ? "active"
                  : ""
              }
              onClick={selectAllSounds}
            >
              <span>All sounds</span>
              <small>{allSoundSymbols.length}</small>
            </button>

            <button
              type="button"
              className={
                activePracticeSet ===
                "consonants"
                  ? "active"
                  : ""
              }
              onClick={selectJustConsonants}
            >
              <span>Just consonants</span>
              <small>{consonantSymbols.length}</small>
            </button>

            <button
              type="button"
              className={
                activePracticeSet === "vowels"
                  ? "active"
                  : ""
              }
              onClick={selectJustVowels}
            >
              <span>Just vowels</span>
              <small>{vowelSymbols.length}</small>
            </button>
          </div>
        </section>

        <section className="feature-filter-section">
          <div className="feature-filter-heading">
            <div>
              <h3>Feature filters</h3>
              <p>Only checked features appear in the workspace and are graded.</p>
            </div>
            <span>
              {featureNames.filter(
                (feature) => activeFeatures[feature] ?? true,
              ).length}/{featureNames.length}
            </span>
          </div>

          <div className="feature-filter-actions">
            <button type="button" onClick={() => setAllOrdinaryFeatures(true)} disabled={result !== null}>Check all</button>
            <button type="button" onClick={() => setAllOrdinaryFeatures(false)} disabled={result !== null}>Uncheck all</button>
          </div>

          <div className="feature-filter-list">
            {featureNames.map((feature) => {
              const isActive = activeFeatures[feature] ?? true;
              return (
                <label className={`feature-filter-option ${isActive ? "active" : ""}`} key={feature}>
                  <input type="checkbox" checked={isActive} onChange={() => toggleFeature(feature)} disabled={result !== null} />
                  <span className="feature-filter-check">{isActive ? "✓" : ""}</span>
                  <span>[±{feature}]</span>
                </label>
              );
            })}
          </div>

          {currentSound.category === "consonant" && (
            <div className="dependent-filter-area">
              <div className="dependent-filter-heading">
                <div>
                  <strong>Place-dependent features</strong>
                  <small>These appear only inside an opened place node.</small>
                </div>
                <div className="feature-filter-actions compact">
                  <button type="button" onClick={() => setAllDependentFeatures(true)} disabled={result !== null}>All</button>
                  <button type="button" onClick={() => setAllDependentFeatures(false)} disabled={result !== null}>None</button>
                </div>
              </div>

              {placeNames.map((place) => (
                <div className="dependent-filter-group" key={place}>
                  <h4>{place}</h4>
                  <div className="feature-filter-list">
                    {placeDefinitions[place].map((feature) => {
                      const answerKey = placeAnswerKey(place, feature);
                      const isActive = activeFeatures[answerKey] ?? true;
                      return (
                        <label className={`feature-filter-option ${isActive ? "active" : ""}`} key={answerKey}>
                          <input type="checkbox" checked={isActive} onChange={() => toggleFeature(answerKey)} disabled={result !== null} />
                          <span className="feature-filter-check">{isActive ? "✓" : ""}</span>
                          <span>[±{feature}]</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="selector-actions">
          <button type="button" onClick={selectAllSounds}>
            Select all
          </button>

          <button type="button" onClick={clearAllSounds}>
            Clear all
          </button>
        </div>

        {selectedSymbols.length === 0 && (
          <p className="selection-warning">
            Select at least one sound.
          </p>
        )}

        <section className="sound-group">
          <h3>Consonants</h3>

          <div className="sound-checkbox-list">
            {consonantSounds.map((sound) => (
              <label
                className={`sound-checkbox ${
                  selectedSymbols.includes(sound.symbol)
                    ? "sound-checkbox-active"
                    : ""
                }`}
                key={sound.symbol}
              >
                <input
                  type="checkbox"
                  checked={selectedSymbols.includes(
                    sound.symbol,
                  )}
                  onChange={() =>
                    toggleSound(sound.symbol)
                  }
                />

                <span className="sidebar-symbol">
                  /{sound.symbol}/
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="sound-group">
          <h3>Vowels</h3>

          <div className="sound-checkbox-list">
            {vowelSounds.map((sound) => (
              <label
                className={`sound-checkbox ${
                  selectedSymbols.includes(sound.symbol)
                    ? "sound-checkbox-active"
                    : ""
                }`}
                key={sound.symbol}
              >
                <input
                  type="checkbox"
                  checked={selectedSymbols.includes(
                    sound.symbol,
                  )}
                  onChange={() =>
                    toggleSound(sound.symbol)
                  }
                />

                <span className="sidebar-symbol">
                  /{sound.symbol}/
                </span>
              </label>
            ))}
          </div>
        </section>
      </aside>

      <main className="app">
        <header className="app-header">
          <div>
            <p className="eyebrow">
              Interactive phonology lab
            </p>

            <h1>IPA Feature Trainer</h1>

            <p>
              Assign binary features and, for consonants,
              identify each active place node and its dependent
              features.
            </p>
          </div>

          <div
            className="score"
            aria-label={`Score ${score.correct} out of ${score.total}`}
          >
            <span className="score-label">Score</span>
            <strong className="score-value">
              {score.correct}
              <span>/{score.total}</span>
            </strong>
          </div>
        </header>

        <section className="sound-card" aria-live="polite">
          <div className="sound-card-header">
            <span className="sound-card-label">
              Current sound
            </span>

            <span className="category-badge">
              {formatCategory(currentSound.category)}
            </span>
          </div>

          <div className="sound-stage">
            <span
              className="sound-orbit orbit-one"
              aria-hidden="true"
            />
            <span
              className="sound-orbit orbit-two"
              aria-hidden="true"
            />

            <div className="waveform" aria-hidden="true">
              {Array.from({ length: 11 }, (_, index) => (
                <span key={index} />
              ))}
            </div>

            <div className="ipa-symbol">
              /{currentSound.symbol}/
            </div>
          </div>

          <p className="sound-card-note">
            {currentSound.category === "consonant"
              ? "Binary features + place nodes"
              : "Binary vowel features"}
          </p>
        </section>

        <section className="feature-workspace">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Step 1</p>
              <h2>Set the visible binary features</h2>
            </div>

            <p className="section-help">
              The sidebar controls which features appear here and which are graded.
            </p>
          </div>

          <div className="features">
            {featureNames
              .filter(
                (feature) => activeFeatures[feature] ?? true,
              )
              .map((feature, index) => {
              const selectedValue = answers[feature];

              const isIncorrect =
                result !== null &&
                selectedValue !==
                  currentSound.features[feature];

              return (
                <div
                  className={`feature-row ${
                    isIncorrect ? "incorrect-row" : ""
                  }`}
                  key={feature}
                >
                  <div className="feature-heading">
                    <span className="feature-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="feature-name">
                      [±{feature}]
                    </span>

                  </div>

                  <div
                    className="feature-buttons"
                    aria-label={`Select a value for ${feature}`}
                  >
                    <button
                      type="button"
                      className={
                        selectedValue === "+"
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        selectValue(feature, "+")
                      }
                      disabled={result !== null}
                      aria-label={`Positive ${feature}`}
                    >
                      +
                    </button>

                    <button
                      type="button"
                      className={
                        selectedValue === "-"
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        selectValue(feature, "-")
                      }
                      disabled={result !== null}
                      aria-label={`Negative ${feature}`}
                    >
                      −
                    </button>
                  </div>

                  {result !== null && (
                    <span className="correct-value">
                      Correct: [{currentSound.features[feature]}{feature}]
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {currentSound.category === "consonant" && (
          <section className="place-groups">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Step 2</p>
                <h2>Choose the place nodes</h2>
              </div>

              <p className="section-help">
                Open only the place node or nodes relevant to the sound. The sidebar controls which dependent features appear.
              </p>
            </div>

            <div className="place-grid">
              {placeNames.map((place, placeIndex) => {
                const isChecked = selectedPlaces[place];

                const expectedPlaceFeatures =
                  currentSound.places?.[place];

                const shouldBeChecked =
                  expectedPlaceFeatures !== undefined;

                const placeIsIncorrect =
                  result !== null &&
                  isChecked !== shouldBeChecked;

                const showDependentFeatures =
                  isChecked ||
                  (result !== null && shouldBeChecked);

                return (
                  <div
                    className={`place-section place-${place} ${
                      isChecked ? "place-section-active" : ""
                    } ${
                      placeIsIncorrect
                        ? "incorrect-place"
                        : ""
                    }`}
                    key={place}
                  >
                    <div className="place-header">
                      <label className="place-toggle">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePlace(place)}
                          disabled={result !== null}
                        />

                        <span className="place-number">
                          {String(placeIndex + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <span className="place-name">
                          {place.toUpperCase()}
                        </span>
                      </label>

                      <span className="place-feature-count">
                        {placeDefinitions[place].filter(
                          (feature) => activeFeatures[placeAnswerKey(place, feature)] ?? true,
                        ).length}{" "}
                        {placeDefinitions[place].filter(
                          (feature) => activeFeatures[placeAnswerKey(place, feature)] ?? true,
                        ).length === 1 ? "feature" : "features"}
                      </span>

                      {result !== null && (
                        <span className="correct-value">
                          Correct:{" "}
                          {shouldBeChecked
                            ? "checked"
                            : "not checked"}
                        </span>
                      )}
                    </div>

                    {showDependentFeatures && (
                      <div className="place-details">
                        {placeDefinitions[place]
                          .filter(
                            (feature) => activeFeatures[placeAnswerKey(place, feature)] ?? true,
                          )
                          .map((feature) => {
                            const answerKey = placeAnswerKey(
                              place,
                              feature,
                            );

                            const selectedValue =
                              answers[answerKey];

                            const expectedValue =
                              expectedPlaceFeatures?.[feature];

                            const featureIsIncorrect =
                              result !== null &&
                              selectedValue !== expectedValue;

                            return (
                              <div
                                className={`feature-row dependent-feature-row ${
                                  featureIsIncorrect ? "incorrect-row" : ""
                                }`}
                                key={feature}
                              >
                                <div className="feature-heading">
                                  <span className="dependent-dot" />

                                  <span className="feature-name">
                                    [±{feature}]
                                  </span>

                                </div>

                                <div className="feature-buttons">
                                  <button
                                    type="button"
                                    className={
                                      selectedValue === "+"
                                        ? "selected"
                                        : ""
                                    }
                                    onClick={() =>
                                      selectValue(
                                        answerKey,
                                        "+",
                                      )
                                    }
                                    disabled={result !== null}
                                    aria-label={`Positive ${feature}`}
                                  >
                                    +
                                  </button>

                                  <button
                                    type="button"
                                    className={
                                      selectedValue === "-"
                                        ? "selected"
                                        : ""
                                    }
                                    onClick={() =>
                                      selectValue(
                                        answerKey,
                                        "-",
                                      )
                                    }
                                    disabled={result !== null}
                                    aria-label={`Negative ${feature}`}
                                  >
                                    −
                                  </button>
                                </div>

                                {result !== null && expectedValue && (
                                  <span className="correct-value">
                                    Correct: [{expectedValue}{feature}]
                                  </span>
                                )}

                                {result !== null && !expectedValue && (
                                  <span className="correct-value">Not applicable</span>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {result === null ? (
          <div className="action-buttons">
            <button
              type="button"
              className="secondary-button"
              onClick={showNewRandomSound}
            >
              New random sound
            </button>

            <button
              type="button"
              className="main-button"
              onClick={checkAnswer}
            >
              Submit answer
            </button>
          </div>
        ) : (
          <section
            className={`feedback ${
              result === "correct"
                ? "correct-feedback"
                : "incorrect-feedback"
            }`}
          >
            <p className="feedback-kicker">
              Feature analysis
            </p>

            <h2>
              {result === "correct"
                ? "Correct"
                : "Some features were incorrect"}
            </h2>

            <p>
              <span className="feedback-symbol">
                /{currentSound.symbol}/
              </span>{" "}
              is a{" "}
              <strong>{currentSound.description}</strong>.
            </p>

            <button
              type="button"
              className="main-button"
              onClick={showNewRandomSound}
            >
              Next random sound
            </button>
          </section>
        )}

        <section className="history-panel">
          <div className="history-header">
            <div>
              <p className="section-kicker">
                Saved locally
              </p>
              <h2>Attempt history</h2>

              <p>
                Your 50 most recent submissions are stored on
                this device.
              </p>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                className="clear-history-button"
                onClick={clearHistory}
              >
                Clear history
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="history-empty">
              No answers have been submitted yet.
            </p>
          ) : (
            <div className="history-list">
              {history.map((entry) => (
                <article
                  className={`history-entry ${
                    entry.isCorrect
                      ? "correct-history-entry"
                      : "incorrect-history-entry"
                  }`}
                  key={entry.id}
                >
                  <div className="history-entry-heading">
                    <div className="history-sound-block">
                      <span className="history-symbol">
                        /{entry.symbol}/
                      </span>

                      <div>
                        <span className="history-caption">
                          Feature analysis
                        </span>
                        <p className="history-description">
                          {entry.description}
                        </p>
                      </div>
                    </div>

                    <span className="history-result">
                      {entry.isCorrect
                        ? "Correct"
                        : `${entry.errors.length} ${
                            entry.errors.length === 1
                              ? "error"
                              : "errors"
                          }`}
                    </span>
                  </div>

                  <p className="history-time">
                    {new Date(
                      entry.submittedAt,
                    ).toLocaleString()}
                  </p>

                  {!entry.isCorrect && (
                    <div className="history-errors">
                      {entry.errors.map(
                        (error, index) => (
                          <div
                            className="history-error"
                            key={`${entry.id}-${index}`}
                          >
                            <strong>{error.feature}</strong>

                            <span>
                              Your answer: {error.selected}
                            </span>

                            <span>
                              Correct: {error.correct}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
