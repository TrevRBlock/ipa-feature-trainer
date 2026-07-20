import { useState } from "react";
import "./App.css";

type FeatureValue = "+" | "-";
type SoundCategory = "consonant" | "vowel";
type FeatureMap = Record<string, FeatureValue>;
type PlaceName = "labial" | "coronal" | "dorsal";

interface Sound {
  symbol: string;
  description: string;
  category: SoundCategory;
  features: FeatureMap;
  places?: Partial<Record<PlaceName, FeatureMap>>;
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
    "voiceless dental fricative",
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
    "voiced dental fricative",
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
    "voiced postalveolar liquid",
    [
      "consonantal",
      "sonorant",
      "voice",
      "continuant",
    ],
    {
      coronal: {
        anterior: "-",
        strident: "-",
      },
    },
  ),

  consonant(
    "j",
    "voiced palatal glide",
    [
      "consonantal",
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
    "voiced labial-velar glide",
    [
      "consonantal",
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
    "high front unrounded vowel, as in FLEECE",
    ["high", "tense"],
  ),

  vowel(
    "ɪ",
    "near-high front unrounded vowel, as in KIT",
    ["high"],
  ),

  vowel(
    "ɛ",
    "mid front unrounded vowel, as in DRESS",
    [],
  ),

  vowel(
    "æ",
    "low front unrounded vowel, as in TRAP",
    ["low"],
  ),

  vowel(
    "ɑ",
    "low back unrounded vowel, as in LOT or PALM",
    ["low", "back"],
  ),



  vowel(
    "ʊ",
    "near-high back rounded vowel, as in FOOT",
    ["high", "back", "round"],
  ),

  vowel(
    "u",
    "high back rounded vowel, as in GOOSE",
    ["high", "back", "round", "tense"],
  ),

  vowel(
    "ʌ",
    "mid central unrounded vowel, as in STRUT",
    ["back"],
  ),

  vowel(
    "ə",
    "mid central vowel, or schwa",
    ["back"],
  ),

  vowel(
    "ɚ",
    "mid central rhotic vowel, as in LEARN",
    ["back"],
  ),

];

const allSoundSymbols = sounds.map((sound) => sound.symbol);

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

  const [answers, setAnswers] = useState<
    Record<string, FeatureValue | undefined>
  >({});

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


  function toggleSound(symbol: string) {
  setSelectedSymbols((previousSymbols) => {
    if (previousSymbols.includes(symbol)) {
      return previousSymbols.filter(
        (selectedSymbol) =>
          selectedSymbol !== symbol,
      );
    }

    return [...previousSymbols, symbol];
  });
}

function selectAllSounds() {
  setSelectedSymbols([...allSoundSymbols]);
}

function clearAllSounds() {
  setSelectedSymbols([]);
}

  function checkAnswer() {
  const mainFeaturesCorrect = featureNames.every(
    (feature) =>
      answers[feature] === currentSound.features[feature],
  );

  let placeNodesCorrect = true;
  let placeFeaturesCorrect = true;

  if (currentSound.category === "consonant") {
    for (const place of placeNames) {
      const expectedPlaceFeatures =
        currentSound.places?.[place];

      const shouldBeChecked =
        expectedPlaceFeatures !== undefined;

      if (selectedPlaces[place] !== shouldBeChecked) {
        placeNodesCorrect = false;
      }

      if (expectedPlaceFeatures) {
        for (const feature of placeDefinitions[place]) {
          const answerKey = placeAnswerKey(
            place,
            feature,
          );

          if (
            answers[answerKey] !==
            expectedPlaceFeatures[feature]
          ) {
            placeFeaturesCorrect = false;
          }
        }
      }
    }
  }

  const isCorrect =
    mainFeaturesCorrect &&
    placeNodesCorrect &&
    placeFeaturesCorrect;

  setResult(isCorrect ? "correct" : "incorrect");

  setScore((previousScore) => ({
    correct:
      previousScore.correct + (isCorrect ? 1 : 0),
    total: previousScore.total + 1,
  }));
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
  <div className="app-layout">
    <aside className="sound-selector">
      <div className="selector-heading">
        <div>
          <h2>Included sounds</h2>

          <p>
            {selectedSymbols.length}/{sounds.length} selected
          </p>
        </div>
      </div>

      <div className="selector-actions">
        <button
          type="button"
          onClick={selectAllSounds}
        >
          Select all
        </button>

        <button
          type="button"
          onClick={clearAllSounds}
        >
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
              className="sound-checkbox"
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
              className="sound-checkbox"
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
  <h1>IPA Feature Trainer</h1>

  <div className="score">
    Score: {score.correct}/{score.total}
  </div>
</header>

      <section className="sound-card">
  <div className="ipa-symbol">
    /{currentSound.symbol}/
  </div>

  <p className="sound-instructions">
    Select + or − for binary features. For consonants,
    check every applicable place node.
  </p>
</section>

      <section className="features">

        {featureNames.map((feature) => {
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
              <span className="feature-name">
                [±{feature}]
              </span>

              <div className="feature-buttons">
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
                >
                  −
                </button>
              </div>

              {result !== null && (
                <span className="correct-value">
                  Correct: [
                  {currentSound.features[feature]}
                  {feature}]
                </span>
              )}
            </div>
          );
        })}
      </section>

      {currentSound.category === "consonant" && (
        <section className="place-groups">
  <div className="place-grid">
            {placeNames.map((place) => {
              const isChecked =
                selectedPlaces[place];

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
                  className={`place-section ${
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
                        onChange={() =>
                          togglePlace(place)
                        }
                        disabled={result !== null}
                      />

                      <span>
                        {place.toUpperCase()}
                      </span>
                    </label>

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
                      {placeDefinitions[place].map(
                        (feature) => {
                          const answerKey =
                            placeAnswerKey(
                              place,
                              feature,
                            );

                          const selectedValue =
                            answers[answerKey];

                          const expectedValue =
                            expectedPlaceFeatures?.[
                              feature
                            ];

                          const featureIsIncorrect =
                            result !== null &&
                            selectedValue !==
                              expectedValue;

                          return (
                            <div
                              className={`feature-row ${
                                featureIsIncorrect
                                  ? "incorrect-row"
                                  : ""
                              }`}
                              key={feature}
                            >
                              <span className="feature-name">
                                [±{feature}]
                              </span>

                              <div className="feature-buttons">
                                <button
                                  type="button"
                                  className={
                                    selectedValue ===
                                    "+"
                                      ? "selected"
                                      : ""
                                  }
                                  onClick={() =>
                                    selectValue(
                                      answerKey,
                                      "+",
                                    )
                                  }
                                  disabled={
                                    result !== null
                                  }
                                >
                                  +
                                </button>

                                <button
                                  type="button"
                                  className={
                                    selectedValue ===
                                    "-"
                                      ? "selected"
                                      : ""
                                  }
                                  onClick={() =>
                                    selectValue(
                                      answerKey,
                                      "-",
                                    )
                                  }
                                  disabled={
                                    result !== null
                                  }
                                >
                                  −
                                </button>
                              </div>

                              {result !== null &&
                                expectedValue && (
                                  <span className="correct-value">
                                    Correct: [
                                    {expectedValue}
                                    {feature}]
                                  </span>
                                )}

                              {result !== null &&
                                !expectedValue && (
                                  <span className="correct-value">
                                    Not applicable
                                  </span>
                                )}
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {result === null && (
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
)}

      {result !== null && (
        <section
          className={`feedback ${
            result === "correct"
              ? "correct-feedback"
              : "incorrect-feedback"
          }`}
        >
          <h2>
            {result === "correct"
              ? "Correct"
              : "Some features were incorrect"}
          </h2>

          <p>
            /{currentSound.symbol}/ is a{" "}
            <strong>
              {currentSound.description}
            </strong>
            .
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
        </main>
  </div>
);
}

export default App;