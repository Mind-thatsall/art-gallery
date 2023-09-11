export type ArtPiece = {
  id: string,
  objectNumber: string,
  title: string,
  webImage: {
    url: string,
  }
}

export type ArtPieceInformations = {
  id: string,
  objectNumber: string,
  title: string,
  webImage: {
    url: string,
  }
  plaqueDescriptionEnglish: string;
  dating: {
    presentingDate: string
  }
}
