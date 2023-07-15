import type { Socket } from "socket.io-client";

interface ListenEvents {
  queue_update: ({ usernames }: { usernames: string[] }) => void;
  pre_game_start: () => void;
  game_start: ({ options: { map } }: { options: { map: string } }) => void;
  chat_message: () => void;
  game_over: () => void;
}

interface EmitEvents {
  set_custom_host: (rid: string, pid: number) => void;
}

type Client = Socket<ListenEvents, EmitEvents>;