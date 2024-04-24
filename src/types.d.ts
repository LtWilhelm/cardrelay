interface CardRendererConfig {
  ppi: number;
  width: number;
  height: number;
  bleed: number;
}

interface TTSObject {
  Name: string;
  Nickname: string;
  Description: string;
  Transform: Transform;
}

interface TTSObjectState extends TTSObject {
  DeckIDs: number[];
  ContainedObjects: Card[];
  CustomDeck: Record<string, Deck>;
}

interface Transform {
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

interface Card extends TTSObject {
  CardID: number;
}

interface Deck {
  FaceUrl: string;
  BackUrl: string;
  NumWidth: number;
  NumHeight: number;
  BackIsHidden: boolean;
  UniqueBack: boolean;
  Type: number;
}

type BleedType = "solid" | "gen";

interface ImageInfo {
  image: HTMLImageElement;
  cardHeight: number;
  cardWidth: number;
  type: "front" | "back";
  deckIndex: string;
  numWidth: number;
  numHeight: number;
  uniqueBack?: boolean;
}
