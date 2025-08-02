import React, { useState } from 'react';
import { DragDropProvider, Draggable, Droppable, DragResult } from '../src';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const KanbanBoardExample: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { id: 'task1', title: 'Design UI', description: 'Create wireframes', priority: 'high' },
        { id: 'task2', title: 'Setup project', description: 'Initialize repository', priority: 'medium' },
        { id: 'task3', title: 'Research', description: 'Study requirements', priority: 'low' },
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [
        { id: 'task4', title: 'Build components', description: 'Create React components', priority: 'high' },
      ]
    },
    {
      id: 'review',
      title: 'Review',
      tasks: [
        { id: 'task5', title: 'Code review', description: 'Review pull request', priority: 'medium' },
      ]
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [
        { id: 'task6', title: 'Deploy', description: 'Deploy to production', priority: 'high' },
      ]
    }
  ]);

  const handleDragEnd = (result: DragResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = source.droppableId === destination.droppableId 
      ? sourceTasks 
      : [...destColumn.tasks];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    setColumns(prevColumns => prevColumns.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, tasks: sourceTasks };
      }
      if (col.id === destination.droppableId) {
        return { ...col, tasks: destTasks };
      }
      return col;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44aa44';
      default: return '#666';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Kanban Board Example</h2>
      <p>Drag tasks between columns to manage your workflow:</p>
      
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginTop: '20px',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          {columns.map(column => (
            <div key={column.id} style={{ minWidth: '280px', flex: 1 }}>
              <h3 style={{ 
                margin: '0 0 12px 0', 
                padding: '8px 12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                {column.title} ({column.tasks.length})
              </h3>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : '#f8f9fa',
                      border: '2px solid',
                      borderColor: snapshot.isDraggingOver ? '#2196f3' : '#e0e0e0',
                      borderRadius: '8px',
                      padding: '12px',
                      minHeight: '400px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              backgroundColor: snapshot.isDragging ? '#e3f2fd' : 'white',
                              border: '1px solid #e0e0e0',
                              borderRadius: '6px',
                              padding: '12px',
                              marginBottom: '8px',
                              cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                              userSelect: 'none',
                              boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'flex-start',
                              marginBottom: '8px'
                            }}>
                              <h4 style={{ 
                                margin: '0', 
                                fontSize: '14px', 
                                fontWeight: '600',
                                color: '#333'
                              }}>
                                {task.title}
                              </h4>
                              <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: getPriorityColor(task.priority),
                                flexShrink: 0,
                                marginLeft: '8px'
                              }} />
                            </div>
                            <p style={{ 
                              margin: '0', 
                              fontSize: '12px', 
                              color: '#666',
                              lineHeight: '1.4'
                            }}>
                              {task.description}
                            </p>
                            <div style={{
                              marginTop: '8px',
                              fontSize: '10px',
                              color: '#999',
                              textTransform: 'uppercase',
                              fontWeight: '500'
                            }}>
                              {task.priority} priority
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {column.tasks.length === 0 && (
                      <div style={{ 
                        textAlign: 'center', 
                        color: '#999', 
                        fontStyle: 'italic',
                        padding: '40px 20px'
                      }}>
                        No tasks
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropProvider>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Total tasks:</strong> {columns.reduce((sum, col) => sum + col.tasks.length, 0)}</p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff4444' }} />
            High Priority
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffaa00' }} />
            Medium Priority
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#44aa44' }} />
            Low Priority
          </span>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoardExample; 