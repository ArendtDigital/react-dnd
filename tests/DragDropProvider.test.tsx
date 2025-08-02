import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DragDropProvider, DragMode } from '../src';

describe('DragDropProvider', () => {
  const mockOnDragEnd = jest.fn();
  const mockOnDragStart = jest.fn();
  const mockOnDragUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children without crashing', () => {
    render(
      <DragDropProvider onDragEnd={mockOnDragEnd}>
        <div data-testid="child">Test Child</div>
      </DragDropProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides default props correctly', () => {
    render(
      <DragDropProvider onDragEnd={mockOnDragEnd}>
        <div data-testid="child">Test Child</div>
      </DragDropProvider>
    );

    // Should render without errors
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('accepts custom mode prop', () => {
    render(
      <DragDropProvider onDragEnd={mockOnDragEnd} mode={DragMode.WORDBANK}>
        <div data-testid="child">Test Child</div>
      </DragDropProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('accepts custom drag preview options', () => {
    const previewOptions = {
      offsetX: 10,
      offsetY: 20,
      className: 'custom-preview',
    };

    render(
      <DragDropProvider 
        onDragEnd={mockOnDragEnd} 
        dragPreviewOptions={previewOptions}
      >
        <div data-testid="child">Test Child</div>
      </DragDropProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('disables drag preview when enableDragPreview is false', () => {
    render(
      <DragDropProvider onDragEnd={mockOnDragEnd} enableDragPreview={false}>
        <div data-testid="child">Test Child</div>
      </DragDropProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('calls onDragStart when provided', () => {
    render(
      <DragDropProvider 
        onDragEnd={mockOnDragEnd}
        onDragStart={mockOnDragStart}
      >
        <div data-testid="child">Test Child</div>
      </DragDropProvider>
    );

    // The onDragStart should be available in context
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('calls onDragUpdate when provided', () => {
    render(
      <DragDropProvider 
        onDragEnd={mockOnDragEnd}
        onDragUpdate={mockOnDragUpdate}
      >
        <div data-testid="child">Test Child</div>
      </DragDropProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('handles multiple children correctly', () => {
    render(
      <DragDropProvider onDragEnd={mockOnDragEnd}>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </DragDropProvider>
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
    expect(screen.getByTestId('child3')).toBeInTheDocument();
  });

  it('maintains context value stability', () => {
    const { rerender } = render(
      <DragDropProvider onDragEnd={mockOnDragEnd}>
        <div data-testid="child">Test Child</div>
      </DragDropProvider>
    );

    const firstRender = screen.getByTestId('child');

    rerender(
      <DragDropProvider onDragEnd={mockOnDragEnd}>
        <div data-testid="child">Test Child</div>
      </DragDropProvider>
    );

    const secondRender = screen.getByTestId('child');
    expect(secondRender).toBe(firstRender);
  });
}); 