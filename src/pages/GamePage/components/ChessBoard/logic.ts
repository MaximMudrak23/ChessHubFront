import { type Position, type Square } from "./model";

export function movePiece(
    pos: Position,
    from: Square,
    to: Square
): Position {
  const piece = pos[from];
  if (!piece) return pos;

  const next = { ...pos };
  delete next[from];
  next[to] = piece;
  return next;
}