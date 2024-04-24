import { Vector } from "@cgg/emmaline";
import { useDoodler } from "../hooks/useDoodler";
import { useEffect, useState } from "react";

interface IProps extends CardRendererConfig {
  image: HTMLImageElement;
  imageWidth: number;
  imageHeight: number;
  cardPosX: number;
  cardPosY: number;
  flip?: 1 | -1;
  bleedType: BleedType;
  bleedColor?: string;
}

export function CardRenderer(
  {
    height,
    ppi,
    width,
    image,
    imageHeight,
    imageWidth,
    cardPosX,
    cardPosY,
    flip = 1,
    bleed = 0,
    bleedType,
    bleedColor,
  }: IProps,
) {
  const [cvsRef, doodler] = useDoodler({ height, width, ppi, bleed });
  const [_, set_] = useState(0);

  useEffect(() => {
    if (!doodler) return;
    const calcdHeight = height * ppi;
    const calcdWidth = width * ppi;
    const calcdBleed = bleed * ppi;
    const layer = (c: CanvasRenderingContext2D) => {
      doodler.fillCanvas({ color: bleedColor || "white" });
      doodler.drawRotated(
        // new Vector(width / 2 * ppi, height / 2 * ppi),
        new Vector(0, 0),
        -Math.PI / 2 * flip,
        // 0,
        () => {
          doodler.drawSprite(
            image,
            new Vector(imageWidth * cardPosX, imageHeight * cardPosY),
            imageWidth - bleed,
            imageHeight - bleed,
            new Vector(
              flip === -1 ? calcdBleed : -calcdHeight - calcdBleed,
              flip === 1 ? calcdBleed : -calcdWidth - calcdBleed,
            ),
            calcdHeight,
            calcdWidth,
          );
          // doodler.drawRect(new Vector(200, 200), 200, 200, {
          //   color: "red",
          //   weight: 5,
          // });
        },
      );
      // doodler.drawCenteredRect(new Vector(20, 20), 20, 40);
    };
    const layer2 = (c: CanvasRenderingContext2D) => {
      c.save();
      c.filter = "blur(50px)";
      if (bleed && bleedType === "gen") {
        drawCardBleed(
          c,
          calcdBleed,
          calcdWidth,
          calcdHeight,
        );
      }
      c.restore();
    };
    doodler.createLayer(layer);
    doodler.createLayer(layer2);
    set_((e) => e++);
    return () => {
      doodler.deleteLayer(layer);
      doodler.deleteLayer(layer2);
    };
  }, [
    doodler,
    image,
    ppi,
    width,
    height,
    flip,
    imageWidth,
    cardPosX,
    imageHeight,
    cardPosY,
    bleed,
    bleedType,
    bleedColor,
  ]);

  doodler?.drawManaged();
  // console.log(doodler);

  return (
    <>
      <canvas className="w-full" ref={cvsRef}></canvas>
      {
        /* {!!doodler && (
        <button
          className="left-full top-1/2 absolute bg-gray-900"
          onClick={() => doodler?.drawManaged}
        >
          Draw
        </button>
      )} */
      }
    </>
  );
}

function drawCardBleed(
  ctx: CanvasRenderingContext2D,
  bleed: number,
  cardWidth: number,
  cardHeight: number,
) {
  // Get image data for edges
  const topEdge = ctx.getImageData(bleed, bleed, cardWidth, 1);
  const bottomEdge = ctx.getImageData(
    bleed,
    cardHeight + bleed - 1,
    cardWidth,
    1,
  );
  const leftEdge = ctx.getImageData(bleed, bleed, 1, cardHeight);
  const rightEdge = ctx.getImageData(
    cardWidth + bleed - 1,
    bleed,
    1,
    cardHeight,
  );

  // console.log(topEdge);

  // Extend top and bottom edges
  for (let i = 0; i < bleed; i++) {
    ctx.putImageData(topEdge, bleed, i);
    ctx.putImageData(bottomEdge, bleed, cardHeight + bleed + i);
  }

  // Extend left and right edges
  for (let i = 0; i < bleed; i++) {
    ctx.putImageData(leftEdge, i, bleed);
    ctx.putImageData(rightEdge, cardWidth + bleed + i, bleed);
  }

  // Fill corners by extending corner pixels
  // This simply repeats the corner pixel across the corner bleed areas
  fillCorner(ctx, 0, 0, bleed, bleed, ctx.getImageData(bleed, bleed, 1, 1)); // top-left
  fillCorner(
    ctx,
    cardWidth + bleed,
    0,
    bleed,
    bleed,
    ctx.getImageData(cardWidth + bleed - 1, bleed, 1, 1),
  ); // top-right
  fillCorner(
    ctx,
    0,
    cardHeight + bleed,
    bleed,
    bleed,
    ctx.getImageData(bleed, cardHeight + bleed - 1, 1, 1),
  ); // bottom-left
  fillCorner(
    ctx,
    cardWidth + bleed,
    cardHeight + bleed,
    bleed,
    bleed,
    ctx.getImageData(cardWidth + bleed - 1, cardHeight + bleed - 1, 1, 1),
  ); // bottom-right
}

function fillCorner(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  width: number,
  height: number,
  pixelData: ImageData,
) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      ctx.putImageData(pixelData, startX + x, startY + y);
    }
  }
}
