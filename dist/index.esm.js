import React, { useState, useRef, useEffect, createContext, useReducer, useCallback, useMemo, useContext } from 'react';

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production_min;

function requireReactJsxRuntime_production_min () {
	if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
	hasRequiredReactJsxRuntime_production_min = 1;
var f=React,k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};
	function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;
	return reactJsxRuntime_production_min;
}

(function (module) {

	{
	  module.exports = requireReactJsxRuntime_production_min();
	}
} (jsxRuntime));

const CustomDragDrop = ({ lists, onDragEnd, mode = 'reorder', permanentShadows = {}, setPermanentShadows }) => {
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverList, setDragOverList] = useState(null);
    const [placeholderIndex, setPlaceholderIndex] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [dragPreview, setDragPreview] = useState(null);
    const [draggedItemOriginalIndex, setDraggedItemOriginalIndex] = useState(null);
    const [itemConnections, setItemConnections] = useState({});
    const listRefs = useRef({});
    const lastUpdateRef = useRef({ listId: null, index: null });
    const updateTimeoutRef = useRef(null);
    // Mode can be 'reorder' (current behavior), 'noreorder' (only between lists), or 'wordbank' (permanent shadows)
    const isNoReorderMode = mode === 'noreorder';
    const isWordBankMode = mode === 'wordbank';
    const isShadowMode = isNoReorderMode || isWordBankMode;
    const handleMouseDown = (e, item, listId) => {
        // Find the original index before starting drag
        const originalIndex = lists[listId].findIndex(listItem => listItem.id === item.id);
        console.log('Drag started:', { item: item.text, listId, originalIndex });
        // Start custom drag
        setDraggedItem({ ...item, sourceList: listId });
        setDraggedItemOriginalIndex(originalIndex);
        setDragPreview({
            text: item.text,
            color: item.color,
            x: e.clientX,
            y: e.clientY
        });
        // Store original item positions
        const listElement = listRefs.current[listId];
        if (listElement) {
            const itemElements = Array.from(listElement.querySelectorAll('.item'));
            itemElements.map((el, index) => {
                const rect = el.getBoundingClientRect();
                const listRect = listElement.getBoundingClientRect();
                return {
                    index,
                    left: rect.left - listRect.left,
                    right: rect.right - listRect.left,
                    top: rect.top - listRect.top,
                    bottom: rect.bottom - listRect.top,
                };
            });
        }
    };
    const updatePlaceholderPosition = (hoveredList, newIndex) => {
        // In shadow modes, don't allow dragging within the same list
        if (isShadowMode && hoveredList === (draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.sourceList)) {
            // Allow dragging back to word bank from sentence in word bank mode
            if (isWordBankMode && (draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.sourceList) === 'sentence' && hoveredList === 'wordBank') ;
            else if (isWordBankMode && (draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.sourceList) === 'wordBank' && hoveredList === 'wordBank') {
                // Don't allow reordering within word bank
                return;
            }
            else if (isWordBankMode && (draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.sourceList) === 'sentence' && hoveredList === 'sentence') ;
            else if (isNoReorderMode) {
                // In no reorder mode, don't allow any same-list dragging
                return;
            }
        }
        // Only update if the position actually changed significantly
        const lastUpdate = lastUpdateRef.current;
        const hasChanged = lastUpdate.listId !== hoveredList || lastUpdate.index !== newIndex;
        if (hasChanged) {
            // Clear any pending timeout
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
            // Debounce the update to prevent rapid changes
            updateTimeoutRef.current = setTimeout(() => {
                setDragOverList(hoveredList);
                setPlaceholderIndex(newIndex);
                lastUpdateRef.current = { listId: hoveredList, index: newIndex };
            }, 16); // ~60fps
        }
    };
    const handleMouseMove = (e) => {
        if (draggedItem) {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setDragPreview((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
            // Find which list we're hovering over
            let hoveredList = null;
            Object.entries(listRefs.current).forEach(([listId, listElement]) => {
                if (listElement) {
                    const rect = listElement.getBoundingClientRect();
                    if (e.clientX >= rect.left && e.clientX <= rect.right &&
                        e.clientY >= rect.top && e.clientY <= rect.bottom) {
                        hoveredList = listId;
                    }
                }
            });
            // In shadow modes, don't allow hovering over the source list
            if (isShadowMode && hoveredList === draggedItem.sourceList) {
                // Allow dragging back to word bank from sentence in word bank mode
                if (isWordBankMode && draggedItem.sourceList === 'sentence' && hoveredList === 'wordBank') ;
                else if (isWordBankMode && draggedItem.sourceList === 'wordBank' && hoveredList === 'wordBank') {
                    // Don't allow reordering within word bank
                    hoveredList = null;
                }
                else if (isWordBankMode && draggedItem.sourceList === 'sentence' && hoveredList === 'sentence') ;
                else if (isNoReorderMode) {
                    // In no reorder mode, don't allow any same-list dragging
                    hoveredList = null;
                }
            }
            if (hoveredList) {
                const listElement = listRefs.current[hoveredList];
                const rect = listElement.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                // Get all visible items
                const itemElements = Array.from(listElement.querySelectorAll('.item'));
                if (itemElements.length === 0) {
                    updatePlaceholderPosition(hoveredList, 0);
                    return;
                }
                // Find the item that the mouse is closest to
                let bestIndex = 0;
                // Find the natural insertion point where the dragged word would fit
                const rowTolerance = 15; // Tight tolerance for row detection
                // First, find all items on the same row as the mouse cursor
                const itemsOnSameRow = [];
                itemElements.forEach((itemEl, index) => {
                    const itemRect = itemEl.getBoundingClientRect();
                    const itemTop = itemRect.top - rect.top;
                    const itemBottom = itemRect.bottom - rect.top;
                    const itemCenterY = (itemTop + itemBottom) / 2;
                    if (Math.abs(mouseY - itemCenterY) <= rowTolerance) {
                        itemsOnSameRow.push({
                            element: itemEl,
                            index,
                            left: itemRect.left - rect.left,
                            right: itemRect.right - rect.left,
                            centerX: (itemRect.left + itemRect.right) / 2 - rect.left
                        });
                    }
                });
                // Check if user is dragging to the end of the list (right side or bottom right)
                const listWidth = rect.width;
                const listHeight = rect.height;
                const rightThreshold = listWidth * 0.9; // Right 10% of the list (more precise)
                const bottomThreshold = listHeight * 0.9; // Bottom 10% of the list (more precise)
                const isDraggingToEnd = mouseX > rightThreshold || mouseY > bottomThreshold;
                if (isDraggingToEnd) {
                    // User is dragging to the end of the list
                    // Use the original items array length, not the filtered itemElements
                    bestIndex = lists[hoveredList].length;
                }
                else if (itemsOnSameRow.length > 0) {
                    // Sort items by their left position (X coordinate)
                    itemsOnSameRow.sort((a, b) => a.left - b.left);
                    // Find the insertion point based on mouse X position
                    let insertionIndex = 0;
                    for (let i = 0; i < itemsOnSameRow.length; i++) {
                        const item = itemsOnSameRow[i];
                        // If mouse is before this item, insert here
                        if (mouseX < item.left) {
                            insertionIndex = item.index;
                            break;
                        }
                        // If mouse is after this item, continue to next item
                        else if (mouseX > item.right) {
                            insertionIndex = item.index + 1;
                        }
                        // If mouse is inside this item, determine which half
                        else {
                            if (mouseX < item.centerX) {
                                insertionIndex = item.index;
                            }
                            else {
                                insertionIndex = item.index + 1;
                            }
                            break;
                        }
                    }
                    // Check if mouse is past the rightmost item on this row
                    const rightmostItem = itemsOnSameRow[itemsOnSameRow.length - 1];
                    if (mouseX > rightmostItem.right) {
                        // Place at the end of the list
                        insertionIndex = lists[hoveredList].length;
                    }
                    bestIndex = insertionIndex;
                }
                else {
                    // No items on this row and not dragging to end - maintain current position
                    // Only change if we're actually hovering over a different list
                    if (dragOverList !== hoveredList) {
                        bestIndex = 0; // Only reset to beginning when switching lists
                    }
                    else {
                        // Keep the current placeholder position
                        bestIndex = placeholderIndex !== null ? placeholderIndex : 0;
                    }
                }
                updatePlaceholderPosition(hoveredList, bestIndex);
            }
            else {
                updatePlaceholderPosition(null, null);
            }
        }
    };
    const handleMouseUp = (e) => {
        if (draggedItem && dragOverList !== null && placeholderIndex !== null) {
            // In shadow modes, handle returning to original position
            if (isShadowMode && dragOverList === draggedItem.sourceList) {
                // Allow reordering within sentence area in word bank mode
                if (isWordBankMode && draggedItem.sourceList === 'sentence' && dragOverList === 'sentence') {
                    // Complete the drag to new location (reorder within sentence)
                    const result = {
                        draggableId: draggedItem.id,
                        type: 'ITEM',
                        source: {
                            droppableId: draggedItem.sourceList,
                            index: lists[draggedItem.sourceList].findIndex(item => item.id === draggedItem.id)
                        },
                        destination: {
                            droppableId: dragOverList,
                            index: placeholderIndex
                        }
                    };
                    onDragEnd(result);
                }
                else {
                    // Return to original position for other shadow mode operations
                    const result = {
                        draggableId: draggedItem.id,
                        type: 'ITEM',
                        source: {
                            droppableId: draggedItem.sourceList,
                            index: lists[draggedItem.sourceList].findIndex(item => item.id === draggedItem.id)
                        },
                        destination: {
                            droppableId: dragOverList,
                            index: draggedItemOriginalIndex
                        }
                    };
                    onDragEnd(result);
                }
            }
            else {
                // Complete the drag to new location
                // If dragging back to word bank, force it to the original position
                let finalDestinationIndex = placeholderIndex;
                if (isWordBankMode && dragOverList === 'wordBank' && draggedItem.sourceList !== 'wordBank') {
                    // Check if this is a word being returned to word bank
                    if (permanentShadows[draggedItem.id]) {
                        // Force it to return to its original position
                        finalDestinationIndex = permanentShadows[draggedItem.id].originalIndex;
                    }
                }
                const result = {
                    draggableId: draggedItem.id,
                    type: 'ITEM',
                    source: {
                        droppableId: draggedItem.sourceList,
                        index: lists[draggedItem.sourceList].findIndex(item => item.id === draggedItem.id)
                    },
                    destination: {
                        droppableId: dragOverList,
                        index: finalDestinationIndex
                    }
                };
                // Store connection for shadow modes
                if (isShadowMode) {
                    setItemConnections(prev => ({
                        ...prev,
                        [draggedItem.id]: {
                            originalList: draggedItem.sourceList,
                            originalIndex: draggedItemOriginalIndex
                        }
                    }));
                }
                onDragEnd(result);
            }
        }
        // Clear any pending updates
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }
        // Reset state
        setDraggedItem(null);
        setDraggedItemOriginalIndex(null);
        setDragOverList(null);
        setPlaceholderIndex(null);
        setDragPreview(null);
        lastUpdateRef.current = { listId: null, index: null };
    };
    const renderItemsWithPlaceholder = (listId, items) => {
        const result = [];
        const insertIndex = dragOverList === listId ? placeholderIndex : null;
        const originalItemsLength = items.length;
        const isSourceList = (draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.sourceList) === listId;
        // In shadow modes, render all items but replace the dragged item with a shadow
        if (isShadowMode && isSourceList && !isWordBankMode) {
            items.forEach((item, index) => {
                var _a;
                // Check if this item has a permanent shadow (for wordbank mode)
                const hasPermanentShadow = isWordBankMode && permanentShadows[item.id];
                // If this is the dragged item, render shadow instead
                if ((draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.id) === item.id) {
                    result.push(jsxRuntime.exports.jsx("div", { className: `item-shadow ${isWordBankMode ? 'wordbank-mode' : 'regular-mode'}`, children: (draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.text) || 'Shadow' }, `shadow-${listId}-${index}`));
                }
                else if (hasPermanentShadow) {
                    // Show permanent shadow for moved items
                    result.push(jsxRuntime.exports.jsx("div", { className: "item-shadow permanent-shadow", children: ((_a = permanentShadows[item.id]) === null || _a === void 0 ? void 0 : _a.text) || item.text }, `permanent-shadow-${listId}-${index}`));
                }
                else {
                    // Render normal item
                    result.push(jsxRuntime.exports.jsx("div", { className: "item source-item", style: {
                            backgroundColor: item.color,
                        }, onMouseDown: (e) => handleMouseDown(e, item, listId), children: jsxRuntime.exports.jsx("span", { className: "item-text", children: item.text }) }, item.id));
                }
            });
        }
        else if (isWordBankMode && listId === 'sentence') {
            // Sentence area in word bank mode should use normal reorder mode rendering
            // Regular reorder mode rendering for sentence area
            items.forEach((item, index) => {
                // Skip the dragged item entirely - don't render it at all
                if ((draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.id) === item.id) {
                    return;
                }
                // Add placeholder before the insert position
                if (insertIndex === index) {
                    result.push(jsxRuntime.exports.jsx("div", { className: "placeholder wordbank-mode", children: (draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.text) || 'Drop' }, `placeholder-${listId}-${index}`));
                }
                // Add the actual item (only if not being dragged)
                result.push(jsxRuntime.exports.jsx("div", { className: "item", style: {
                        backgroundColor: item.color,
                        opacity: 1,
                    }, onMouseDown: (e) => handleMouseDown(e, item, listId), children: jsxRuntime.exports.jsx("span", { className: "item-text", children: item.text }) }, item.id));
            });
            // Add placeholder at the end if needed
            if (insertIndex === originalItemsLength) {
                result.push(jsxRuntime.exports.jsx("div", { className: "placeholder wordbank-mode", children: (draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.text) || 'Drop' }, `placeholder-${listId}-end`));
            }
        }
        else if (isWordBankMode && listId === 'wordBank') {
            // For word bank mode, always check for permanent shadows in word bank
            // Render all items in the word bank, checking if each should be a shadow
            items.forEach((item, index) => {
                // Check if this item should be rendered as a shadow
                if (permanentShadows[item.id]) {
                    // This item should be a shadow
                    // If we're dragging back to word bank, make the shadow look like a drop target
                    const isDraggingBackToShadow = draggedItem &&
                        draggedItem.sourceList !== 'wordBank' &&
                        permanentShadows[draggedItem.id] &&
                        permanentShadows[draggedItem.id].originalIndex === index;
                    result.push(jsxRuntime.exports.jsx("div", { className: `item-shadow ${isDraggingBackToShadow ? 'wordbank-mode' : 'permanent-shadow'}`, children: item.text }, `permanent-shadow-${listId}-${index}`));
                }
                else {
                    // This item should be a normal draggable word
                    result.push(jsxRuntime.exports.jsx("div", { className: "item", style: {
                            backgroundColor: item.color,
                        }, onMouseDown: (e) => handleMouseDown(e, item, listId), children: jsxRuntime.exports.jsx("span", { className: "item-text", children: item.text }) }, item.id));
                }
            });
            // Remove placeholder logic for word bank - words can only return to their original shadow position
        }
        else {
            // Regular reorder mode or target lists in shadow modes
            items.forEach((item, index) => {
                // Skip the dragged item entirely - don't render it at all
                if ((draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.id) === item.id) {
                    return;
                }
                // Add placeholder before the insert position
                if (insertIndex === index) {
                    result.push(jsxRuntime.exports.jsx("div", { className: `placeholder ${isShadowMode ? 'wordbank-mode' : ''}`, children: (draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.text) || 'Drop' }, `placeholder-${listId}-${index}`));
                }
                // Add the actual item (only if not being dragged)
                result.push(jsxRuntime.exports.jsx("div", { className: "item", style: {
                        backgroundColor: item.color,
                        opacity: 1,
                    }, onMouseDown: (e) => handleMouseDown(e, item, listId), children: jsxRuntime.exports.jsx("span", { className: "item-text", children: item.text }) }, item.id));
            });
            // Add placeholder at the end if needed
            if (insertIndex === originalItemsLength) {
                result.push(jsxRuntime.exports.jsx("div", { className: `placeholder ${isShadowMode ? 'wordbank-mode' : ''}`, children: (draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.text) || 'Drop' }, `placeholder-${listId}-end`));
            }
        }
        return result;
    };
    useEffect(() => {
        if (draggedItem) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                if (updateTimeoutRef.current) {
                    clearTimeout(updateTimeoutRef.current);
                }
            };
        }
    }, [draggedItem, dragOverList, placeholderIndex, draggedItemOriginalIndex]);
    return (jsxRuntime.exports.jsxs("div", { className: "container", children: [Object.entries(lists).map(([listId, items]) => (jsxRuntime.exports.jsxs("div", { className: "list-container", children: [jsxRuntime.exports.jsxs("h3", { className: "list-title", children: [listId === 'list1' ? 'Articles & Pronouns' :
                                listId === 'list2' ? 'Nouns' :
                                    listId === 'list3' ? 'Verbs' :
                                        listId === 'paragraph' ? 'Sample Paragraph' :
                                            listId === 'sentence' ? 'Build Your Sentence' :
                                                listId === 'wordBank' ? 'Word Bank' : 'Unknown', isShadowMode && (draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.sourceList) === listId && (jsxRuntime.exports.jsx("span", { style: { fontSize: '0.8em', color: '#666', marginLeft: '0.5rem' }, children: "(Source - drag to other lists)" }))] }), jsxRuntime.exports.jsx("div", { ref: (el) => listRefs.current[listId] = el, className: `list ${dragOverList === listId ? 'dragging-over' : ''} ${isShadowMode && (draggedItem === null || draggedItem === void 0 ? void 0 : draggedItem.sourceList) === listId ? 'source-list' : ''}`, children: renderItemsWithPlaceholder(listId, items) })] }, listId))), dragPreview && (jsxRuntime.exports.jsx("div", { className: "drag-preview", style: {
                    left: dragPreview.x - 30,
                    top: dragPreview.y - 20,
                    backgroundColor: dragPreview.color,
                }, children: dragPreview.text }))] }));
};

var DragMode;
(function (DragMode) {
    DragMode["REORDER"] = "reorder";
    DragMode["NO_REORDER"] = "no-reorder";
    DragMode["WORDBANK"] = "wordbank";
    DragMode["CUSTOM"] = "custom";
})(DragMode || (DragMode = {}));

// Reducer for managing drag-and-drop state
const dragDropReducer = (state, action) => {
    switch (action.type) {
        case 'REGISTER_DRAGGABLE':
            return {
                ...state,
                draggables: new Map(state.draggables).set(action.payload.draggableId, action.payload),
            };
        case 'UNREGISTER_DRAGGABLE':
            const newDraggables = new Map(state.draggables);
            newDraggables.delete(action.payload);
            return {
                ...state,
                draggables: newDraggables,
            };
        case 'REGISTER_DROPPABLE':
            return {
                ...state,
                droppables: new Map(state.droppables).set(action.payload.id, action.payload.config),
            };
        case 'UNREGISTER_DROPPABLE':
            const newDroppables = new Map(state.droppables);
            newDroppables.delete(action.payload);
            return {
                ...state,
                droppables: newDroppables,
            };
        case 'START_DRAG':
            return {
                ...state,
                currentDrag: {
                    draggableId: action.payload.draggableId,
                    source: action.payload.source,
                    data: action.payload.data,
                },
            };
        case 'END_DRAG':
            return {
                ...state,
                currentDrag: null,
                dragPreview: null,
            };
        case 'SET_DRAG_PREVIEW':
            return {
                ...state,
                dragPreview: {
                    element: action.payload.element,
                    offset: action.payload.offset,
                },
            };
        case 'SET_PERMANENT_SHADOWS':
            return {
                ...state,
                permanentShadows: action.payload,
            };
        case 'ADD_PERMANENT_SHADOW':
            return {
                ...state,
                permanentShadows: {
                    ...state.permanentShadows,
                    [action.payload.id]: action.payload.shadow,
                },
            };
        case 'REMOVE_PERMANENT_SHADOW':
            const newShadows = { ...state.permanentShadows };
            delete newShadows[action.payload];
            return {
                ...state,
                permanentShadows: newShadows,
            };
        default:
            return state;
    }
};
// Create the context
const DragDropContext = createContext(null);
const DragDropProvider = ({ children, onDragEnd, onDragStart, onDragUpdate, mode = DragMode.REORDER, enableDragPreview = true, dragPreviewOptions = {}, }) => {
    const [state, dispatch] = useReducer(dragDropReducer, {
        draggables: new Map(),
        droppables: new Map(),
        currentDrag: null,
        dragPreview: null,
        permanentShadows: {},
    });
    // Memoized callbacks to prevent unnecessary re-renders
    const registerDraggable = useCallback((config) => {
        dispatch({ type: 'REGISTER_DRAGGABLE', payload: config });
    }, []);
    const unregisterDraggable = useCallback((draggableId) => {
        dispatch({ type: 'UNREGISTER_DRAGGABLE', payload: draggableId });
    }, []);
    const registerDroppable = useCallback((droppableId, config) => {
        dispatch({ type: 'REGISTER_DROPPABLE', payload: { id: droppableId, config } });
    }, []);
    const unregisterDroppable = useCallback((droppableId) => {
        dispatch({ type: 'UNREGISTER_DROPPABLE', payload: droppableId });
    }, []);
    const getDraggable = useCallback((draggableId) => {
        return state.draggables.get(draggableId);
    }, [state.draggables]);
    const getDroppable = useCallback((droppableId) => {
        return state.droppables.get(droppableId);
    }, [state.droppables]);
    const setPermanentShadows = useCallback((shadows) => {
        dispatch({ type: 'SET_PERMANENT_SHADOWS', payload: shadows });
    }, []);
    const addPermanentShadow = useCallback((id, shadow) => {
        dispatch({ type: 'ADD_PERMANENT_SHADOW', payload: { id, shadow } });
    }, []);
    const removePermanentShadow = useCallback((id) => {
        dispatch({ type: 'REMOVE_PERMANENT_SHADOW', payload: id });
    }, []);
    // Memoized context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        mode,
        onDragStart,
        onDragUpdate,
        onDragEnd,
        enableDragPreview,
        dragPreviewOptions,
        registerDraggable,
        unregisterDraggable,
        registerDroppable,
        unregisterDroppable,
        getDraggable,
        getDroppable,
        permanentShadows: state.permanentShadows,
        setPermanentShadows,
        addPermanentShadow,
        removePermanentShadow,
    }), [
        mode,
        onDragStart,
        onDragUpdate,
        onDragEnd,
        enableDragPreview,
        dragPreviewOptions,
        registerDraggable,
        unregisterDraggable,
        registerDroppable,
        unregisterDroppable,
        getDraggable,
        getDroppable,
        state.permanentShadows,
        setPermanentShadows,
        addPermanentShadow,
        removePermanentShadow,
    ]);
    return (jsxRuntime.exports.jsx(DragDropContext.Provider, { value: contextValue, children: children }));
};
// Custom hook to use the drag-and-drop context
const useDragDropContext = () => {
    const context = useContext(DragDropContext);
    if (!context) {
        throw new Error('useDragDropContext must be used within a DragDropProvider');
    }
    return context;
};

const Draggable = React.memo(({ draggableId, index, children, type = 'default', data, isDragDisabled = false, isShadow = false, listId, permanentShadows, }) => {
    const context = useDragDropContext();
    const elementRef = useRef(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState(null);
    // Memoized configuration to prevent unnecessary re-registrations
    const config = useMemo(() => ({
        draggableId,
        index,
        type,
        data,
        isDragDisabled,
    }), [draggableId, index, type, data, isDragDisabled]);
    // Auto-register and unregister with validation
    useEffect(() => {
        context.registerDraggable(config);
        // Auto-cleanup on unmount
        return () => {
            context.unregisterDraggable(draggableId);
        };
    }, [config, context, draggableId]);
    // Drag event handlers
    const handleMouseDown = useCallback((event) => {
        if (isDragDisabled || event.button !== 0)
            return; // Only left mouse button
        const element = elementRef.current;
        if (!element)
            return;
        const rect = element.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        setDragOffset({ x: offsetX, y: offsetY });
        setIsDragging(true);
        // Call onDragStart if provided
        if (context.onDragStart) {
            context.onDragStart({
                draggableId,
                type,
                source: { droppableId: 'unknown', index },
                data,
            });
        }
    }, [isDragDisabled, context, draggableId, type, index, data]);
    const handleMouseMove = useCallback((event) => {
        if (!isDragging || !dragOffset)
            return;
        // Update drag preview position
        event.clientX - dragOffset.x;
        event.clientY - dragOffset.y;
        // Call onDragUpdate if provided
        if (context.onDragUpdate) {
            context.onDragUpdate({
                draggableId,
                type,
                source: { droppableId: 'unknown', index },
                destination: undefined,
                data,
            });
        }
    }, [isDragging, dragOffset, context, draggableId, type, index, data]);
    const handleMouseUp = useCallback(() => {
        if (!isDragging)
            return;
        setIsDragging(false);
        setDragOffset(null);
        // Call onDragEnd
        context.onDragEnd({
            draggableId,
            type,
            source: { droppableId: 'unknown', index },
            reason: 'DROP',
            data,
        });
    }, [isDragging, context, draggableId, type, index, data]);
    // Global mouse event listeners
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);
    // Memoized provided props to prevent unnecessary re-renders
    const provided = useMemo(() => ({
        innerRef: (element) => {
            elementRef.current = element;
        },
        draggableProps: {
            onMouseDown: handleMouseDown,
            style: isDragging ? {
                opacity: 0.5,
                transform: dragOffset ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : undefined,
                pointerEvents: 'none',
            } : undefined,
        },
        dragHandleProps: {
            onMouseDown: handleMouseDown,
            style: { cursor: isDragDisabled ? 'default' : 'grab' },
        },
    }), [handleMouseDown, isDragging, dragOffset, isDragDisabled]);
    // Memoized snapshot to prevent unnecessary re-renders
    const snapshot = useMemo(() => ({
        isDragging,
        draggingOver: undefined,
        dragOffset: dragOffset || undefined,
    }), [isDragging, dragOffset]);
    // Render shadow if this is a shadow item in word bank mode
    if (isShadow && listId === 'wordBank' && permanentShadows && permanentShadows[draggableId]) {
        const shadowData = permanentShadows[draggableId];
        return (jsxRuntime.exports.jsx("div", { style: {
                backgroundColor: 'hsl(0, 0%, 10%)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.25rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: 'hsl(0, 0%, 10%)',
                pointerEvents: 'none',
                minWidth: 'fit-content',
                height: '40px',
                whiteSpace: 'nowrap',
                margin: '0 0.25rem',
                position: 'relative',
                flexShrink: 0,
                boxSizing: 'border-box',
            }, children: jsxRuntime.exports.jsx("span", { style: {
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                }, children: shadowData.text || (data === null || data === void 0 ? void 0 : data.text) }) }));
    }
    return jsxRuntime.exports.jsx(jsxRuntime.exports.Fragment, { children: children(provided, snapshot) });
});
// Add display name for better debugging
Draggable.displayName = 'Draggable';

const Droppable = React.memo(({ droppableId, children, type = 'default', isDropDisabled = false, }) => {
    const context = useDragDropContext();
    const elementRef = useRef(null);
    const [isDraggingOver, setIsDraggingOver] = React.useState(false);
    const [draggingOverWith, setDraggingOverWith] = React.useState(undefined);
    const [draggingFromThisWith, setDraggingFromThisWith] = React.useState(undefined);
    // Memoized configuration to prevent unnecessary re-registrations
    const config = useMemo(() => ({
        type,
        isDropDisabled,
    }), [type, isDropDisabled]);
    // Auto-register and unregister with validation
    useEffect(() => {
        context.registerDroppable(droppableId, config);
        // Auto-cleanup on unmount
        return () => {
            context.unregisterDroppable(droppableId);
        };
    }, [droppableId, config, context]);
    // Drop zone detection
    const isPointInDropZone = useCallback((point) => {
        const element = elementRef.current;
        if (!element)
            return false;
        const rect = element.getBoundingClientRect();
        return (point.x >= rect.left &&
            point.x <= rect.right &&
            point.y >= rect.top &&
            point.y <= rect.bottom);
    }, []);
    // Calculate drop index
    const calculateDropIndex = useCallback((point) => {
        const element = elementRef.current;
        if (!element)
            return 0;
        const rect = element.getBoundingClientRect();
        const relativeY = point.y - rect.top;
        // Simple vertical index calculation
        // In a real implementation, you'd want to calculate based on child elements
        const childHeight = 50; // Default child height
        return Math.floor(relativeY / childHeight);
    }, []);
    // Global mouse move handler for drop detection
    const handleGlobalMouseMove = useCallback((event) => {
        const point = { x: event.clientX, y: event.clientY };
        if (isPointInDropZone(point)) {
            if (!isDraggingOver) {
                setIsDraggingOver(true);
                // You would set draggingOverWith based on the current drag
                setDraggingOverWith('current-drag-id');
            }
        }
        else {
            if (isDraggingOver) {
                setIsDraggingOver(false);
                setDraggingOverWith(undefined);
            }
        }
    }, [isPointInDropZone, isDraggingOver]);
    // Global mouse up handler for drop
    const handleGlobalMouseUp = useCallback((event) => {
        if (isDraggingOver && !isDropDisabled) {
            const point = { x: event.clientX, y: event.clientY };
            const dropIndex = calculateDropIndex(point);
            // Call onDragEnd with proper destination
            context.onDragEnd({
                draggableId: 'current-drag-id',
                type,
                source: { droppableId: 'source-droppable', index: 0 },
                destination: { droppableId, index: dropIndex },
                reason: 'DROP',
            });
        }
        setIsDraggingOver(false);
        setDraggingOverWith(undefined);
    }, [isDraggingOver, isDropDisabled, calculateDropIndex, context, droppableId, type]);
    // Global event listeners
    useEffect(() => {
        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [handleGlobalMouseMove, handleGlobalMouseUp]);
    // Memoized provided props to prevent unnecessary re-renders
    const provided = useMemo(() => ({
        innerRef: (element) => {
            elementRef.current = element;
        },
        droppableProps: {
            style: {
                minHeight: '50px',
                border: isDraggingOver ? '2px dashed #4caf50' : '2px dashed transparent',
                transition: 'border-color 0.2s ease',
            },
        },
        placeholder: isDraggingOver ? (jsxRuntime.exports.jsx("div", { style: {
                height: '50px',
                border: '2px dashed #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
            }, children: "Drop here" })) : null,
    }), [isDraggingOver]);
    // Memoized snapshot to prevent unnecessary re-renders
    const snapshot = useMemo(() => ({
        isDraggingOver,
        draggingOverWith,
        draggingFromThisWith,
    }), [isDraggingOver, draggingOverWith, draggingFromThisWith]);
    return jsxRuntime.exports.jsx(jsxRuntime.exports.Fragment, { children: children(provided, snapshot) });
});
// Add display name for better debugging
Droppable.displayName = 'Droppable';

const DragDropItem = ({ item, listId, index, isDragging, isSourceItem, onMouseDown }) => {
    return (jsxRuntime.exports.jsx("div", { className: `drag-drop-item ${isSourceItem ? 'drag-drop-source-item' : ''}`, style: {
            backgroundColor: item.color,
            opacity: isSourceItem ? 0.6 : 1,
            cursor: isSourceItem ? 'not-allowed' : 'grab',
        }, onMouseDown: (e) => onMouseDown(e, item, listId), children: jsxRuntime.exports.jsx("span", { className: "drag-drop-item-text", children: item.text }) }));
};
var DragDropItem$1 = React.memo(DragDropItem);

const DragDropList = ({ listId, items, isDraggingOver, isSourceList, children }) => {
    const getListTitle = (listId) => {
        switch (listId) {
            case 'list1': return 'Articles & Pronouns';
            case 'list2': return 'Nouns';
            case 'list3': return 'Verbs';
            case 'paragraph': return 'Sample Paragraph';
            case 'sentence': return 'Build Your Sentence';
            case 'wordBank': return 'Word Bank';
            default: return listId;
        }
    };
    return (jsxRuntime.exports.jsxs("div", { className: "drag-drop-list-container", children: [jsxRuntime.exports.jsxs("h3", { className: "drag-drop-list-title", children: [getListTitle(listId), isSourceList && (jsxRuntime.exports.jsx("span", { style: { fontSize: '0.8em', color: '#666', marginLeft: '0.5rem' }, children: "(Source - drag to other lists)" }))] }), jsxRuntime.exports.jsx("div", { className: `drag-drop-list ${isDraggingOver ? 'drag-drop-dragging-over' : ''} ${isSourceList ? 'drag-drop-source-list' : ''}`, children: children })] }));
};
var DragDropList$1 = React.memo(DragDropList);

const DragPreview = ({ preview }) => {
    return (jsxRuntime.exports.jsx("div", { className: "drag-drop-preview", style: {
            position: 'fixed',
            left: preview.x - 30,
            top: preview.y - 20,
            backgroundColor: preview.color,
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            transform: 'rotate(5deg)',
        }, children: preview.text }));
};
var DragPreview$1 = React.memo(DragPreview);

const Placeholder = ({ text, isShadowMode }) => {
    return (jsxRuntime.exports.jsx("div", { className: "drag-drop-placeholder", style: {
            backgroundColor: isShadowMode ? '#e3f2fd' : '#d0d0d0',
            border: isShadowMode ? '2px dashed #2196f3' : '2px dashed #888',
            borderRadius: '6px',
            margin: '0 0.25rem',
            padding: '0.25rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: isShadowMode ? '#1976d2' : '#666',
            pointerEvents: 'none',
            minWidth: 'fit-content',
            height: '40px',
            whiteSpace: 'nowrap',
        }, children: text }));
};
var Placeholder$1 = React.memo(Placeholder);

const ShadowItem = ({ text, isDraggingBackToShadow }) => {
    return (jsxRuntime.exports.jsx("div", { className: `drag-drop-shadow ${isDraggingBackToShadow ? 'wordbank-mode' : 'permanent-shadow'}`, children: text }));
};
var ShadowItem$1 = React.memo(ShadowItem);

const useDragDrop = (options) => {
    const context = useDragDropContext();
    const dragRef = useRef(null);
    const dropRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(null);
    const [isOverDropZone, setIsOverDropZone] = useState(false);
    // Memoized configuration
    const config = useCallback(() => ({
        draggableId: `drag-${Math.random().toString(36).substr(2, 9)}`,
        index: 0,
        type: options.type,
        data: options.item,
        isDragDisabled: typeof options.canDrag === 'function' ? !options.canDrag() : !options.canDrag,
    }), [options.type, options.item, options.canDrag]);
    // Auto-register with validation
    useEffect(() => {
        const dragConfig = config();
        context.registerDraggable(dragConfig);
        return () => {
            context.unregisterDraggable(dragConfig.draggableId);
        };
    }, [config, context]);
    // Drag event handlers
    const handleDragStart = useCallback((event) => {
        const canDrag = typeof options.canDrag === 'function' ? options.canDrag() : options.canDrag;
        if (!canDrag || event.button !== 0)
            return;
        const element = dragRef.current;
        if (!element)
            return;
        const rect = element.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        setDragOffset({ x: offsetX, y: offsetY });
        setIsDragging(true);
        if (context.onDragStart) {
            context.onDragStart({
                draggableId: config().draggableId,
                type: options.type,
                source: { droppableId: 'unknown', index: 0 },
                data: options.item,
            });
        }
    }, [options, context, config]);
    const handleDragMove = useCallback((event) => {
        if (!isDragging || !dragOffset)
            return;
        // Check if over drop zone
        const dropElement = dropRef.current;
        if (dropElement) {
            const rect = dropElement.getBoundingClientRect();
            const isOver = (event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom);
            setIsOverDropZone(isOver);
        }
        if (context.onDragUpdate) {
            context.onDragUpdate({
                draggableId: config().draggableId,
                type: options.type,
                source: { droppableId: 'unknown', index: 0 },
                data: options.item,
            });
        }
    }, [isDragging, dragOffset, context, config, options]);
    const handleDragEnd = useCallback(() => {
        if (!isDragging)
            return;
        setIsDragging(false);
        setDragOffset(null);
        setIsOverDropZone(false);
        context.onDragEnd({
            draggableId: config().draggableId,
            type: options.type,
            source: { droppableId: 'unknown', index: 0 },
            destination: isOverDropZone ? { droppableId: 'drop-zone', index: 0 } : undefined,
            reason: isOverDropZone ? 'DROP' : 'CANCEL',
            data: options.item,
        });
    }, [isDragging, context, config, options, isOverDropZone]);
    // Global event listeners
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('mouseup', handleDragEnd);
            return () => {
                document.removeEventListener('mousemove', handleDragMove);
                document.removeEventListener('mouseup', handleDragEnd);
            };
        }
    }, [isDragging, handleDragMove, handleDragEnd]);
    // Monitor for collect function
    const monitor = {
        isDragging,
        canDrag: typeof options.canDrag === 'function' ? options.canDrag() : !!options.canDrag,
        canDrop: typeof options.canDrop === 'function' ? options.canDrop(options.item) : !!options.canDrop,
        item: options.item,
        itemType: options.type,
        dragOffset,
    };
    // Collected props from collect function
    const collectedProps = options.collect ? options.collect(monitor) : {};
    // Memoized return values
    const dragRefCallback = useCallback((element) => {
        dragRef.current = element;
    }, []);
    const dropRefCallback = useCallback((element) => {
        dropRef.current = element;
    }, []);
    const dragHandleProps = useCallback(() => ({
        onMouseDown: handleDragStart,
        style: {
            cursor: monitor.canDrag ? 'grab' : 'default',
            userSelect: 'none',
        },
    }), [handleDragStart, monitor.canDrag]);
    const dropProps = useCallback(() => ({
        style: {
            minHeight: '50px',
            border: isOverDropZone ? '2px dashed #4caf50' : '2px dashed transparent',
            transition: 'border-color 0.2s ease',
        },
    }), [isOverDropZone]);
    return {
        isDragging,
        canDrag: monitor.canDrag,
        canDrop: monitor.canDrop,
        dragRef: dragRefCallback,
        dropRef: dropRefCallback,
        dragHandleProps: dragHandleProps(),
        dropProps: dropProps(),
        collectedProps,
    };
};

const initialPreviewState = {
    mousePosition: { x: 0, y: 0 },
    dragPreview: null,
};
function useDragPreview() {
    const [state, setState] = useState(initialPreviewState);
    const updateMousePosition = useCallback((position) => {
        setState(prev => ({
            ...prev,
            mousePosition: position,
        }));
    }, []);
    const updateDragPreview = useCallback((preview) => {
        setState(prev => ({
            ...prev,
            dragPreview: preview,
        }));
    }, []);
    const updatePreviewPosition = useCallback((x, y) => {
        setState(prev => ({
            ...prev,
            mousePosition: { x, y },
            dragPreview: prev.dragPreview ? { ...prev.dragPreview, x, y } : null,
        }));
    }, []);
    const resetPreview = useCallback(() => {
        setState(initialPreviewState);
    }, []);
    return {
        state,
        updateMousePosition,
        updateDragPreview,
        updatePreviewPosition,
        resetPreview,
    };
}

const initialDragState = {
    draggedItem: null,
    dragOverList: null,
    placeholderIndex: null,
    draggedItemOriginalIndex: null,
    itemConnections: {},
};
function dragReducer(state, action) {
    switch (action.type) {
        case 'START_DRAG':
            return {
                ...state,
                draggedItem: { ...action.payload.item, sourceList: action.payload.sourceList },
                draggedItemOriginalIndex: action.payload.originalIndex,
            };
        case 'UPDATE_POSITION':
            return {
                ...state,
                dragOverList: action.payload.dragOverList,
                placeholderIndex: action.payload.placeholderIndex,
            };
        case 'END_DRAG':
            return {
                ...initialDragState,
                itemConnections: state.itemConnections, // Preserve connections
            };
        case 'ADD_CONNECTION':
            return {
                ...state,
                itemConnections: {
                    ...state.itemConnections,
                    [action.payload.itemId]: action.payload.connection,
                },
            };
        default:
            return state;
    }
}
function useDragState() {
    const [state, dispatch] = useReducer(dragReducer, initialDragState);
    const lastUpdateRef = useRef({ listId: null, index: null });
    const updateTimeoutRef = useRef(null);
    const startDrag = useCallback((item, sourceList, originalIndex, preview) => {
        dispatch({
            type: 'START_DRAG',
            payload: { item, sourceList, originalIndex, preview },
        });
    }, []);
    const updatePosition = useCallback((dragOverList, placeholderIndex) => {
        // Only update if the position actually changed significantly
        const lastUpdate = lastUpdateRef.current;
        const hasChanged = lastUpdate.listId !== dragOverList || lastUpdate.index !== placeholderIndex;
        if (hasChanged) {
            // Clear any pending timeout
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
            // Debounce the update to prevent rapid changes
            updateTimeoutRef.current = setTimeout(() => {
                dispatch({
                    type: 'UPDATE_POSITION',
                    payload: { dragOverList, placeholderIndex },
                });
                lastUpdateRef.current = { listId: dragOverList, index: placeholderIndex };
            }, 16); // ~60fps
        }
    }, []);
    const endDrag = useCallback(() => {
        // Clear any pending updates
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }
        dispatch({ type: 'END_DRAG' });
        lastUpdateRef.current = { listId: null, index: null };
    }, []);
    const addConnection = useCallback((itemId, connection) => {
        dispatch({
            type: 'ADD_CONNECTION',
            payload: { itemId, connection },
        });
    }, []);
    return {
        state,
        startDrag,
        updatePosition,
        endDrag,
        addConnection,
    };
}

function useListRefs() {
    const listRefs = useRef({});
    const setListRef = useCallback((listId, element) => {
        listRefs.current[listId] = element;
    }, []);
    const getListRef = useCallback((listId) => {
        return listRefs.current[listId];
    }, []);
    const getAllListRefs = useCallback(() => {
        return listRefs.current;
    }, []);
    const clearListRefs = useCallback(() => {
        listRefs.current = {};
    }, []);
    return {
        listRefs: listRefs.current,
        setListRef,
        getListRef,
        getAllListRefs,
        clearListRefs,
    };
}

function usePermanentShadows() {
    const [permanentShadows, setPermanentShadows] = useState({});
    const addShadow = useCallback((itemId, shadow) => {
        setPermanentShadows(prev => ({
            ...prev,
            [itemId]: shadow,
        }));
    }, []);
    const removeShadow = useCallback((itemId) => {
        setPermanentShadows(prev => {
            const newShadows = { ...prev };
            delete newShadows[itemId];
            return newShadows;
        });
    }, []);
    const updateShadow = useCallback((itemId, updates) => {
        setPermanentShadows(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], ...updates },
        }));
    }, []);
    const clearShadows = useCallback(() => {
        setPermanentShadows({});
    }, []);
    const hasShadow = useCallback((itemId) => {
        return !!permanentShadows[itemId];
    }, [permanentShadows]);
    const getShadow = useCallback((itemId) => {
        return permanentShadows[itemId];
    }, [permanentShadows]);
    return {
        permanentShadows,
        addShadow,
        removeShadow,
        updateShadow,
        clearShadows,
        hasShadow,
        getShadow,
    };
}

export { CustomDragDrop, DragDropItem$1 as DragDropItem, DragDropList$1 as DragDropList, DragDropProvider, DragMode, DragPreview$1 as DragPreview, Draggable, Droppable, Placeholder$1 as Placeholder, ShadowItem$1 as ShadowItem, useDragDrop, useDragPreview, useDragState, useListRefs, usePermanentShadows };
