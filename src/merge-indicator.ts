export interface MergeIndicator {
  showIdle(): Promise<void>;
  showError(message: string): Promise<void>;
}
