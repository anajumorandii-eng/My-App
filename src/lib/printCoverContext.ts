import type { PrintCoverContext } from "./printCoverSpec";

export function readPrintCoverContext(content: HTMLElement): PrintCoverContext {
  const data = content.dataset;
  const fields = {
    subject: data.printSubject,
    topic: data.printTopic,
    subtopic: data.printSubtopic,
    work: data.printWork,
    board: data.printBoard,
    purpose: data.printPurpose,
  };
  return Object.fromEntries(
    Object.entries(fields)
      .filter(([, value]) => value?.trim())
      .map(([key, value]) => [key, value!]),
  );
}
export function coverContextKey(context: PrintCoverContext): string {
  return JSON.stringify([
    context.subject || "",
    context.topic || "",
    context.subtopic || "",
    context.work || "",
    context.board || "",
    context.purpose || "",
  ]);
}
export function preparedCoverIllustration(
  content: HTMLElement,
): string | undefined {
  const image = content.dataset.printGeneratedArt;
  return content.dataset.printGeneratedContext ===
    coverContextKey(readPrintCoverContext(content)) &&
    image &&
    image.length <= 8_388_640 &&
    /^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(image)
    ? image
    : undefined;
}
