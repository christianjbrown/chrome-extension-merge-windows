export interface MergeIndicator {
  showIdle(): Promise<void>;
  showError(error: unknown): Promise<void>;
}
