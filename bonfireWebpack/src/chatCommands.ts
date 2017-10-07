import emoticonDirectory from "./commands/emoticonDirectory";
import refresh from "./commands/refresh";

interface CommandProcessor {
  (command: string, args: string): void;
}

var commandProcessors: CommandProcessor[] = [emoticonDirectory, refresh];

export function processCommand(command: string, args: string) {
  for (var commandProcessor of commandProcessors) {
    commandProcessor(command, args);
  }
}
