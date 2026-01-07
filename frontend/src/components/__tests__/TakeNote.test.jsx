import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TakeNote from '../TakeNote';
import '@testing-library/jest-dom';

// Mock the service
jest.mock('../../services/note.service', () => ({
    createNote: jest.fn(() => Promise.resolve({ success: true }))
}));

describe('TakeNote Component', () => {
    test('renders initial input', () => {
        render(<TakeNote onNoteCreated={() => {}} />);
        expect(screen.getByPlaceholderText('Take a note...')).toBeInTheDocument();
    });

    test('expands on click', () => {
        render(<TakeNote onNoteCreated={() => {}} />);
        const input = screen.getByPlaceholderText('Take a note...');
        fireEvent.click(input);
        expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    });
});
