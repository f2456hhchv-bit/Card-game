export interface WisdomLessonRecord {
  situation: string;
  decision: string;
  outcome: string;
  reflection: string;
  futureRelevance: string;
  teachingValue: string;
  epoch: number;
}

/** "Every lesson permanently records situation/decision/outcome/
 * reflection/future relevance/teaching value... wisdom becomes
 * searchable." Confirmed genuinely new — a different question from
 * AF-160's real `WisdomMemoryArchive` (which only tags a lesson id
 * against WHICH institutions now teach it, never the narrative
 * itself). Append-only, mirroring the established evolving-history
 * shape. */
export class WisdomLibrary {
  private readonly records = new Map<string, WisdomLessonRecord[]>();

  record(lessonId: string, entry: Omit<WisdomLessonRecord, "epoch">, epoch: number): void {
    const history = this.records.get(lessonId) ?? [];
    history.push({ ...entry, epoch });
    this.records.set(lessonId, history);
  }

  latestFor(lessonId: string): WisdomLessonRecord | null {
    const history = this.records.get(lessonId);
    return history && history.length > 0 ? history[history.length - 1]! : null;
  }

  historyFor(lessonId: string): readonly WisdomLessonRecord[] {
    return this.records.get(lessonId) ?? [];
  }
}
