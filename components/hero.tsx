import { Line } from './line';

export function Hero({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <h1 className="text-xl lg:text-3xl mx-auto max-w-sm text-center font-semibold">
        {title}
      </h1>
      <Line />
    </div>
  );
}
