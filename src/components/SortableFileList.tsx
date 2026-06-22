import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, FileText } from 'lucide-react';
import type { PdfFile } from '../lib/pdfWorker';

interface SortableItemProps {
  file: PdfFile;
}

const SortableItem = ({ file }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-item ${isDragging ? 'dragging' : ''}`}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        <GripVertical size={20} />
      </div>
      <FileText size={20} className="text-primary mr-3" style={{ color: 'var(--primary)', marginRight: '0.75rem' }} />
      <span style={{ fontWeight: 500 }}>{file.name}</span>
    </div>
  );
};

interface SortableFileListProps {
  files: PdfFile[];
  onReorder: (files: PdfFile[]) => void;
}

export const SortableFileList: React.FC<SortableFileListProps> = ({ files, onReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id);
      const newIndex = files.findIndex((f) => f.id === over.id);
      onReorder(arrayMove(files, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={files.map((f) => f.id)}
        strategy={verticalListSortingStrategy}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {files.map((file) => (
            <SortableItem key={file.id} file={file} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
