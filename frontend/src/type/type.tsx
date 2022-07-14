interface IBaseItem {
  // title: string;
  location: string;
  description: string;
  photo: any;
}

export interface IUploadedItem extends IBaseItem {
  [a: string]: any
  tokenId: number;
  timestamp: string;
  ownerHistory: string[];
}

export interface INewItem extends IBaseItem {
  fileName: string;
}

export interface ServerError {
  error: {
    code: string;
    message: string;
  }
}