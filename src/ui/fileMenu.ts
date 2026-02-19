import { type App, Menu, type Point, type TFile } from "obsidian";

export function showFileMenu(app: App, file: TFile, position: Point): void {
  const fileMenu = new Menu();
  fileMenu.addItem((item) =>
    item
      .setTitle("Delete")
      .setIcon("trash")
      .onClick(() => {
        app.vault.trash(file, true);
      }),
  );

  app.workspace.trigger(
    "file-menu",
    fileMenu,
    file,
    "calendar-context-menu",
    null,
  );
  fileMenu.showAtPosition(position);
}
