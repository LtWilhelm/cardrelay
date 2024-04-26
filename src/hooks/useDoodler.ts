import { Doodler } from "@cgg/emmaline";
import React, { useEffect, useRef } from "react";
import useDebouncedState from "./useDebounce";

export function useDoodler(
  cfg: CardRendererConfig
): [React.RefObject<HTMLCanvasElement>, Doodler | undefined] {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [doodler, setDoodler] = useDebouncedState<Doodler>();

  useEffect(() => {
    setDoodler((doodler) => {
      if (!doodler) {
        return createDoodler();
      }

      if (
        doodler &&
        (doodler.width !== (cfg.width + cfg.bleed + cfg.bleed) * cfg.ppi ||
          doodler.height !== (cfg.height + cfg.bleed + cfg.bleed) * cfg.ppi)
      ) {
        return createDoodler();
      }

      function createDoodler(): Doodler | undefined {
        if (!canvasRef.current) return;
        const doodler = new Doodler({
          width: (cfg.width + cfg.bleed + cfg.bleed) * cfg.ppi,
          height: (cfg.height + cfg.bleed + cfg.bleed) * cfg.ppi,
          canvas: canvasRef.current,
          bg: "#ffffff00",
          willReadFrequently: true,
        });

        return doodler;
      }
      return doodler;
    });
  }, [cfg.bleed, cfg.height, cfg.ppi, cfg.width, setDoodler]);

  return [canvasRef, doodler];
}
