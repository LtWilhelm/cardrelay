import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { testfile } from "./consts/testfile";
import { useDeckImages } from "./hooks/useDeckImages";
import { useInput } from "./hooks/useInput";
import { CardRow } from "./components/CardRow";
import jsPDF from "jspdf";
import { naturalsUntil } from "./util/generator";

const statusContext = createContext<
  { status: string; setStatus: Dispatch<SetStateAction<string>> }
>({ status: "", setStatus: () => {} });

function App() {
  // const itemsPerPage = 4;
  const [pageIndex, setPageIndex] = useState(0);

  const currentDeck = testfile.ObjectStates[0];

  const [status, setStatus] = useState("");

  const [perPage, bindPerPage, resetPerPage, setValuePerPage] = useInput(4);
  const [bleed, bindBleed, resetBleed, setValueBleed] = useInput(0);

  const [margin, bindMargin] = useInput(.5);
  const [ppi, bindPPI] = useInput(300);

  const images = useDeckImages(currentDeck);

  const pageSizes = ["Letter", "A4"];
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

  const pageCount = Math.ceil(currentDeck.DeckIDs.length / perPage);

  const [cardWidth, bindCardWidth] = useInput(2.5);
  const [cardHeight, bindCardHeight] = useInput(3.5);

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
      <main className="container border border-orange-950">
        <button
          className="fixed bottom-16 right-16 text-2xl bg-green-700 p-2 rounded-md"
          onClick={save}
          disabled={printMode}
        >
          {printMode ? "Creating Cards..." : "Save"}
        </button>
        <header className="flex gap-8 justify-start">
          <div>
            <h1 className="text-5xl">Card Relay</h1>
            <h2 className="text-xl">
              A simple tool for creating<br />
              gutter-fold layouts for cards<br />
              from a TTS json file
            </h2>
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
                />
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
              <h3>Cards</h3>
              <label>
                Cards Per Page:&nbsp;
                <input
                  type="number"
                  {...bindPerPage}
                  max={6}
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
                />
                in.
              </label>
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
                ref={pageRef}
                className="paper letter flex flex-col"
                style={{
                  paddingLeft: margin + "in",
                  paddingRight: margin + "in",
                  paddingTop: margin + "in",
                }}
              >
                {!!images.length && currentDeck.DeckIDs.slice(
                  pageStart,
                  perPage + pageStart,
                ).map((idx, i) => {
                  const deckId = idx.toString().charAt(0);
                  const frontImage = images.find((e) =>
                    e.deckIndex === deckId && e.type === "front"
                  );
                  const backImage = images.find((e) =>
                    e.deckIndex === deckId && e.type === "back"
                  );
                  return (
                    <CardRow
                      idx={idx}
                      i={i}
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
      </main>
    </statusContext.Provider>
  );
}

export default App;
