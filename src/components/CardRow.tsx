import { CardRenderer } from "./cardRenderer";

export interface IProps {
  idx: number;
  i: number;
  cardHeight: number;
  bleed: number;
  cardWidth: number;
  margin: number;
  frontImage: ImageInfo | undefined;
  ppi: number;
  frontBleedType: BleedType;
  frontBleedColor: string;
  backImage: ImageInfo | undefined;
  backBleedType: BleedType;
  backBleedColor: string;
}

export function CardRow(
  {
    idx,
    i,
    cardHeight,
    bleed,
    cardWidth,
    margin,
    frontImage,
    ppi,
    frontBleedType,
    frontBleedColor,
    backImage,
    backBleedType,
    backBleedColor,
  }: IProps,
) {
  return (
    <div
      key={"card:" + idx + i}
      className="flex justify-between"
    >
      <div
        className=" relative border-red-300"
        // Bear in mind that cards are rotated, width and height are swapped
        style={{
          width: (cardHeight + (2 * bleed)) + "in",
          height: (cardWidth + (2 * bleed)) + "in",
        }}
      >
        <div
          className="absolute border-b border-r border-black"
          style={{
            top: -(bleed + margin) + "in",
            left: -(bleed + margin) + "in",
            width: bleed + margin + "in",
            height: bleed + margin + "in",
          }}
        >
        </div>
        {!!frontImage && (
          <CardRenderer
            image={frontImage.image}
            height={2.5}
            width={3.5}
            ppi={ppi}
            imageHeight={frontImage.cardHeight}
            imageWidth={frontImage.cardWidth}
            cardPosX={Math.floor(idx % 100 % frontImage.numWidth)}
            cardPosY={Math.floor(idx % 100 / frontImage.numWidth)}
            bleed={bleed}
            bleedType={frontBleedType}
            bleedColor={frontBleedType === "solid"
              ? frontBleedColor
              : undefined}
          >
          </CardRenderer>
        )}
      </div>
      <div className="border border-b-0 border-dashed border-black">
      </div>
      <div
        className=" relative border-red-300"
        // Bear in mind that cards are rotated, width and height are swapped
        style={{
          width: (cardHeight + (2 * bleed)) + "in",
          height: (cardWidth + (2 * bleed)) + "in",
        }}
      >
        {!!backImage && (
          <CardRenderer
            image={backImage.image}
            height={2.5}
            width={3.5}
            ppi={ppi}
            imageHeight={backImage.cardHeight}
            imageWidth={backImage.cardWidth}
            cardPosX={!backImage.uniqueBack
              ? 0
              : idx % 100 % backImage.numWidth}
            cardPosY={!backImage.uniqueBack
              ? 0
              : idx % 100 % backImage.numHeight}
            flip={-1}
            bleed={bleed}
            bleedType={backBleedType}
            bleedColor={backBleedType === "solid" ? backBleedColor : undefined}
          >
          </CardRenderer>
        )}
      </div>
    </div>
  );
}
