import type { Socket } from "socket.io-client";

interface ListenEvents {
  chat_message: () => void;
  game_lost: () => void;
  game_over: () => void;
  game_start: ({ options: { map } }: { options: { map: string } }) => void;
  pre_game_start: () => void;
  queue_update: ({ usernames }: { usernames: string[] }) => void;
}

interface EmitEvents {
  set_custom_host: (rid: string, pid: number) => void;
}

type Client = Socket<ListenEvents, EmitEvents>;