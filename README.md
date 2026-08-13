# HabitGrid

HabitGrid is a habit tracking application built with React. It helps users create habits, record daily progress, review yearly activity on a GitHub-style heatmap, and follow useful progress statistics.

The application runs entirely in the browser and stores data in localStorage. No account or backend service is required.

## Features

- Create, edit, and delete habits
- Choose a color and Lucide icon for each habit
- Track habits as completed or use a measurable daily target
- Record today's progress directly from the home page or detail page
- View yearly activity on a color intensity heatmap
- Edit missed or incorrect records from previous days
- Review current streak, longest streak, completion rates, best day, and best week
- Export progress as PNG or JPEG
- Use standard, Instagram post, and Instagram story export sizes
- Keep habit data in the browser with localStorage
- Use the application on desktop and mobile screens

## Technologies

- React
- JavaScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Base UI
- Lucide React
- html-to-image
- Geist

## Getting Started

### Requirements

- Node.js
- npm

### Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd habit-grid
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local address shown in the terminal.

## Available Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Creates a production build
- `npm run preview`: Previews the production build locally
- `npm run lint`: Checks the source code with ESLint

## Project Structure

- `src/components/ui`: Reusable interface components
- `src/features/habits`: Habit pages, components, and options
- `src/features/habits/components`: Habit cards, heatmap, history editor, daily progress form, and export panel
- `src/lib/date.js`: Date helpers used by the heatmap and progress records
- `src/lib/habitStats.js`: Streak and success statistic calculations
- `src/App.jsx`: Application state, habit operations, and routes
- `src/main.jsx`: React application entry point

## Data Storage

Habit data is stored under the habit-grid-habits key in localStorage. Clearing browser storage also removes the saved habits and progress records.

## Türkçe

HabitGrid, React ile geliştirilmiş bir alışkanlık takip uygulamasıdır. Kullanıcıların alışkanlık oluşturmasını, günlük ilerleme kaydetmesini, yıllık hareketlerini GitHub benzeri bir heatmap üzerinde incelemesini ve ilerleme istatistiklerini takip etmesini sağlar.

Uygulama tamamen tarayıcıda çalışır ve verileri localStorage içinde saklar. Hesap veya backend servisi gerektirmez.

## Özellikler

- Alışkanlık oluşturma, düzenleme ve silme
- Her alışkanlık için renk ve Lucide ikonu seçme
- Alışkanlıkları tamamlandı olarak veya ölçülebilir günlük hedefle takip etme
- Bugünkü ilerlemeyi ana sayfadan veya detay sayfasından kaydetme
- Yıllık hareketleri renk yoğunluklu heatmap üzerinde görüntüleme
- Kaçırılan veya yanlış girilen geçmiş kayıtları düzenleme
- Mevcut seri, en uzun seri, başarı oranları, en başarılı gün ve en başarılı haftayı görüntüleme
- İlerleme görünümünü PNG veya JPEG olarak indirme
- Standart, Instagram gönderisi ve Instagram hikâyesi boyutlarında çıktı alma
- Verileri localStorage ile tarayıcıda saklama
- Masaüstü ve mobil ekranlara uyumlu arayüz

## Kullanılan Teknolojiler

- React
- JavaScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Base UI
- Lucide React
- html-to-image
- Geist

## Kurulum

### Gereksinimler

- Node.js
- npm

Projeyi klonlayın ve bağımlılıkları yükleyin:

```bash
git clone <depo-adresi>
cd habit-grid
npm install
```

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Terminalde gösterilen yerel adresi tarayıcıda açın.

## Kullanılabilir Komutlar

- `npm run dev`: Geliştirme sunucusunu başlatır
- `npm run build`: Üretim sürümünü oluşturur
- `npm run preview`: Üretim sürümünü yerel ortamda önizler
- `npm run lint`: Kaynak kodu ESLint ile kontrol eder

## Proje Yapısı

- `src/components/ui`: Yeniden kullanılabilir arayüz bileşenleri
- `src/features/habits`: Alışkanlık sayfaları, bileşenleri ve seçenekleri
- `src/features/habits/components`: Alışkanlık kartı, heatmap, geçmiş düzenleme, günlük ilerleme ve indirme bileşenleri
- `src/lib/date.js`: Heatmap ve ilerleme kayıtlarında kullanılan tarih yardımcıları
- `src/lib/habitStats.js`: Seri ve başarı istatistiklerini hesaplayan fonksiyonlar
- `src/App.jsx`: Uygulama durumu, alışkanlık işlemleri ve yönlendirmeler
- `src/main.jsx`: React uygulamasının başlangıç dosyası

## Veri Saklama

Alışkanlık verileri localStorage içinde habit-grid-habits anahtarıyla saklanır. Tarayıcı verileri temizlendiğinde kaydedilen alışkanlıklar ve ilerleme kayıtları da silinir.
