export function DefaultWindowContent({ window }) {
  return (
    <div className="p-6 overflow-auto h-full">
      <div className="text-white/90">
        <h2 className="text-2xl font-bold mb-4">{window.name}</h2>
        <p className="text-white/70 mb-6">{window.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <window.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-sm">Item {item}</div>
                  <div className="text-xs text-white/60">Sample data</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
