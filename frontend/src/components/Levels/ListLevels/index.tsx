"use client";
import { useEffect, useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { RefreshCwIcon } from "lucide-react";

// Components
import Level from "@/components/Levels/Level";

// Services
import LevelsAPI from "@/services/levels";

// Errors
import { handleError } from "@/errors/handleError";

// Types
import { ILevel } from "@/services/levels";

export default function ListLevels() {
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  const forceReload = () => {
    setReload(reload + 1);
  };

  const loadLevels = async () => {
    const response = await LevelsAPI.getAll();

    if (!response.ok) {
      handleError(response);
      setLevels([]);
    } else {
      setLevels(response.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadLevels();
  }, [reload, setLoading, setLevels, handleError]);

  return (
    <section className="m-5">
      <div className="flex justify-end">
        {/* Refresh */}
        <button onClick={forceReload} data-testid="refresh-button">
          <RefreshCwIcon
            className="w-6 h-6 text-yellow-500 data-[loading='true']:animate-spin"
            data-loading={String(loading)}
          />
        </button>
      </div>

      {/* Loader */}
      <div
        className="justify-center items-center hidden data-[loading='true']:flex"
        data-loading={String(loading)}
        data-testid="loader"
      >
        <LoaderCircleIcon className="w-10 h-10 text-primary animate-spin" />
      </div>

      {/* Lista de levels */}
      <ul className="flex flex-row flex-wrap gap-5">
        {levels.map((l) => (
          <li key={l.id}>
            <Level level={l} />
          </li>
        ))}
      </ul>
    </section>
  );
}
