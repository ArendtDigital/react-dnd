import React, { useState } from 'react';
import { DragDropProvider, DragResult, useDragDrop } from '../src';

interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video';
  size: string;
}

const FileItem: React.FC<{ file: FileItem }> = ({ file }) => {
  const { isDragging, dragRef, dragHandleProps } = useDragDrop({
    type: 'file',
    item: file,
    canDrag: true,
    collect: (monitor) => ({
      isDragging: monitor.isDragging,
    }),
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'document': return '📄';
      case 'video': return '🎥';
      default: return '📁';
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'image': return '#4caf50';
      case 'document': return '#2196f3';
      case 'video': return '#ff9800';
      default: return '#666';
    }
  };

  return (
    <div
      ref={dragRef}
      {...dragHandleProps}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        margin: '8px 0',
        backgroundColor: isDragging ? '#e3f2fd' : 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        cursor: 'grab',
        userSelect: 'none',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(5deg)' : 'none',
        transition: 'all 0.2s ease',
        boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ fontSize: '24px', marginRight: '12px' }}>
        {getFileIcon(file.type)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: '600', 
          color: '#333',
          marginBottom: '4px'
        }}>
          {file.name}
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{file.size}</span>
          <span style={{
            padding: '2px 6px',
            backgroundColor: getFileColor(file.type),
            color: 'white',
            borderRadius: '4px',
            fontSize: '10px',
            textTransform: 'uppercase'
          }}>
            {file.type}
          </span>
        </div>
      </div>
      <div style={{ 
        fontSize: '16px', 
        color: '#999',
        marginLeft: '8px'
      }}>
        ⋮⋮
      </div>
    </div>
  );
};

const DropZone: React.FC<{ title: string; acceptTypes: string[] }> = ({ title, acceptTypes }) => {
  const { isDragging, dropRef, dropProps } = useDragDrop({
    type: 'file',
    item: null,
    canDrop: (item) => acceptTypes.includes(item?.type || ''),
    collect: (monitor) => ({
      isDragging: monitor.isDragging,
      canDrop: monitor.canDrop,
    }),
  });

  const getAcceptText = () => {
    return acceptTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ');
  };

  return (
    <div
      ref={dropRef}
      {...dropProps}
      style={{
        border: '2px dashed',
        borderColor: isDragging ? '#4caf50' : '#ccc',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: isDragging ? '#e8f5e8' : '#fafafa',
        transition: 'all 0.2s ease',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>
        {isDragging ? '📁' : '📂'}
      </div>
      <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
        {title}
      </h3>
      <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
        Accepts: {getAcceptText()}
      </p>
      {isDragging && (
        <div style={{
          marginTop: '8px',
          padding: '4px 8px',
          backgroundColor: '#4caf50',
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          Drop here!
        </div>
      )}
    </div>
  );
};

const UseDragDropHookExample: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'vacation-photo.jpg', type: 'image', size: '2.4 MB' },
    { id: '2', name: 'project-report.pdf', type: 'document', size: '1.8 MB' },
    { id: '3', name: 'presentation.mp4', type: 'video', size: '15.2 MB' },
    { id: '4', name: 'screenshot.png', type: 'image', size: '856 KB' },
    { id: '5', name: 'contract.docx', type: 'document', size: '2.1 MB' },
    { id: '6', name: 'tutorial.mp4', type: 'video', size: '45.7 MB' },
  ]);

  const [droppedFiles, setDroppedFiles] = useState<{
    images: FileItem[];
    documents: FileItem[];
    videos: FileItem[];
  }>({
    images: [],
    documents: [],
    videos: [],
  });

  const handleDragEnd = (result: DragResult) => {
    if (!result.destination) return;

    const draggedFile = files.find(file => file.id === result.draggableId);
    if (!draggedFile) return;

    const destinationType = result.destination.droppableId;
    
    setDroppedFiles(prev => ({
      ...prev,
      [destinationType]: [...prev[destinationType as keyof typeof prev], draggedFile]
    }));

    setFiles(prev => prev.filter(file => file.id !== draggedFile.id));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>useDragDrop Hook Example</h2>
      <p>Drag files to organize them by type using the advanced useDragDrop hook:</p>
      
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          {/* File List */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>
              Available Files ({files.length})
            </h3>
            <div style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: 'white',
              minHeight: '400px'
            }}>
              {files.map(file => (
                <FileItem key={file.id} file={file} />
              ))}
              {files.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#999', 
                  fontStyle: 'italic',
                  padding: '40px 20px'
                }}>
                  No files available
                </div>
              )}
            </div>
          </div>

          {/* Drop Zones */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>
              Organized Files
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#4caf50' }}>
                  Images ({droppedFiles.images.length})
                </h4>
                <DropZone title="Images" acceptTypes={['image']} />
                {droppedFiles.images.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    {droppedFiles.images.map(file => file.name).join(', ')}
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#2196f3' }}>
                  Documents ({droppedFiles.documents.length})
                </h4>
                <DropZone title="Documents" acceptTypes={['document']} />
                {droppedFiles.documents.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    {droppedFiles.documents.map(file => file.name).join(', ')}
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#ff9800' }}>
                  Videos ({droppedFiles.videos.length})
                </h4>
                <DropZone title="Videos" acceptTypes={['video']} />
                {droppedFiles.videos.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    {droppedFiles.videos.map(file => file.name).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DragDropProvider>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Total files organized:</strong> {
          droppedFiles.images.length + droppedFiles.documents.length + droppedFiles.videos.length
        }</p>
        <p><strong>Files remaining:</strong> {files.length}</p>
      </div>
    </div>
  );
};

export default UseDragDropHookExample; 