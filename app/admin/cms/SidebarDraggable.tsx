"use client";

import { CSS } from "@dnd-kit/utilities";
import { PageSchema } from "@/lib/cmsDefaults";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface SidebarDraggableProps {
  activeTab: string;
  sidebarPages: PageSchema[];
  activePageId: string;
  setActivePageId: (id: string) => void;
  onReorder: (newOrder: PageSchema[]) => void;
}

function SortableItem({ page, isActive, onClick }: { page: PageSchema, isActive: boolean, onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group ${
        isActive ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'
      }`}
      {...attributes}
    >
       <button
          className="flex-1 text-left"
          onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             onClick();
          }}
          style={!isActive ? { color: 'var(--text-secondary)' } : {}}
       >
         {page.name}
       </button>

       {/* Drag Handle */}
       <div 
          className="cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          {...listeners}
       >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
          </svg>
       </div>
    </div>
  );
}

export default function SidebarDraggable({
  activeTab,
  sidebarPages,
  activePageId,
  setActivePageId,
  onReorder,
}: SidebarDraggableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sidebarPages.findIndex((p) => p.id === active.id);
      const newIndex = sidebarPages.findIndex((p) => p.id === over.id);
      
      const newOrder = arrayMove(sidebarPages, oldIndex, newIndex);
      onReorder(newOrder);
    }
  }

  return (
    <div className="w-64 border-r overflow-y-auto p-4 flex flex-col gap-1" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-surface)' }}>
      <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
        {activeTab} Pages
      </h2>
      
      {sidebarPages.length === 0 && (
         <div className="text-sm text-center py-4" style={{ color: 'var(--text-secondary)' }}>No pages configured.</div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sidebarPages.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-1">
             {sidebarPages.map((page) => (
               <SortableItem
                 key={page.id}
                 page={page}
                 isActive={activePageId === page.id}
                 onClick={() => setActivePageId(page.id)}
               />
             ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
