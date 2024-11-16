export default function Stream() {
  return (
    <div className="flex flex-col items-center p-8">
      {/* Top card */}
      <div className="border p-4 rounded shadow z-10 bg-white">Top Card</div>
      
      {/* Vertical line from top card */}
      <div className="h-16 w-[2px] animate-move-dots-vertical"></div>
      
      {/* Horizontal split lines container */}
      <div className="flex justify-center gap-32 w-full relative">
   
        {/* Left path */}
        <div className="flex flex-col items-center">
          <div className="w-[8rem] h-[2px] translate-x-16 animate-move-dots transform rotate-180"></div>
          <div className="h-16 w-[2px] animate-move-dots-vertical "></div>
          <div className="border p-4 rounded shadow z-10 bg-white">Card 1</div>
        </div>

        {/* Right path */}
        <div className="flex flex-col items-center">
          <div className="w-[8rem] h-[2px] -translate-x-16 animate-move-dots"></div>
          <div className="h-16 w-[2px] animate-move-dots-vertical"></div>
          <div className="border p-4 rounded shadow z-10 bg-white">Card 2</div>
        </div>
      </div>
    </div>
  );
}