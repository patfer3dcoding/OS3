export function DesktopIcon({
  app,
  index,
  onOpen,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  return (
    <button
      onClick={() => onOpen(app)}
      draggable
      onDragStart={(e) => onDragStart(e, app.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, app.id)}
      className="group flex flex-col items-center justify-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 cursor-move"
      style={{
        animation: `slideDown 0.5s ease-out ${index * 0.05}s backwards`,
      }}
    >
      <div
        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-3 overflow-hidden`}
      >
        {app.iconUrl ? (
          <img
            src={app.iconUrl}
            alt={app.name}
            className="w-16 h-16 object-contain drop-shadow-2xl"
            draggable={false}
          />
        ) : app.icon ? (
          <app.icon className="w-10 h-10 text-white" />
        ) : null}
      </div>
      <span className="text-white text-xs font-medium text-center drop-shadow-lg max-w-[90px] leading-tight px-2 py-1 rounded bg-black/30 backdrop-blur-sm">
        {app.name}
      </span>
    </button>
  );
}
