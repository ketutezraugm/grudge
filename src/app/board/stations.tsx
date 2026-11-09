import { Arrow, Dot, Pie, Record } from "./marks";
import { type Front, percent, type Station } from "./model";

const SENTENCE = {
  missing: "Lost a source this window. Grudge will remember.",
  silent: "The Crowd hasn't called.",
} as const;

const PLACEHOLDERS = ["DeepBook", "Kalshi", "Polymarket", "The Crowd"];

function CallText({ station }: { station: Station }) {
  if (station.call === null) return "—";
  return (
    <>
      {percent(station.call)}% <Arrow />
    </>
  );
}

function ariaOf(station: Station): string {
  if (station.call === null) {
    return station.voice === "crowd"
      ? "The Crowd hasn't called"
      : `${station.name}, no call this window`;
  }
  const trust = station.trust === null ? "" : `, trust ${percent(station.trust)}%`;
  return `${station.name}, ${percent(station.call)}% up${trust}`;
}

/** Trust and Brier for a source that called, or the sentence that says why it did not. */
function Stat({ station }: { station: Station }) {
  if (station.status !== "called")
    return <span className="stat__sentence">{SENTENCE[station.status]}</span>;
  return (
    <span>
      trust{" "}
      <span className="stat__figure narrow">
        {station.trust === null ? "—" : `${percent(station.trust)}%`}
      </span>{" "}
      · Brier{" "}
      <span className="stat__figure narrow">
        {station.brier === null ? "—" : station.brier.toFixed(3)}
      </span>
    </span>
  );
}

/** Which station a front starts from: the one earlier in the row, so it runs toward the next. */
function frontStart(stations: Station[], front: Front | null) {
  if (!front?.disagrees || !front.adjacent) return null;
  const at = (voice: string) => stations.findIndex((station) => station.voice === voice);
  return at(front.high) < at(front.low) ? front.high : front.low;
}

export function Legend({ voices }: { voices: Station["voice"][] }) {
  return (
    <div className="legend">
      <span className="legend__title">Calls at lock · last 20 windows</span>
      <div className="legend__items">
        {voices.includes("deepbook") ? (
          <span>
            <svg width="24" height="8" aria-hidden="true">
              <line x1="0" y1="4" x2="24" y2="4" stroke="var(--ink)" strokeWidth="3" />
            </svg>
            DeepBook
          </span>
        ) : null}
        {voices.includes("kalshi") ? (
          <span>
            <svg width="24" height="8" aria-hidden="true">
              <line
                x1="0"
                y1="4"
                x2="24"
                y2="4"
                stroke="var(--ink)"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />
            </svg>
            Kalshi
          </span>
        ) : null}
        {voices.includes("polymarket") ? (
          <span>
            <svg width="24" height="8" aria-hidden="true">
              <line x1="0" y1="4" x2="24" y2="4" stroke="var(--cobalt)" strokeWidth="1.5" />
            </svg>
            Polymarket
          </span>
        ) : null}
        <span>
          <svg width="40" height="12" aria-hidden="true">
            <Dot mark="right" cx={6} cy={6} tone="ink" />
            <Dot mark="wrong" cx={20} cy={6} tone="ink" />
            <Dot mark="split" cx={34} cy={6} tone="ink" />
          </svg>
          up · down · split
        </span>
      </div>
    </div>
  );
}

interface StationsProps {
  stations: Station[];
  front: Front | null;
  loading: boolean;
}

/** Wide screens: each source hangs off the top edge of the drum chart, its record underneath. */
export function StationGrid({ stations, front, loading }: StationsProps) {
  const start = frontStart(stations, front);
  const cells = loading
    ? PLACEHOLDERS.map((name) => ({ name, station: null }))
    : stations.map((station) => ({ name: station.name, station }));
  return (
    <div className="stations">
      {cells.map(({ name, station }) => {
        const sentence = station !== null && station.status !== "called";
        return (
          <div className="station" key={name} data-sentence={sentence}>
            <Pie
              px={64}
              vb={64}
              r={30}
              p={station?.status === "called" ? station.fill : null}
              tone="ink"
              plate
              label={station ? ariaOf(station) : name}
            />
            <div className="station__head">
              <span className="station__name">{name}</span>
              <span className="station__call wide">
                {station ? <CallText station={station} /> : ""}
              </span>
            </div>
            <div className="station__stat">
              {station ? <Stat station={station} /> : <span className="skeleton skeleton--short" />}
            </div>
            <Record className="station__record" marks={station?.record ?? []} tone="ink" />
            {station && station.voice === start ? (
              <div className="front front--across">
                <svg width="100%" height="12" aria-hidden="true">
                  <defs>
                    <pattern id="teethH" width="14" height="10" patternUnits="userSpaceOnUse" x="4">
                      <path
                        d="M0,1L5,9L10,1Z"
                        fill="var(--orange)"
                        stroke="var(--ink)"
                        strokeWidth="1"
                        strokeLinejoin="round"
                      />
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="100%" height="10" fill="url(#teethH)" />
                  <line
                    x1="0"
                    y1="0.75"
                    x2="100%"
                    y2="0.75"
                    stroke="var(--ink)"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            ) : null}
          </div>
        );
      })}
      <Legend voices={stations.map((station) => station.voice)} />
    </div>
  );
}

/** Narrow screens: a list, each source a row, the record in white on the cobalt page. */
export function StationList({ stations, front, loading }: StationsProps) {
  const start = frontStart(stations, front);
  const cells = loading
    ? PLACEHOLDERS.map((name) => ({ name, station: null }))
    : stations.map((station) => ({ name: station.name, station }));
  return (
    <div className="station-list">
      {cells.map(({ name, station }) => (
        <div className="row-station" key={name}>
          <div className="row-station__who">
            <Pie
              px={48}
              vb={48}
              r={22}
              p={station?.status === "called" ? station.fill : null}
              tone="white"
              label={station ? ariaOf(station) : name}
            />
            <div className="station__head">
              <span className="station__name">{name}</span>
              <span className="station__call wide">
                {station ? <CallText station={station} /> : ""}
              </span>
            </div>
          </div>
          <div className="row-station__stat">
            {station ? <Stat station={station} /> : <span className="skeleton skeleton--short" />}
          </div>
          <Record className="row-station__record" marks={station?.record ?? []} tone="white" />
          {station && station.voice === start ? (
            <svg className="front front--down" width="12" aria-hidden="true">
              <defs>
                <pattern id="teethV" width="10" height="14" patternUnits="userSpaceOnUse" y="2">
                  <path d="M0,0L8,5L0,10Z" fill="var(--orange)" />
                </pattern>
              </defs>
              <rect x="1.5" y="0" width="10" height="100%" fill="url(#teethV)" />
              <line x1="0.75" y1="0" x2="0.75" y2="100%" stroke="var(--white)" strokeWidth="1.5" />
            </svg>
          ) : null}
        </div>
      ))}
    </div>
  );
}
