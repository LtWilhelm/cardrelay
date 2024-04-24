import { useCallback, useEffect, useState } from "react";

export function useDeckImages(objectState: TTSObjectState) {
  const [images, setImages] = useState<ImageInfo[]>([]);

  const addImage = useCallback((i: ImageInfo) => {
    setImages((is) => [...is, i]);
  }, []);

  useEffect(() => {
    setImages([]);
    for (const [i, deck] of Object.entries(objectState.CustomDeck)) {
      const frontImage = new Image();
      frontImage.setAttribute("crossOrigin", "");
      frontImage.src = deck.FaceUrl;
      frontImage.addEventListener("load", function () {
        const cardWidth = this.naturalWidth / deck.NumWidth;
        const cardHeight = this.naturalHeight / deck.NumHeight;
        const info: ImageInfo = {
          cardHeight,
          cardWidth,
          type: "front",
          deckIndex: i,
          image: this,
          numWidth: deck.NumWidth,
          numHeight: deck.NumHeight,
        };
        addImage(info);
      });
      const backImage = new Image();
      backImage.setAttribute("crossOrigin", "");
      backImage.src = deck.BackUrl;
      backImage.addEventListener("load", function () {
        const cardWidth =
          this.naturalWidth / (deck.UniqueBack ? deck.NumWidth : 1);
        const cardHeight =
          this.naturalHeight / (deck.UniqueBack ? deck.NumHeight : 1);
        const info: ImageInfo = {
          cardHeight,
          cardWidth,
          type: "back",
          deckIndex: i,
          image: this,
          numWidth: deck.NumWidth,
          numHeight: deck.NumHeight,
          uniqueBack: deck.UniqueBack,
        };
        addImage(info);
      });
    }
  }, [addImage, objectState]);

  return images;
}
