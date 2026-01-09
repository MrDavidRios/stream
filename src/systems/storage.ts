// src/lib/storage.js - Enhanced version
import { isTauri } from "@tauri-apps/api/core";
import { BaseDirectory } from "@tauri-apps/api/path";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

export class Storage<T> {
  private readonly key: string;
  private readonly defaultState: T;

  constructor(key: string, defaultState: T) {
    this.key = key;
    this.defaultState = defaultState;
  }

  async save(data: T) {
    if (!isTauri()) {
      try {
        localStorage.setItem(this.key, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
        throw error;
      }
      return;
    }

    try {
      await writeTextFile(`${this.key}.json`, JSON.stringify(data, null, 2), {
        baseDir: BaseDirectory.AppData,
      });
    } catch (error) {
      console.error("Failed to save to desktop:", error);
      throw error;
    }
  }

  async load() {
    if (!isTauri) {
      try {
        const data = localStorage.getItem(this.key);
        return data === null ? this.defaultState : JSON.parse(data);
      } catch (error) {
        console.error("Failed to load from localStorage:", error);
        return this.defaultState;
      }
    }

    try {
      const fileExists = await exists(`${this.key}.json`, {
        baseDir: BaseDirectory.AppData,
      });
      if (!fileExists) {
        console.log("[Load] No existing data file, starting fresh");
        return this.defaultState;
      }

      const contents = await readTextFile(`${this.key}.json`, {
        baseDir: BaseDirectory.AppData,
      });
      return JSON.parse(contents);
    } catch (error) {
      // File doesn't exist yet or read error
      console.error("Error while attempting to load:", error);
      return this.defaultState;
    }
  }
}
