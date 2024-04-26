import {
  ChangeEvent,
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDeckImages } from "./hooks/useDeckImages";
import { useCheckbox, useInput } from "./hooks/useInput";
import { CardRow } from "./components/CardRow";
import { naturalsUntil } from "./util/generator";
import { TTSUploader } from "./components/TTSUploader";

const statusContext = createContext<
  { status: string; setStatus: Dispatch<SetStateAction<string>> }
>({ status: "", setStatus: () => {} });

function App() {
  // const itemsPerPage = 4;
  const [pageIndex, setPageIndex] = useState(0);

  const [ttsFile, setTTSFile] = useState<{ ObjectStates: TTSObjectState[] }>();

  const [currentDeck, setCurrentDeck] = useState<TTSObjectState>();

  function changeDeck(e: ChangeEvent<HTMLSelectElement>) {
    setCurrentDeck(() => {
      const selected = ttsFile?.ObjectStates[Number(e.target.value)];
      return selected;
    });
  }

  const [status, setStatus] = useState("");

  const [perPage, bindPerPage] = useInput(4);
  const [bleed, bindBleed] = useInput(0);

  const [margin, bindMargin] = useInput(.5);
  const [ppi, bindPPI] = useInput(300);

  const images = useDeckImages(currentDeck);

  const pageSizes = [
    "Letter",
    //  "A4"
  ];
  const [pageSize, bindPageSize] = useInput("letter");

  const bleedTypes = [
    [
      "Solid Color",
      "solid",
    ],
    [
      "Generate",
      "gen",
    ],
  ];
  const [frontBleedType, bindFrontBleedType] = useInput<BleedType>("solid");
  const [frontBleedColor, bindFrontBleedColor] = useInput("");

  const [backBleedType, bindBackBleedType] = useInput<BleedType>("solid");
  const [backBleedColor, bindBackBleedColor] = useInput("");

  const [pageCount, setPageCount] = useState<number>(0);
  useEffect(() => {
    setPageCount(() => {
      if (!currentDeck) return 0;
      return Math.ceil(currentDeck.DeckIDs.length / perPage);
    });
  }, [currentDeck]);

  const [cardWidth, bindCardWidth, _cw, setCardWidth] = useInput<number>(2.5);
  const [cardHeight, bindCardHeight, _ch, setCardHeight] = useInput<number>(
    3.5,
  );
  const [aspectRatio, setAspectRatio] = useState(cardWidth / cardHeight);

  const [preserveAspectRatio, bindPreserveAR] = useCheckbox(false);
  const [deriveAR, bindDeriveAR] = useCheckbox(false);

  useEffect(() => {
    if (!images || !deriveAR) return;
    const frontImage = images.find((i) => i.type === "front") ||
      images.find((i) => i.type === "back");
    if (!frontImage) return;
    const cannonicalAspectRatio = frontImage.cardWidth / frontImage.cardHeight;

    setAspectRatio(cannonicalAspectRatio);
  }, [currentDeck, images, deriveAR]);

  useEffect(() => {
    if (!preserveAspectRatio) return;
    setCardHeight((ch) => {
      const correctedHeight = cardWidth / aspectRatio;
      if (ch !== correctedHeight) return correctedHeight;
      return ch;
    });
  }, [aspectRatio, cardWidth, preserveAspectRatio]);
  useEffect(() => {
    if (!preserveAspectRatio) return;
    setCardWidth((cw) => {
      const correctedWidth = cardHeight * aspectRatio;
      if (cw !== correctedWidth) return correctedWidth;
      return cw;
    });
  }, [aspectRatio, cardHeight, preserveAspectRatio]);

  const pageRef = useRef<HTMLDivElement>(null);

  const [printMode, setPrintMode] = useState(false);

  const save = useCallback(() => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setPrintMode(false);
      }, 10);
    }, 3000);
  }, [pageRef]);

  return (
    <statusContext.Provider value={{ status, setStatus }}>
      <main className="container p-2">
        {!!currentDeck && (
          <button
            className="fixed bottom-16 right-16 text-2xl bg-green-700 p-2 rounded-md z-50"
            onClick={save}
            disabled={printMode}
          >
            {printMode ? "Creating Cards..." : "Save"}
          </button>
        )}
        <header className="flex gap-8 justify-start">
          <div>
            <h1 className="text-5xl">Card Relay</h1>
            <h2 className="text-xl">
              A simple tool for creating<br />
              gutter-fold layouts for cards<br />
              from a TTS json file
            </h2>
          </div>
          <div>
            <h2>Deck Selection</h2>
            <TTSUploader setTTSFile={setTTSFile} />
            <br />
            {!!ttsFile && (
              <select onChange={changeDeck}>
                <option value="">Select a deck...</option>
                {ttsFile.ObjectStates.map((s, i) => (
                  <option value={i} key={s.Nickname}>{s.Nickname}</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex flex-wrap gap-y-1 gap-x-4">
            <h2 className="text-xl w-full">Layout Settings</h2>
            <div>
              <h3>Page</h3>
              <label>
                Page Size:&nbsp;
                <select {...bindPageSize}>
                  {pageSizes.map((s) => (
                    <option key={s} value={s.toLowerCase()}>{s}</option>
                  ))}
                </select>
              </label>
              <br />
              <label>
                Margins:&nbsp;
                <input
                  className="w-16"
                  type="number"
                  {...bindMargin}
                  min={0}
                  step={.1}
                />{" "}
                in.
              </label>
              <br />
              <label>
                PPI:&nbsp;
                <input
                  className="w-16"
                  type="number"
                  {...bindPPI}
                  min={0}
                />
              </label>
            </div>

            <div>
              <div className="flex flex-wrap gap-x-2">
                <h3 className="w-full">Cards</h3>
                <div>
                  <label>
                    Cards Per Page:&nbsp;
                    <input
                      type="number"
                      {...bindPerPage}
                      min={1}
                      className="w-16"
                    />
                  </label>
                  <br />
                  <label>
                    Bleed:&nbsp;
                    <input
                      type="number"
                      {...bindBleed}
                      max={.5}
                      min={0}
                      step={.01}
                      className="w-16"
                    />{" "}
                    in.
                  </label>
                </div>
                <div>
                  <label>
                    Card Width:&nbsp;
                    <input
                      type="number"
                      {...bindCardWidth}
                      min={0}
                      step={.01}
                      className="w-16"
                    />{" "}
                    in.
                  </label>
                  <br />
                  <label>
                    Card Height:&nbsp;
                    <input
                      type="number"
                      {...bindCardHeight}
                      min={0}
                      step={.01}
                      className="w-16"
                    />{" "}
                    in.
                  </label>
                  <br />
                  <label>
                    <input type="checkbox" {...bindPreserveAR} />{" "}
                    Preserve Aspect Ratio
                  </label>
                  <br />
                  {preserveAspectRatio && (
                    <div className="w-min">
                      <label className="whitespace-nowrap">
                        <input type="checkbox" {...bindDeriveAR} />{" "}
                        Derive aspect ratio from image
                      </label>
                      <br />
                      <small>
                        <span className="text-red-600">Warning:</span>{" "}
                        a bit funky right now, it should work, but you may need
                        to change height or width a few times before it calms
                        down
                      </small>
                      <br />
                      <small>
                        <span className="text-red-600">
                          Warning 2 electric boogaloo:
                        </span>{" "}
                        don't use this option if you exported your TTS file with
                        bleed as the calculation will not be correct
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {bleed > 0 && (
              <div>
                <h3>Bleed</h3>
                <label>
                  Front Bleed Type:&nbsp;
                  <select {...bindFrontBleedType}>
                    {bleedTypes.map((t) => (
                      <option key={t[1] + t[0]} value={t[1]}>{t[0]}</option>
                    ))}
                  </select>
                </label>
                {frontBleedType === "solid" && (
                  <label>
                    &nbsp;Color:&nbsp;
                    <input type="text" {...bindFrontBleedColor} />
                  </label>
                )}
                <br />
                <label>
                  Back Bleed Type:&nbsp;
                  <select {...bindBackBleedType}>
                    {bleedTypes.map((t) => (
                      <option key={t[1] + t[0]} value={t[1]}>{t[0]}</option>
                    ))}
                  </select>
                  {backBleedType === "solid" && (
                    <label>
                      &nbsp;Color:&nbsp;
                      <input type="text" {...bindBackBleedColor} />
                    </label>
                  )}
                </label>
              </div>
            )}
          </div>
        </header>

        {!!currentDeck && (
          <div className="text-center w-full text-xl mt-4 relative">
            <p>Page {pageIndex + 1}</p>

            <div className="flex gap-2 absolute top-1/2 left-10">
              <button
                className="rounded-md p-1 px-2 bg-purple-700 disabled:bg-purple-950 disabled:opacity-50"
                disabled={pageIndex <= 0}
                onClick={() => setPageIndex(0)}
              >
                {"|<"}
              </button>
              <button
                className="rounded-md p-1 bg-purple-700 disabled:bg-purple-950 disabled:opacity-50"
                disabled={pageIndex === 0}
                onClick={() => setPageIndex(pageIndex - 1)}
              >
                Prev
              </button>
            </div>
            <div className="flex gap-2 absolute top-1/2 right-10">
              <button
                className="rounded-md p-1 bg-purple-700 disabled:bg-purple-950 disabled:opacity-50"
                disabled={pageIndex === pageCount - 1}
                onClick={() => setPageIndex(pageIndex + 1)}
              >
                Next
              </button>
              <button
                className="rounded-md p-1 px-2 bg-purple-700 disabled:bg-purple-950 disabled:opacity-50"
                disabled={pageIndex >= pageCount - 2}
                onClick={() => setPageIndex(pageCount - 1)}
              >
                {">|"}
              </button>
            </div>

            {Array.from(naturalsUntil(pageCount)).filter((p) =>
              p === pageIndex || printMode
            ).map((p) => {
              const pageStart = p * perPage;
              return (
                <div
                  key={"page: " + printMode ? 0 : p}
                  ref={pageRef}
                  className="paper letter flex flex-col"
                  style={{
                    paddingLeft: margin + "in",
                    paddingRight: margin + "in",
                    paddingTop: margin + "in",
                  }}
                >
                  {!!images.length && currentDeck?.ContainedObjects.slice(
                    pageStart,
                    perPage + pageStart,
                  ).map(({ CardID, Nickname }, i) => {
                    const deckId = CardID.toString().charAt(0);
                    const frontImage = images.find((e) =>
                      e.deckIndex === deckId && e.type === "front"
                    );
                    const backImage = images.find((e) =>
                      e.deckIndex === deckId && e.type === "back"
                    );
                    return (
                      <CardRow
                        key={"card:" + CardID + Nickname + i}
                        idx={CardID}
                        cardHeight={cardHeight}
                        bleed={bleed}
                        cardWidth={cardWidth}
                        margin={margin}
                        frontImage={frontImage}
                        ppi={ppi}
                        frontBleedType={frontBleedType}
                        frontBleedColor={frontBleedColor}
                        backImage={backImage}
                        backBleedType={backBleedType}
                        backBleedColor={backBleedColor}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </statusContext.Provider>
  );
}

export default App;
