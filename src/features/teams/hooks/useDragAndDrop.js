import { useState } from "react";

export function useDragAndDrop(teamSlots, swapPokemonPositions, maxSlots) {
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [touchStartPos, setTouchStartPos] = useState(null);
    const [touchDraggedIndex, setTouchDraggedIndex] = useState(null);
    const [touchDragOffset, setTouchDragOffset] = useState({ x: 0, y: 0 });
    const handleDragStart = (e, slotIndex) => {
        const pokemon = teamSlots[slotIndex];
        if (!pokemon) return;

        e.dataTransfer.setData("text/plain", slotIndex.toString());
        e.dataTransfer.effectAllowed = "move";
        setDraggedIndex(slotIndex);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDragEnter = (e, slotIndex) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== slotIndex) {
            setDragOverIndex(slotIndex);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDragOverIndex(null);
        }
    };

    const handleDrop = (e, targetSlotIndex) => {
        e.preventDefault();
        const sourceSlotIndex = parseInt(e.dataTransfer.getData("text/plain"));

        if (sourceSlotIndex !== targetSlotIndex) {
            swapPokemonPositions(sourceSlotIndex, targetSlotIndex);
        }

        resetDragState();
    };

    const handleDragEnd = () => {
        resetDragState();
    };
    const handleTouchStart = (e, slotIndex) => {
        const pokemon = teamSlots[slotIndex];
        if (!pokemon) return;

        const touch = e.touches[0];
        setTouchStartPos({ x: touch.clientX, y: touch.clientY });
        setTouchDraggedIndex(slotIndex);
        setTouchDragOffset({ x: 0, y: 0 });
        e.preventDefault();
    };

    const handleTouchMove = (e) => {
        if (touchDraggedIndex === null || touchStartPos === null) return;

        const touch = e.touches[0];
        const newOffset = {
            x: touch.clientX - touchStartPos.x,
            y: touch.clientY - touchStartPos.y,
        };

        setTouchDragOffset(newOffset);

        const elementUnderTouch = document.elementFromPoint(
            touch.clientX,
            touch.clientY,
        );
        const slotElement = elementUnderTouch?.closest("[data-slot-index]");

        if (slotElement) {
            const targetIndex = parseInt(
                slotElement.getAttribute("data-slot-index"),
            );
            if (
                targetIndex !== touchDraggedIndex &&
                targetIndex >= 0 &&
                targetIndex < maxSlots
            ) {
                setDragOverIndex(targetIndex);
            }
        } else {
            setDragOverIndex(null);
        }

        e.preventDefault();
    };

    const handleTouchEnd = (e) => {
        if (touchDraggedIndex === null) return;

        const touch = e.changedTouches[0];

        const draggedElement = document.querySelector(
            `[data-slot-index="${touchDraggedIndex}"]`,
        );
        if (draggedElement) {
            draggedElement.style.pointerEvents = "none";
        }

        const elementUnderTouch = document.elementFromPoint(
            touch.clientX,
            touch.clientY,
        );
        const slotElement = elementUnderTouch?.closest("[data-slot-index]");

        if (draggedElement) {
            draggedElement.style.pointerEvents = "";
        }

        if (slotElement) {
            const targetIndex = parseInt(
                slotElement.getAttribute("data-slot-index"),
            );

            if (
                targetIndex !== touchDraggedIndex &&
                targetIndex >= 0 &&
                targetIndex < maxSlots
            ) {
                swapPokemonPositions(touchDraggedIndex, targetIndex);
            }
        }

        resetTouchState();
        e.preventDefault();
    };

    const resetDragState = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const resetTouchState = () => {
        setTouchStartPos(null);
        setTouchDraggedIndex(null);
        setTouchDragOffset({ x: 0, y: 0 });
        setDragOverIndex(null);
    };

    const getDragProps = (index) => {
        const pokemon = teamSlots[index];
        const isDragging = draggedIndex === index;
        const isDragOver = dragOverIndex === index;
        const willSwap =
            isDragOver && draggedIndex !== null && draggedIndex !== index;
        const isDraggedTouch = touchDraggedIndex === index;
        const touchTransform = isDraggedTouch
            ? `translate(${touchDragOffset.x}px, ${touchDragOffset.y}px)`
            : "";

        return {
            "data-slot-index": index,
            draggable: !!pokemon,
            onDragStart: (e) => handleDragStart(e, index),
            onDragOver: handleDragOver,
            onDragEnter: (e) => handleDragEnter(e, index),
            onDragLeave: handleDragLeave,
            onDrop: (e) => handleDrop(e, index),
            onDragEnd: handleDragEnd,
            onTouchStart: (e) => handleTouchStart(e, index),
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
            style: {
                transform: touchTransform,
                zIndex: isDraggedTouch ? 1000 : 1,
                transition: isDraggedTouch ? "none" : "transform 0.2s ease",
            },
            className: `
        ${pokemon ? "cursor-grab active:cursor-grabbing touch-none" : ""}
        ${isDraggedTouch ? "opacity-80 scale-105 shadow-2xl" : ""}
      `,
            slotClassName: `
        ${willSwap ? "ring-4 ring-blue-400 ring-opacity-60 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg" : ""}
        ${isDragging ? "opacity-30 blur-sm" : ""}
      `,
        };
    };

    return {
        getDragProps,
    };
}
