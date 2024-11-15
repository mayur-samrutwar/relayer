export default function Stream() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center">
        <div className="border p-4 rounded shadow z-10 bg-white">Card 1</div>
        <div className="w-24 h-[2px] -mx-2 animate-move-dots"></div>
        <div className="border p-4 rounded shadow z-10 bg-white">Card 2</div>
      </div>
    </div>
  );
}