import type { Socket } from "socket.io-client";

interface ListenEvents {
  chat_message: (channel: string, { multiText }: { multiText?: string[] }) => void;
  game_lost: () => void;
  game_over: () => void;
  game_start: ({ options: { map } }: { options: { map: string } }) => void;
  pre_game_start: () => void;
  queue_update: ({ usernames }: { usernames: string[] }) => void;
}

interface EmitEvents {
  set_custom_host: (rid: string, pid: number) => void;
  get_username: (uid: string, fn: (username: string) => void) => void;
  set_custom_team: (rid: string, tid: number) => void;
}

type Client = Socket<ListenEvents, EmitEvents>;