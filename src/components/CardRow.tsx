import { CSSProperties } from "react";
import { CardRenderer } from "./cardRenderer";

interface IProps {
  idx: number;
  cardHeight: number;
  bleed: number;
  cardWidth: number;
  frontImage: ImageInfo | undefined;
  ppi: number;
  frontBleedType: BleedType;
  frontBleedColor: string;
  backImage: ImageInfo | undefined;
  backBleedType: BleedType;
  backBleedColor: string;
  cropLayerBehind: boolean;
  cropMarkColor: string;
}

export function CardRow(
  {
    idx,
    cropLayerBehind,
    cardHeight,
    bleed,
    cardWidth,
    frontImage,
    ppi,
    frontBleedType,
    frontBleedColor,
    backImage,
    backBleedType,
    backBleedColor,
    cropMarkColor,
  }: IProps,
) {
  return (
    <div className="flex justify-between">
      <Card
        cardHeight={cardHeight}
        bleed={bleed}
        cardWidth={cardWidth}
        image={frontImage}
        ppi={ppi}
        idx={idx}
        bleedType={frontBleedType}
        bleedColor={frontBleedColor}
        flip={1}
        cropLayerBehind={cropLayerBehind}
        cropMarkColor={cropMarkColor}
      />
      <div className="border border-b-0 border-dashed border-black">
      </div>
      <Card
        cropMarkColor={cropMarkColor}
        cardHeight={cardHeight}
        bleed={bleed}
        cardWidth={cardWidth}
        image={backImage}
        ppi={ppi}
        idx={idx}
        bleedType={backBleedType}
        bleedColor={backBleedColor}
        flip={-1}
        cropLayerBehind={cropLayerBehind}
      />
    </div>
  );
}

interface ICardProps {
  cardHeight: number;
  bleed: number;
  cardWidth: number;
  image: ImageInfo | undefined;
  ppi: number;
  idx: number;
  bleedType: BleedType;
  bleedColor: string;
  flip: 1 | -1;
  cropLayerBehind: boolean;
  cropMarkColor: string;
}

function Card(
  {
    cardHeight,
    bleed,
    cardWidth,
    image,
    ppi,
    idx,
    bleedType: backBleedType,
    bleedColor: backBleedColor,
    flip,
    cropLayerBehind,
    cropMarkColor,
  }: ICardProps,
) {
  return (
    <div
      className="relative border-red-300"
      // Bear in mind that cards are rotated, width and height are swapped
      style={{
        width: (cardHeight + (2 * bleed)) + "in",
        height: (cardWidth + (2 * bleed)) + "in",
        // height: "min-content",
        "--crop-color": cropMarkColor || "black",
      } as CSSProperties}
    >
      {!!image && (
        <CardRenderer
          image={image.image}
          height={cardWidth}
          width={cardHeight}
          ppi={ppi}
          imageHeight={image.cardHeight}
          imageWidth={image.cardWidth}
          cardPosX={!image.uniqueBack && image.type === "back"
            ? 0
            : idx % 100 % image.numWidth}
          cardPosY={!image.uniqueBack && image.type === "back"
            ? 0
            : Math.floor(idx % 100 / image.numWidth)}
          flip={flip}
          bleed={bleed}
          bleedType={backBleedType}
          bleedColor={backBleedType === "solid" ? backBleedColor : undefined}
        >
        </CardRenderer>
      )}
      <div
        data-behind={cropLayerBehind}
        className="absolute z-10 data-[behind=true]:z-0"
        style={{
          bottom: bleed + "in",
          left: bleed + "in",
          // width: margin + "in",
          // height: margin + "in",
        }}
      >
        <div
          className={"relative before:w-16 before:h-16 before:border-t before:border-r before:border-[--crop-color] before:absolute before:right-0 before:top-0"}
        />
      </div>
      <div
        data-behind={cropLayerBehind}
        className="absolute z-10 data-[behind=true]:z-0"
        style={{
          bottom: bleed + "in",
          right: bleed + "in",
          // width: margin + "in",
          // height: margin + "in",
        }}
      >
        <div
          className={"relative before:w-16 before:h-16 before:border-t before:border-l before:border-[--crop-color] before:absolute before:left-0 before:top-0"}
        />
      </div>
      <div
        data-behind={cropLayerBehind}
        className="absolute z-10 data-[behind=true]:z-0"
        style={{
          top: bleed + "in",
          right: bleed + "in",
          // width: margin + "in",
          // height: margin + "in",
        }}
      >
        <div
          className={"relative before:w-16 before:h-16 before:border-b before:border-l before:border-[--crop-color] before:absolute before:left-0 before:bottom-0"}
        />
      </div>
      <div
        data-behind={cropLayerBehind}
        className="absolute z-10 data-[behind=true]:z-0"
        style={{
          top: bleed + "in",
          left: bleed + "in",
          // width: margin + "in",
          // height: margin + "in",
        }}
      >
        <div
          className={"relative before:w-16 before:h-16 before:border-b before:border-r before:border-[--crop-color] before:absolute before:right-0 before:bottom-0"}
        />
      </div>
    </div>
  );
}
