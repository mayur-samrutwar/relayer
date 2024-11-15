export default function Stream() {
  return (
    <div className="flex flex-col items-center p-8">
      {/* Top cards container */}
      <div className="flex justify-center gap-32 w-full relative">
        {/* Left card */}
        <div className="flex flex-col items-center">
          <div className="border p-4 rounded shadow z-10 bg-white">Card 1</div>
          <div className="h-16 w-[2px] animate-move-dots-vertical"></div>
          <div className="w-[8rem] h-[2px] translate-x-16 animate-move-dots"></div>
        </div>

        {/* Right card */}
        <div className="flex flex-col items-center">
          <div className="border p-4 rounded shadow z-10 bg-white">Card 2</div>
          <div className="h-16 w-[2px] animate-move-dots-vertical"></div>
          <div className="w-[8rem] h-[2px] -translate-x-16 animate-move-dots transform rotate-180"></div>
        </div>
      </div>
      
      {/* Connection point */}
      <div className="absolute left-1/2 w-2 h-2 bg-white border rounded-full -translate-x-1/2 z-20"></div>
      
      {/* Vertical line to bottom card */}
      <div className="h-16 w-[2px] animate-move-dots-vertical"></div>
      
      {/* Bottom card */}
      <div className="border p-4 rounded shadow z-10 bg-white">Bottom Card</div>
    </div>
  );
}