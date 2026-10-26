export interface PhysicsBlock {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'wood' | 'stone' | 'bouncy' | 'portal-in' | 'portal-out' | 'spike';
  active: boolean; // if false, block was removed
}

export interface PhysicsObjectState {
  ball: { x: number; y: number; vx: number; vy: number; settled: boolean };
  initialBall: { x: number; y: number };
  goal: { x: number; y: number; w: number; h: number };
  blocks: PhysicsBlock[];
  worldWidth: number;
  worldHeight: number;
  won: boolean;
  failed: boolean;
  isSimulating: boolean;
}

export function simulatePhysicsStep(state: PhysicsObjectState): PhysicsObjectState {
  if (state.won || state.failed) return state;

  const next = {
    ...state,
    ball: { ...state.ball },
  };

  const gravity = 0.5;
  next.ball.vy += gravity;
  next.ball.x += next.ball.vx;
  next.ball.y += next.ball.vy;
  next.ball.vx *= 0.98;

  const ballR = 12;

  // Check goal collision
  const g = next.goal;
  if (
    next.ball.x >= g.x &&
    next.ball.x <= g.x + g.w &&
    next.ball.y >= g.y &&
    next.ball.y <= g.y + g.h
  ) {
    next.won = true;
    next.isSimulating = false;
    return next;
  }

  // Check boundary limits
  if (next.ball.y > next.worldHeight + 40 || next.ball.x < -30 || next.ball.x > next.worldWidth + 30) {
    next.failed = true;
    next.isSimulating = false;
    return next;
  }

  // Check block collisions
  for (const block of next.blocks) {
    if (!block.active) continue;

    if (
      next.ball.x + ballR > block.x &&
      next.ball.x - ballR < block.x + block.w &&
      next.ball.y + ballR > block.y &&
      next.ball.y - ballR < block.y + block.h
    ) {
      if (block.type === 'spike') {
        next.failed = true;
        next.isSimulating = false;
        return next;
      }

      if (block.type === 'portal-in') {
        const outBlock = next.blocks.find((b) => b.type === 'portal-out' && b.active);
        if (outBlock) {
          next.ball.x = outBlock.x + outBlock.w / 2;
          next.ball.y = outBlock.y + outBlock.h + 10;
          next.ball.vy = 2;
          return next;
        }
      }

      // Restitution / bounce
      const bounce = block.type === 'bouncy' ? 1.4 : 0.45;
      next.ball.y = block.y - ballR;
      next.ball.vy = -Math.abs(next.ball.vy) * bounce;
      // Slight slant kick
      const centerDist = (next.ball.x - (block.x + block.w / 2)) / (block.w / 2);
      next.ball.vx += centerDist * 1.5;
    }
  }

  return next;
}
