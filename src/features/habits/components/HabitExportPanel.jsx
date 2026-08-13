import { Button } from "@/components/ui/button";
import HabitHeatmap from "@/features/habits/components/HabitHeatmap";
import { habitIcons } from "@/features/habits/habitOptions";
import { toJpeg, toPng } from "html-to-image";
import { Download } from "lucide-react";
import { useRef, useState } from "react";

const exportSizes = {
  standard: {
    label: "Standart (1200 × 800)",
    width: 1200,
    height: 800,
  },
  instagramPost: {
    label: "Instagram gönderisi (1080 × 1080)",
    width: 1080,
    height: 1080,
  },
  instagramStory: {
    label: "Instagram hikâyesi (1080 × 1920)",
    width: 1080,
    height: 1920,
  },
};

function HabitExportPanel({ habit, year, statistics }) {
  const exportCardRef = useRef(null);
  const [format, setFormat] = useState("png");
  const [size, setSize] = useState("standard");
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  const selectedSize = exportSizes[size];
  const isStory = size === "instagramStory";
  const HabitIcon =
    habitIcons.find((icon) => icon.value === habit.icon)?.Icon ??
    habitIcons[0].Icon;

  async function handleDownload() {
    if (!exportCardRef.current) {
      return;
    }

    setIsExporting(true);
    setError("");

    try {
      await document.fonts?.ready;

      const imageOptions = {
        backgroundColor: "#ffffff",
        cacheBust: true,
        pixelRatio: 1,
        quality: 0.95,
      };

      const imageUrl =
        format === "png"
          ? await toPng(exportCardRef.current, imageOptions)
          : await toJpeg(exportCardRef.current, imageOptions);

      const safeHabitName = habit.name
        .toLocaleLowerCase("tr-TR")
        .replace(/[^a-z0-9çğıöşü]+/gi, "-")
        .replace(/^-|-$/g, "");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${safeHabitName || "habitgrid"}-${size}.${format}`;
      downloadLink.href = imageUrl;
      downloadLink.click();
    } catch {
      setError("Görsel oluşturulamadı. Lütfen tekrar dene.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="mt-4 rounded-xl border bg-background p-4 shadow-xs">
      <h2 className="text-base font-normal">İlerlemeyi indir</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        İstatistiklerini paylaşmaya hazır şekilde indir.
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-normal" htmlFor="export-format">
            Dosya türü
          </label>

          <select
            id="export-format"
            className="mt-1.5 h-9 w-full rounded-lg border bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={format}
            onChange={(event) => setFormat(event.target.value)}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-normal" htmlFor="export-size">
            Görsel boyutu
          </label>

          <select
            id="export-size"
            className="mt-1.5 h-9 w-full rounded-lg border bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={size}
            onChange={(event) => setSize(event.target.value)}
          >
            {Object.entries(exportSizes).map(([value, exportSize]) => (
              <option key={value} value={value}>
                {exportSize.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <Button
        type="button"
        className="mt-3"
        disabled={isExporting}
        onClick={handleDownload}
      >
        <Download />
        {isExporting ? "Görsel hazırlanıyor..." : "İndir"}
      </Button>

      <div
        className="pointer-events-none fixed left-[-10000px] top-0"
        aria-hidden="true"
      >
        <div
          ref={exportCardRef}
          className="overflow-hidden bg-white text-zinc-950"
          style={{
            width: selectedSize.width,
            height: selectedSize.height,
          }}
        >
          <div
            className={`flex h-full flex-col ${
              isStory ? "justify-center px-16 py-28" : "p-14"
            }`}
          >
            <header className="flex items-center justify-between gap-8">
              <div className="flex min-w-0 items-center gap-4">
                <HabitIcon
                  className="size-10 shrink-0"
                  style={{ color: habit.color }}
                  strokeWidth={1.8}
                />

                <div className="min-w-0">
                  <p className="text-base font-normal text-zinc-500">
                    HabitGrid
                  </p>
                  <h2 className="mt-1 truncate text-3xl font-normal">
                    {habit.name}
                  </h2>
                </div>
              </div>
            </header>

            <section className="mt-8 rounded-xl border border-zinc-200 p-5">
              <p className="text-base font-normal text-zinc-500 pb-2">
                Yıllık İlerleme
              </p>

              <HabitHeatmap
                className="mt-3"
                compact
                year={year}
                completedDates={habit.completedDates ?? []}
                color={habit.color}
                dailyAmounts={habit.dailyAmounts ?? {}}
                target={habit.target}
              />
            </section>

            <section className="mt-5 overflow-hidden rounded-xl border border-zinc-200">
              <h3 className="px-5 py-4 text-lg font-normal">İstatistik</h3>

              <div className="grid grid-cols-4 divide-x divide-zinc-200 border-t border-zinc-200">
                {[
                  ["Toplam tamamlanan", `${statistics.totalCompletedDays} gün`],
                  ["Mevcut seri", `${statistics.currentStreak} gün`],
                  ["En uzun seri", `${statistics.longestStreak} gün`],
                  ["Yıllık başarı", `%${statistics.yearlySuccessRate}`],
                ].map(([label, value]) => (
                  <div key={label} className="p-4">
                    <p className="text-sm font-normal text-zinc-500">{label}</p>
                    <p className="mt-1 text-xl font-medium">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 divide-x divide-zinc-200 border-t border-zinc-200">
                <div className="p-4">
                  <p className="text-sm font-normal text-zinc-500">
                    En başarılı gün
                  </p>
                  <p className="mt-1 text-lg font-medium">
                    {statistics.bestDayText}
                  </p>
                </div>

                <div className="p-4">
                  <p className="text-sm font-normal text-zinc-500">
                    En başarılı hafta
                  </p>
                  <p className="mt-1 text-lg font-medium">
                    {statistics.bestWeekText}
                  </p>
                </div>
              </div>
            </section>

            <p className="mt-5 text-right text-sm font-normal text-zinc-400">
              HabitGrid ile oluşturuldu
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HabitExportPanel;
