import { Button } from "@/components/ui/button";
import HabitHeatmap from "@/features/habits/components/HabitHeatmap";
import { toJpeg, toPng } from "html-to-image";
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
    <section className="mt-8 rounded-xl border p-5">
      <h2 className="text-lg font-semibold">İlerlemeyi indir</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        İstatistiklerini PNG veya JPEG olarak paylaşmaya hazır şekilde indir.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium" htmlFor="export-format">
            Dosya türü
          </label>

          <select
            id="export-format"
            className="mt-2 h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={format}
            onChange={(event) => setFormat(event.target.value)}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="export-size">
            Görsel boyutu
          </label>

          <select
            id="export-size"
            className="mt-2 h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        className="mt-4"
        disabled={isExporting}
        onClick={handleDownload}
      >
        {isExporting ? "Görsel hazırlanıyor..." : "Görseli indir"}
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
              isStory ? "justify-center px-20 py-28" : "p-16"
            }`}
          >
            <div className="flex items-center justify-between gap-8">
              <div>
                <p className="text-2xl font-semibold text-zinc-500">
                  HabitGrid
                </p>
                <h2 className="mt-2 text-5xl font-bold">{habit.name}</h2>
              </div>

              <span
                className="size-16 shrink-0 rounded-2xl"
                style={{ backgroundColor: habit.color }}
              />
            </div>

            <div className="mt-12 grid grid-cols-4 gap-4">
              {[
                ["Toplam tamamlanan", `${statistics.totalCompletedDays} gün`],
                ["Mevcut seri", `${statistics.currentStreak} gün`],
                ["En uzun seri", `${statistics.longestStreak} gün`],
                ["Yıllık başarı", `%${statistics.yearlySuccessRate}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border p-5">
                  <p className="text-base text-zinc-500">{label}</p>
                  <p className="mt-2 text-3xl font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border p-5">
                <p className="text-base text-zinc-500">En başarılı gün</p>
                <p className="mt-2 text-2xl font-semibold">
                  {statistics.bestDayText}
                </p>
              </div>

              <div className="rounded-2xl border p-5">
                <p className="text-base text-zinc-500">En başarılı hafta</p>
                <p className="mt-2 text-2xl font-semibold">
                  {statistics.bestWeekText}
                </p>
              </div>
            </div>

            <HabitHeatmap
              year={year}
              completedDates={habit.completedDates ?? []}
              color={habit.color}
              dailyAmounts={habit.dailyAmounts ?? {}}
              target={habit.target}
            />

            <p className="mt-auto pt-8 text-right text-lg font-medium text-zinc-400">
              Alışkanlıklarını takip et, ilerlemeni gör.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HabitExportPanel;
