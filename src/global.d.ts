import type { App, EventRef, Plugin, TFile } from "obsidian";

declare global {
  interface Window {
    app: App;
  }
}

declare module "obsidian" {
  interface App {
    plugins: {
      getPlugin(id: string): Plugin | null;
    };
  }
  interface Workspace {
    on(name: "file-open", callback: (file: TFile | null) => void): EventRef;
    on(name: "layout-ready", callback: () => void): EventRef;
  }
}
