import React from 'react';
import { render, screen } from '@testing-library/react';
import NoteCard from '../NoteCard';
import '@testing-library/jest-dom';

describe('NoteCard Component', () => {
    const mockNote = {
        _id: '1',
        title: 'Test Note',
        description: 'Test Description',
        labels: [{ _id: 'l1', name: 'Work' }],
        checklist: [],
        isTrash: false
    };

    const mockChecklistNote = {
        _id: '2',
        title: 'Checklist Note',
        labels: [],
        checklist: [
            { text: 'Item 1', isDone: false },
            { text: 'Item 2', isDone: true }
        ],
        isTrash: false
    };

    test('renders note title and description', () => {
        render(<NoteCard note={mockNote} onAction={() => {}} />);
        expect(screen.getByText('Test Note')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    test('renders labels', () => {
        render(<NoteCard note={mockNote} onAction={() => {}} />);
        expect(screen.getByText('Work')).toBeInTheDocument();
    });

    test('renders checklist items', () => {
        render(<NoteCard note={mockChecklistNote} onAction={() => {}} />);
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
});
