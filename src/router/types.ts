export interface RouterLocation {
  pathname: string;
  hash: string;
  search: string;
}

export interface Router {
  getLocation(): RouterLocation;
  navigate(url: string): void;
  go(delta: number): void;
  connect(): () => void;
  subscribe(listener: VoidFunction): () => void;
}
