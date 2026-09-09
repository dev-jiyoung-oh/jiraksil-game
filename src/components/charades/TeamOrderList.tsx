import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./TeamOrderList.css";

// id는 code(신규 팀은 null)와 별개로, dnd-kit이 배열 위치가 아닌 고유값으로 항목을 추적하는 데 사용
export interface TeamRow {
  id: string;
  code: string | null;
  name: string;
}

interface TeamOrderListProps {
  teams: TeamRow[];
  disabled: boolean;
  canRemove: boolean;
  onNameChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onReorder: (teams: TeamRow[]) => void;
}

export default function TeamOrderList({
  teams,
  disabled,
  canRemove,
  onNameChange,
  onRemove,
  onMove,
  onReorder,
}: TeamOrderListProps) {
  // PointerSensor: 드래그 핸들의 마우스/터치 조작, KeyboardSensor: 핸들에 포커스 후 Space+화살표로 조작
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (disabled) return; // 행별 useSortable disabled로도 막히지만 이중 방어

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = teams.findIndex((t) => t.id === active.id);
    const newIndex = teams.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(teams, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={teams.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="team-list">
          {teams.map((t, idx) => (
            <TeamOrderRow
              key={t.id}
              team={t}
              idx={idx}
              disabled={disabled}
              canRemove={canRemove}
              isFirst={idx === 0}
              isLast={idx === teams.length - 1}
              onNameChange={onNameChange}
              onRemove={onRemove}
              onMoveUp={() => onMove(idx, -1)}
              onMoveDown={() => onMove(idx, 1)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

interface TeamOrderRowProps {
  team: TeamRow;
  idx: number;
  disabled: boolean;
  canRemove: boolean;
  isFirst: boolean;
  isLast: boolean;
  onNameChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function TeamOrderRow({
  team,
  idx,
  disabled,
  canRemove,
  isFirst,
  isLast,
  onNameChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: TeamOrderRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: team.id,
    disabled,
  });

  const teamLabel = `Team ${String.fromCharCode(65 + idx)}`;

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "team-row dragging" : "team-row"}
    >
      {/* 드래그 핸들: 이름 입력창을 드래그로 오작동시키지 않도록 조작 시작점을 여기로 한정 */}
      {!disabled && (
        <button
          type="button"
          className="btn btn-secondary btn-small drag-handle"
          aria-label={`${teamLabel} 드래그로 순서 변경`}
          {...attributes}
          {...listeners}
        >
          ⠿
        </button>
      )}
      {/* 드래그가 유일한 조작 수단이 되지 않도록 유지하는 대체 버튼 (WCAG 2.5.7) — 핸들과 같은 "순서 조작" 그룹으로 묶어 붙여둠 */}
      {!disabled && (
        <div className="move-btn-group">
          <button
            type="button"
            aria-label={`${teamLabel} 위로 이동`}
            className="btn move-btn"
            onClick={onMoveUp}
            disabled={isFirst}
          >
            ↑
          </button>
          <button
            type="button"
            aria-label={`${teamLabel} 아래로 이동`}
            className="btn move-btn"
            onClick={onMoveDown}
            disabled={isLast}
          >
            ↓
          </button>
        </div>
      )}
      <input
        type="text"
        name="teamName"
        value={team.name}
        placeholder={teamLabel}
        onChange={(e) => onNameChange(team.id, e.target.value)}
        disabled={disabled}
      />
      {!disabled && canRemove && (
        <button
          type="button"
          aria-label={`${teamLabel} 삭제`}
          className="btn btn-danger del-btn"
          onClick={() => onRemove(team.id)}
        >
          삭제
        </button>
      )}
    </li>
  );
}
